import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-sub-category.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
