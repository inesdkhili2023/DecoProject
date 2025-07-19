/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';
import { Promotion } from 'src/promotion/entities/promotion.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { SupplierModule } from 'src/supplier/supplier.module';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { SubCategory } from 'src/sub-category/entities/sub-category.entity';
import { CategoryModule } from 'src/category/category.module';
import { SubCategoryModule } from 'src/sub-category/sub-category.module';
import { ItemCartModule } from 'src/item-cart/item-cart.module';
import { ItemCart } from 'src/item-cart/entities/itemcart.entity';
import { CartModule } from 'src/cart/cart.module';
// import { Order } from 'src/order/entities/order.entity';
// import { OrderProduct } from 'src/order-product/entities/order-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      User,
      Brand,
      Promotion,
      Supplier,
      ItemCart
    ]), 

    forwardRef(() => ItemCartModule), // Utilisez forwardRef ici
    forwardRef(() => CartModule), // Ajoutez ceci
    
    SupplierModule, 
    SupabaseModule, 
    CategoryModule,
    SubCategoryModule,
    ItemCartModule, 

  ],


  providers: [ProductService],
  controllers: [ProductController],
  exports: [
    TypeOrmModule.forFeature([
      Product,
      User,
      Brand, 
      Category, 
      SubCategory, 
      Promotion, 
      ItemCart
    ]), 
    ProductService // Si utilisé par d'autres modules
  ],
})
export class ProductModule {}
