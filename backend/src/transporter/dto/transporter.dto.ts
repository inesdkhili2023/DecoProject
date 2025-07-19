import { ArrayMinSize, ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateTransporterDto {
    @IsString()
    @IsNotEmpty()
    nameCompany: string;
  
    @IsArray()
    phones: string[];  

    @IsString()
    @IsNotEmpty()
    taxCode: string;
  
    @IsNotEmpty()
    dealdate: Date;
  
    @IsString()
    areaOperation: string;
  }