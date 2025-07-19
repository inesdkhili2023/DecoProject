/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import { BrandResponseDto } from 'src/brand/dto/brand-response.dto';
import { CategoryResponseDto } from 'src/category/dto/category-response.dto';
import { PromotionResponseDto } from 'src/promotion/dto/promotion-response.dto';
import { SupplierResponseDto } from 'src/supplier/dto/supplier-response.dto';

export class ProductResponseDto {
  idProduct?: number;
  title: string;
  description: string;
  price: number;
  availableStock: number;
  localProd: string;
  picturePath: string;

  @Type(() => CategoryResponseDto)
  category?: CategoryResponseDto | null; 

  @Type(() => BrandResponseDto)
  brand?: BrandResponseDto| null;

  @Type(() => PromotionResponseDto)
  promotion?: PromotionResponseDto | null;

  @Type(() => SupplierResponseDto)
  supplier?: SupplierResponseDto | null;
}