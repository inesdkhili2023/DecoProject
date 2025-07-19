/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Brand } from '../brand/entities/brand.entity';
import { Category } from '../category/entities/category.entity';
import { Supplier } from '../supplier/entities/supplier.entity';
import { Promotion } from '../promotion/entities/promotion.entity';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    private readonly supabase: SupabaseService,
  ) { }

  // Create Product 
  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
    userToken: string,
    technicalSheetFile?: Express.Multer.File
  ): Promise<Product> {
    if (!userToken) {
      throw new UnauthorizedException('User token is required');
    }

    const [brand, category, supplier, promotion] = await Promise.all([
      this.brandRepository.findOneBy({ idBrand: createProductDto.brandId }),
      this.categoryRepository.findOneBy({ idCategory: createProductDto.categoryId }),
      this.supplierRepository.findOneBy({ idSupplier: createProductDto.supplierId }),
      createProductDto.promotionId
        ? this.promotionRepository.findOneBy({ idPromotion: createProductDto.promotionId })
        : Promise.resolve(null),
    ]);

    if (!brand) throw new NotFoundException('Brand not found');
    if (!category) throw new NotFoundException('Category not found');
    if (!supplier) throw new NotFoundException('Supplier not found');
    if (createProductDto.promotionId && !promotion) {
      throw new NotFoundException('Promotion not found');
    }

    const cleanCategoryName = category.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

    const product = this.productRepository.create({
      title: createProductDto.title,
      description: createProductDto.description,
      price: createProductDto.price,
      availableStock: createProductDto.availableStock,
      localProd: createProductDto.localProd,
      picturePaths: [],
      brand,
      category,
      supplier,
      ...(promotion && { promotion }),
      averageRating: createProductDto.averageRating || 0,
      availableColors: createProductDto.availableColors || [],
      technicalSheet: null,
    });

    const savedProduct = await this.productRepository.save(product);

    const picturePaths: string[] = [];
    for (const file of files) {
      const path = await this.supabase.uploadProductImage(
        file,
        userToken,
        cleanCategoryName,
        savedProduct.idProduct
      );
      picturePaths.push(path);
    }

    if (technicalSheetFile) {
      const technicalSheetPath = await this.supabase.uploadTechnicalSheet(
        technicalSheetFile,
        userToken,
        cleanCategoryName,
        savedProduct.idProduct
      );
      savedProduct.technicalSheet = technicalSheetPath;
    }

    savedProduct.picturePaths = picturePaths;
    return await this.productRepository.save(savedProduct);
  }

  // Find All Products
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['brand', 'category', 'supplier', 'promotion'],
    });
  }

  // Find One Product 
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { idProduct: id },
      relations: ['brand', 'category', 'supplier', 'promotion'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Remove Product 
  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ idProduct: id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.remove(product);
  }

  // Update Product 
  async update(
    idProduct: number,
    updateProductDto: UpdateProductDto,
    files: Express.Multer.File[],
    userToken: string,
    technicalSheetFile?: Express.Multer.File
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({ idProduct });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const [brand, category, supplier, promotion] = await Promise.all([
      updateProductDto.brandId
        ? this.brandRepository.findOneBy({ idBrand: updateProductDto.brandId })
        : Promise.resolve(product.brand),
      updateProductDto.categoryId
        ? this.categoryRepository.findOneBy({ idCategory: updateProductDto.categoryId })
        : Promise.resolve(product.category),
      updateProductDto.supplierId
        ? this.supplierRepository.findOneBy({ idSupplier: updateProductDto.supplierId })
        : Promise.resolve(product.supplier),
      updateProductDto.promotionId
        ? this.promotionRepository.findOneBy({ idPromotion: updateProductDto.promotionId })
        : Promise.resolve(product.promotion),
    ]);

    const cleanCategoryName = ((category && category.name) ? category.name : product.category.name)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

    // Mise à jour des champs
    Object.assign(product, {
      ...updateProductDto,
      brand,
      category,
      supplier,
      promotion: promotion ?? null,
    });

    // Suppression ou mise à jour des anciennes images si des nouvelles sont fournies
    if (files?.length) {
      const picturePaths: string[] = [];
      for (const file of files) {
        const path = await this.supabase.uploadProductImage(
          file,
          userToken,
          cleanCategoryName,
          product.idProduct
        );
        picturePaths.push(path);
      }
      product.picturePaths = picturePaths;
    }

    // Mise à jour de la fiche technique si un nouveau fichier est fourni
    if (technicalSheetFile) {
      const technicalSheetPath = await this.supabase.uploadTechnicalSheet(
        technicalSheetFile,
        userToken,
        cleanCategoryName,
        product.idProduct
      );
      product.technicalSheet = technicalSheetPath;
    }

    return await this.productRepository.save(product);
  }

  // Publier/dépublier un produit
  async togglePublishStatus(id: number, isPublished: boolean): Promise<Product> {
    const product = await this.productRepository.findOneBy({ idProduct: id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.isPublished = isPublished;
    return this.productRepository.save(product);
  }

  // Récupérer les produits publiés
  async findPublishedProducts(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isPublished: true },
      relations: ['brand', 'category', 'supplier', 'promotion'],
    });
  }

  // Publication en lot de plusieurs produits
  async bulkTogglePublishStatus(productIds: number[], isPublished: boolean): Promise<Product[]> {
    if (!productIds || productIds.length === 0) {
      throw new BadRequestException('Product IDs array cannot be empty');
    }

    const products = await this.productRepository.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new NotFoundException('Some products were not found');
    }

    // Mettre à jour tous les produits
    products.forEach(product => {
      product.isPublished = isPublished;
    });

    return await this.productRepository.save(products);
  }

// Find Products by Category
  async findByCategory(categoryId: number): Promise<Product[]> {
  return this.productRepository.find({
    where: {
      category: {
        idCategory: categoryId
      }
    },
    relations: ['brand', 'category', 'supplier', 'promotion'],
  });
}

}