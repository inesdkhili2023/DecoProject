/* eslint-disable prettier/prettier */

import { IsNumber, IsOptional, IsString } from "class-validator";
import { CreateProductDto } from "./create-product.dto";
import { PartialType } from "@nestjs/mapped-types";


export class UpdateProductDto extends PartialType(CreateProductDto) {
  // @IsOptional()
  // @IsString()
  // title?: string;

  // @IsOptional()
  // @IsString()
  // description?: string;

  // @IsOptional()
  // @IsNumber()
  // price?: number;

  // @IsOptional()
  // @IsNumber()
  // availableStock?: number;

  // @IsOptional()
  // @IsString()
  // localProd?: string;

  // @IsOptional()
  // @IsString()
  // picturePath?: string;

  // @IsOptional()
  // @IsNumber()
  // brandId?: number;

  // @IsOptional()
  // @IsNumber()
  // categoryId?: number;

  // @IsOptional()
  // @IsNumber()
  // supplierId?: number;


  // @IsOptional()
  // @IsNumber()
  // promotionId?: number;
}
