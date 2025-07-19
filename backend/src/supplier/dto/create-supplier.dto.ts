/* eslint-disable prettier/prettier */
import { IsArray, IsDateString, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateSupplierDto {
    @IsNotEmpty()
    @IsString()
    nameCompany: string;
  
    @IsNotEmpty()
    @IsArray()
    phone: string;
  
    @IsNotEmpty()
    @IsString()
    place: string;
  
    @IsNotEmpty()
    @IsString()
    field: string;
  
    @IsNotEmpty()
    @Length(5, 20)
    taxCode: string;
  
    @IsNotEmpty()
    @IsDateString()
    dealDate: string;

  }