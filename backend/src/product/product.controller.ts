/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFiles,
  BadRequestException,
  Headers,
  UploadedFile,
  Put,
  Patch,
  ValidationPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductController {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productService: ProductService
  ) { }

  // Create Product 
  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      limits: {
        fileSize: 500 * 1024 * 1024, // Max 500MB per file
        files: 11 // Max 10 images + 1 technicalSheet
      }
    })
  )
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Headers('authorization') authHeader: string,
    @Body() createProductDto: CreateProductDto
  ) {
    const images: Express.Multer.File[] = [];
    let technicalSheetFile: Express.Multer.File | undefined;

    // Séparer les fichiers selon leur champ (fieldname)
    for (const file of files) {
      if (file.fieldname === 'images') {
        images.push(file);
      } else if (file.fieldname === 'technicalSheet') {
        technicalSheetFile = file;
      }
    }

    if (images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    // Vérifier et extraire le token JWT depuis le header
    if (!authHeader?.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid Authorization header format');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Missing access token');
    }

    // Appel au service avec les données correctement extraites
    return this.productService.create(
      createProductDto,
      images,
      token,
      technicalSheetFile
    );
  }

 

  
  @Get('published')
  async findPublishedProducts(): Promise<Product[]> {
    return this.productService.findPublishedProducts();
  }

  // Get all products
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  // Get product by Id - DOIT être APRÈS les routes spécifiques
  @Get(':idProduct')
  async findOne(@Param('idProduct', ParseIntPipe) idProduct: number): Promise<Product> {
    const product: Product = await this.productService.findOne(idProduct);
    return product;
  }

  // Update Product
  @Put(':idProduct')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      limits: {
        fileSize: 500 * 1024 * 1024,
        files: 11,
      },
    })
  )
  async updateProduct(
    @Param('idProduct', ParseIntPipe) idProduct: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Headers('authorization') authHeader: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    const images: Express.Multer.File[] = [];
    let technicalSheetFile: Express.Multer.File | undefined;

    for (const file of files) {
      if (file.fieldname === 'images') {
        images.push(file);
      } else if (file.fieldname === 'technicalSheet') {
        technicalSheetFile = file;
      }
    }

    if (!authHeader?.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid Authorization header format');
    }
    const token = authHeader.split(' ')[1];

    return this.productService.update(
      idProduct,
      updateProductDto,
      images,
      token,
      technicalSheetFile
    );
  }

  // Publier/dépublier un produit
  @Patch(':idProduct/publish')
  async togglePublishStatus(
    @Param('idProduct', ParseIntPipe) idProduct: number,
    @Body() body: { isPublished: boolean }
  ): Promise<Product> {
    return this.productService.togglePublishStatus(idProduct, body.isPublished);
  }

  // Delete Product
  @Delete(':idProduct')
  async remove(@Param('idProduct') idProduct: number): Promise<void> {
    return this.productService.remove(idProduct);
  }

  // Publication en lot de plusieurs produits
  @Patch('bulk-publish')
  async bulkTogglePublishStatus(
    @Body() body: { productIds: number[], isPublished: boolean }
  ): Promise<Product[]> {
    const { productIds, isPublished } = body;
    return this.productService.bulkTogglePublishStatus(productIds, isPublished);
  }

  // Find products by category
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number
  ): Promise<Product[]> {
    return this.productService.findByCategory(categoryId);
  }

}