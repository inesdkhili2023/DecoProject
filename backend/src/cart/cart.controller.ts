import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';

@Controller('cart')
export class CartController {

  constructor(private readonly cartService: CartService) { }


  @Post('add/:userId/:productId')
  async addToCart(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,): Promise<Cart> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @Get(':userId')
  async getCart(
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<Cart> {
    return this.cartService.getCart(userId);
  }



  @Delete(':cartId/remove-item')
  async removeItemFromCart(@Param('cartId', ParseIntPipe) cartId: number, @Query('productId', ParseIntPipe) productId: number, @Query('quantity', ParseIntPipe) quantityToRemove: number,
  ): Promise<Cart> {
    if (quantityToRemove <= 0) {
      throw new BadRequestException('Quantity to remove must be greater than zero');
    }
    return this.cartService.removeItemFromCart(cartId, productId, quantityToRemove);
  }

  // Remove all items for a product from the cart
  @Delete(':cartId/remove-product')
  async removeProductCompletely(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Query('productId', ParseIntPipe) productId: number
  ): Promise<Cart> {
    return this.cartService.removeProductCompletely(cartId, productId);
  }



}
