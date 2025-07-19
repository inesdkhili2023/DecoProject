import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { TypeRole } from './enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('TN', { message: 'Phone number must be valid' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  age?: number;

  @IsNotEmpty()
  @IsEnum(TypeRole)
  role: TypeRole;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  password: string;
}
