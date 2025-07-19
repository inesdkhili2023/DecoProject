import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand } from './entities/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [TypeOrmModule.forFeature([Brand]),
  SupabaseModule 
],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [TypeOrmModule],
})
export class BrandModule {}
