/* eslint-disable prettier/prettier */
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    availableStock: number;

    @IsNotEmpty()
    @IsString()
    localProd: string;

    @IsString()
    picturePath: string;


    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    averageRating?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    availableColors?: string[];

    @IsOptional()
    @IsString()
    technicalSheet?: string; 

    //Category relation
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    //Brand relation
    @IsNotEmpty()
    @IsNumber()
    brandId: number;

    //Promotion relation
    @IsInt()
    @IsOptional()
    promotionId?: number;

    //Supplier relation
    @IsNotEmpty()
    @IsNumber()
    supplierId: number; 

    @IsNotEmpty()
    @IsBoolean()
    isPublished: boolean;

}