/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Supplier } from './entities/supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandModule } from 'src/brand/brand.module';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Product]),BrandModule ],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [TypeOrmModule]
})
export class SupplierModule {}
