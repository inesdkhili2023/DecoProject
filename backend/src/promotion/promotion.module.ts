/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion]),
  ProductModule, 
],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
