import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { User } from 'src/user/entities/user.entity';
import { ItemCart } from 'src/item-cart/entities/itemcart.entity';
import { UserModule } from 'src/user/user.module';
import { ItemCartModule } from 'src/item-cart/item-cart.module';
import { Product } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';

// cart.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, User]),

    forwardRef(() => ItemCartModule),
    forwardRef(() => ProductModule), 
    
    UserModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [TypeOrmModule.forFeature([Cart])],
})
export class CartModule {}
