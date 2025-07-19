/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
    @IsOptional()
    @IsString()
    name?: string;

    picturePaths?: string[];
}
