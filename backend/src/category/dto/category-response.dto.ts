/* eslint-disable prettier/prettier */

import { Type } from "class-transformer";
import { ProductResponseDto } from "src/product/dto/product-response.dto";


export class CategoryResponseDto {
  idCategory?: number;
  name: string;
  description?: string;

  @Type(() => ProductResponseDto)
  products?: ProductResponseDto[]
}