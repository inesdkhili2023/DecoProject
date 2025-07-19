/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Product } from 'src/product/entities/product.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { SupabaseService } from 'src/supabase/supabase.service';


@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>, 
    private readonly supabase: SupabaseService,

  ) {}

  // Create brand
  async create(
  createBrandDto: CreateBrandDto,
  files?: Express.Multer.File[],
  userToken?: string
): Promise<Brand> {
  // Créez d'abord la marque sans images
  const brand = this.brandRepository.create({
    ...createBrandDto,
    picturePaths: [] // Initialisez avec un tableau vide
  });

  // Sauvegardez pour obtenir l'ID
  const savedBrand = await this.brandRepository.save(brand);

  // Upload des images si fournies
  if (files && files.length > 0 && userToken) {
    const picturePaths = await Promise.all(
      files.map(file => 
        this.supabase.uploadBrandImage(file, userToken, savedBrand.idBrand)
      )
    );
    
    // Mettez à jour avec les chemins d'images
    return this.brandRepository.save({
      ...savedBrand,
      picturePaths
    });
  }

  return savedBrand;
}


  // Add images to an existing brand
  async addImages(
    idBrand: number,
    files: Express.Multer.File[],
    userToken: string
  ): Promise<Brand> {
    const brand = await this.findOne(idBrand);
    if (!brand.picturePaths) {
      brand.picturePaths = [];
    }

    for (const file of files) {
      const path = await this.supabase.uploadBrandImage(
        file, 
        userToken,
        brand.idBrand
      );
      brand.picturePaths.push(path);
    }

    return await this.brandRepository.save(brand);
  }
  

  // Get all brands
  async findAll(): Promise<Brand[]> {
    return await this.brandRepository.find({ relations: ['products'] });
  }

  // Get a brand by ID
  async findOne(idBrand: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { idBrand },
      relations: ['products'],
    });
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  }

  // Get a brand by name
  async findByName(name: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ where: { name } });
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  }

  //update a brand
  async update(idBrand: number, updateBrandDto:UpdateBrandDto ): Promise<Brand> {
    const brand = await this.findOne(idBrand);
    if (!brand) {
      throw new Error('Brand not found');
    }
    Object.assign(brand, updateBrandDto);
    return await this.brandRepository.save(brand);
  }
  
  // Delete a brand
  async remove(idBrand: number): Promise<void> {
    const brand = await this.findOne(idBrand);
    if (!brand) {
      throw new Error('Brand not found');
    }
    await this.brandRepository.remove(brand);
  }

  // Get all products of a brand
  async findProductsByBrand(idBrand: number): Promise<Product[]> {
    const brand = await this.findOne(idBrand);
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand.products;
  }

  

}
