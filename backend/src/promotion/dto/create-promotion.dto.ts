/* eslint-disable prettier/prettier */
import { IsDateString,IsInt,IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

export class CreatePromotionDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  //Product relation
  @IsOptional()
  @IsInt()
  productId: number;
}
