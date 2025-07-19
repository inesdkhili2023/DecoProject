/* eslint-disable prettier/prettier */

import { IsEmail, IsEnum, IsString } from "class-validator";
import { TypeRole } from "./enums/role.enum";

export class CreateOAuthUserDto {
    @IsEmail()    email: string;
    @IsString()   name: string;
    @IsString()   lastName: string;
    @IsEnum(TypeRole)   role: TypeRole;
    
  }
  