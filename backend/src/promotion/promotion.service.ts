/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './entities/promotion.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class PromotionService {

  constructor(
    @InjectRepository(Promotion)
    private promoRepo: Repository<Promotion>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  // Create a new promotion
  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const promotion = this.promoRepo.create(createPromotionDto);
  
    if (createPromotionDto.productId) {
      const product = await this.productRepo.findOneBy({ idProduct: createPromotionDto.productId });
      if (!product) {
        throw new Error('Product not found');
      }
      promotion.products = [product];
    }
  
    return this.promoRepo.save(promotion);
  }
  

  // Get all promotions
  async findAll(): Promise<Promotion[]> {
    return this.promoRepo.find({ relations: ['products'] });
  }

  // Get a promotion by ID
  async findOne(idPromotion: number): Promise<Promotion> {
    const promotion = await this.promoRepo.findOne({
      where: { idPromotion },
      relations: ['products'],
    });
    if (!promotion) {
      throw new Error('Promotion not found');
    }
    return promotion;
  }
  // Update a promotion
  async update(idPromotion: number, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> { 
    const promotion = await this.promoRepo.findOneBy({ idPromotion });
    if (!promotion) {
      throw new Error('Promotion not found');
    }
    await this.promoRepo.update(idPromotion, updatePromotionDto);
    const updatedPromotion = await this.promoRepo.findOneBy({ idPromotion });
    if (!updatedPromotion) {
      throw new Error('Promotion not found after update');
    }
    return updatedPromotion;
  }

  // Delete a promotion
  async remove(idPromotion: number): Promise<void> {
    const promotion = await this.promoRepo.findOneBy({ idPromotion });
    if (!promotion) {
      throw new Error('Promotion not found');
    }
    await this.promoRepo.delete(idPromotion);
}
  
    // Get promotions by product ID
    async findByProductId(productId: number): Promise<Promotion[]> {
      return this.promoRepo.find({
        where: { products: { idProduct: productId } }, // Utilisez 'products' ici
        relations: ['products'], // Assurez-vous que 'products' est bien chargé
      });
    }

    //Assign a product to a promotion
    async assignProductToPromotion(promotionId: number, productId: number): Promise<Promotion> {
      const promotion = await this.promoRepo.findOne({
        where: { idPromotion: promotionId },
        relations: ['products'], // Relier avec la collection de produits
      });
    
      if (!promotion) {
        throw new Error('Promotion not found');
      }
    
      const product = await this.productRepo.findOneBy({ idProduct: productId });
      if (!product) {
        throw new Error('Product not found');
      }
    
      // Vérifier si le produit est déjà associé à une promotion
      if (product.promotion) {
        throw new Error('This product already has a promotion assigned');
      }
    
      // Ajoutez le produit à la promotion
      promotion.products.push(product); // Assurez-vous que c'est un tableau
      return await this.promoRepo.save(promotion);
    }
    
    
}
