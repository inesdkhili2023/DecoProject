/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import {
  Controller,

  Post,
  Body,
  UseGuards,
  Get,
  Req,


} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TypeRole } from './dto/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';




@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  //Retrieve the logged in user
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user; //returns the logged in user (decoded from the JWT)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TypeRole.SUPER_ADMIN, TypeRole.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }


  
}
