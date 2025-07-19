/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Transform, Type } from "class-transformer";
import { ProductResponseDto } from "src/product/dto/product-response.dto";


export class SupplierResponseDto {
  idSupplier?: number;
  nameCompany?: string;
  phone?: string | string[]; // Exactement comme le frontend
  place?: string;
  field?: string;
  taxCode?: string;

  @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
  dealDate?: Date | string;  // Compatible avec frontend

  @Type(() => ProductResponseDto)
  products?: ProductResponseDto[]; // Relation circulaire mais contrôlée
}