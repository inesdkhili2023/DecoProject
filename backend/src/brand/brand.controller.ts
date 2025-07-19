/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFiles, BadRequestException,
  Headers
    } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { Product } from 'src/product/entities/product.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}


  // Create brand 
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024,
      files: 10
    }
  }))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Headers('authorization') authHeader: string,
    @Body() createBrandDto: CreateBrandDto
  ): Promise<Brand> {
    // Extraction du token
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Missing access token');
    }

    return this.brandService.create(createBrandDto, files, token);
  }


  // Add images to an existing brand
  @Post(':idBrand/images') 
  @UseInterceptors(FilesInterceptor('images', 10))
  async addImages(
    @Param('idBrand') idBrand: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Headers('authorization') authHeader: string
  ): Promise<Brand> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Missing access token');
    }

    return this.brandService.addImages(idBrand, files, token);
  }
  
  @Get()
  async findAll(): Promise<Brand[]> {
    return await this.brandService.findAll();
  }

  @Get(':idBrand')
  async findOne(@Param('idBrand') idBrand: number): Promise<Brand> {
    return await this.brandService.findOne(idBrand);
  }

  @Get('name')
  async findByName(@Query('name') name: string): Promise<Brand> {
    return await this.brandService.findByName(name);
  }

  @Put(':idBrand')
  async update(
    @Param('idBrand') idBrand: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    return await this.brandService.update(idBrand, updateBrandDto);
  }

  @Delete(':idBrand')
  async remove(@Param('idBrand') idBrand: number): Promise<void> {
    return await this.brandService.remove(idBrand);
  }


  @Get(':idBrand/products')
  async findProductsByBrand(@Param('idBrand') idBrand: number): Promise<Product[]> {
    return await this.brandService.findProductsByBrand(idBrand);
  }

}
