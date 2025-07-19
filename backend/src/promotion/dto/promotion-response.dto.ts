/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Transform, Type } from "class-transformer";
import { ProductResponseDto } from "src/product/dto/product-response.dto";



export class PromotionResponseDto {
  idPromotion?: number;
  name?: string;
  percentage?: number;
  
  @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
  startDate?: Date | string; // Compatible avec frontend

  @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
  endDate?: Date | string;   // Compatible avec frontend

  @Type(() => ProductResponseDto)
  product?: ProductResponseDto; // Relation circulaire gérée
}