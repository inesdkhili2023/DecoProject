/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Put, Patch, ParseIntPipe } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';
import { AssignProductToPromotionDto } from './dto/assign-productToPromtion.dto';

@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  async create(@Body() createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    return this.promotionService.create(createPromotionDto);
  }

  @Get()
  async findAll(): Promise<Promotion[]> {
    return this.promotionService.findAll();
  }

  @Get(':idPromotion')
  async findOne(@Param('idPromotion') idPromotion: number): Promise<Promotion> {
    return this.promotionService.findOne(idPromotion);
  }

  @Put(':idPromotion')
  async update(
    @Param('idPromotion') idPromotion: number,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ): Promise<Promotion> {
    return this.promotionService.update(idPromotion, updatePromotionDto);
  }

  @Delete(':idPromotion')
  async remove(@Param('idPromotion') idPromotion: number): Promise<void> {
    return this.promotionService.remove(idPromotion);
  }

  // Get promotions by product ID
  @Get('product/:idProduct')
  async findByProductId(@Param('idProduct') idProduct: number): Promise<Promotion[]> {
    return this.promotionService.findByProductId(idProduct);
  }

  @Patch(':id/assign-product')
  async assignProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AssignProductToPromotionDto
  ): Promise<Promotion> {
  return this.promotionService.assignProductToPromotion(id, body.productId);
}

}
