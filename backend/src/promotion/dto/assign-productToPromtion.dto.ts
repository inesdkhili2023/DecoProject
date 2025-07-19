/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty } from "class-validator";
export class AssignProductToPromotionDto {
    @IsNotEmpty()
    @IsInt()
    productId: number;
  }
  