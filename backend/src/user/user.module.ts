/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/cart/entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart])], 
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService,
    TypeOrmModule.forFeature([User]), 
  ],
})
export class UserModule {}
