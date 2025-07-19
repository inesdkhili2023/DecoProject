/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { ProductResponseDto } from "src/product/dto/product-response.dto";


export class BrandResponseDto {
  idBrand?: number;
  name?: string;
  picturePaths?: string[];

  @Type(() => ProductResponseDto)
  products?: ProductResponseDto[]
  }