/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { TypeRole } from 'src/user/dto/enums/role.enum';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}


  // Register for ADMIN (Protected route)
  @Post('register')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TypeRole.SUPER_ADMIN, TypeRole.ADMIN)
  async register(@Body() createUserDto: CreateUserDto, @Req() req) {
    const currentUser = req.user;

    if (createUserDto.role === TypeRole.SUPER_ADMIN) {
      throw new UnauthorizedException('SUPER_ADMIN cannot be assigned manually.');
    }

    if (
      currentUser.role === TypeRole.ADMIN &&
      createUserDto.role !== TypeRole.CUSTOMER
    ) {
      throw new UnauthorizedException('ADMIN can only create CUSTOMER users.');
    }

    return this.authService.signUp(createUserDto);
  }

  // Register for CUSTOMER (Public route)
  @Post('register-customer')
  async publicRegisterCustomer(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.role !== TypeRole.CUSTOMER) {
      throw new UnauthorizedException('Only CUSTOMER role is allowed in public registration.');
    }
    return this.authService.signUp(createUserDto);
  }

  // Login an existing user
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signIn(email, password);
  }

  // Forgot password
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  // Reset password
  @Post('reset-password')
  async resetPassword(
    @Body('access_token') accessToken: string,
    @Body('new_password') newPassword: string,
  ) {
    return this.authService.resetPassword(newPassword, accessToken);
  }



  // Google and Facebook OAuth authentication :
  // @UseGuards(AuthGuard('google'))
  // @Get('google')
  // async googleAuth() {
    
  // }

  // @UseGuards(AuthGuard('google'))
  // @Get('google/redirect')
  // googleAuthRedirect(@Req() req: ExpressRequest & { user: any }) {
  //   return req.user;
  // }

  // @UseGuards(AuthGuard('facebook'))
  // @Get('facebook')
  // async facebookAuth() {
    
  // }

  // @UseGuards(AuthGuard('facebook'))
  // @Get('facebook/redirect')
  // facebookAuthRedirect(@Req() req: ExpressRequest & { user: any }) {
  //   return req.user;
  // }
}
