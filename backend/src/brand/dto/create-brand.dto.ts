/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    picturePaths?: string[];
}
