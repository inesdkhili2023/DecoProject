/* eslint-disable prettier/prettier */
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { BrandModule } from './brand/brand.module';
import { Brand } from './brand/entities/brand.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { PromotionModule } from './promotion/promotion.module';
import { Promotion } from './promotion/entities/promotion.entity';
import { SupplierModule } from './supplier/supplier.module';
import { Supplier } from './supplier/entities/supplier.entity';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { SubCategory } from './sub-category/entities/sub-category.entity';
import { TransporterModule } from './transporter/transporter.module';
import { CartModule } from './cart/cart.module';
import { ItemCartModule } from './item-cart/item-cart.module';




@Module({
  imports: [
    // 1. Configuration de base (inchangé)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),

    // 2. Modules indépendants (aucune dépendance externe)
    AuthModule,
    MailModule,
    TransporterModule,
    BrandModule,
    CategoryModule,
    SubCategoryModule,
    PromotionModule,
    SupplierModule,
    UserModule,

    // 3. Modules interdépendants (avec dépendances circulaires)
    ProductModule,  // Doit venir avant CartModule et ItemCartModule
    CartModule,
    ItemCartModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}