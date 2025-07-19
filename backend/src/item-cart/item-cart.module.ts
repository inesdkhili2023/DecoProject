import { forwardRef, Module } from '@nestjs/common';
import { ItemCartService } from './item-cart.service';
import { ItemCartController } from './item-cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCart } from './entities/itemcart.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { CartModule } from 'src/cart/cart.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemCart]),
    
    forwardRef(() => CartModule),
    forwardRef(() => ProductModule),
  
  ],
  controllers: [ItemCartController],
  providers: [ItemCartService],
  exports: [TypeOrmModule.forFeature([ItemCart])],
})
export class ItemCartModule {}
