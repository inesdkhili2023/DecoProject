import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSubCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number; 
}


