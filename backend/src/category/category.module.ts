/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SubCategoryModule } from 'src/sub-category/sub-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => SubCategoryModule), 
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService, TypeOrmModule]
})
export class CategoryModule {}


