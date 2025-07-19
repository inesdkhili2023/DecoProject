import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { ItemCart } from 'src/item-cart/entities/itemcart.entity';

@Injectable()
export class CartService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    @InjectRepository(Product)
    private ProductRepository: Repository<Product>,
    @InjectRepository(Cart)
    private CartRepository: Repository<Cart>,
    @InjectRepository(ItemCart)
    private ItemCartRepository: Repository<ItemCart>,
  ) {}

  
  // Recalculate total items and price
  private recalculateCartTotals(cart: Cart): void {
    cart.nbrItem = (cart.itemCarts ?? []).reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = (cart.itemCarts ?? []).reduce((sum, item) => sum + item.unitPrice, 0);
  }

  // Add product to cart
  async addToCart(userId: number, productId: number, quantity: number): Promise<Cart> {
    return await this.dataSource.transaction(async manager => {
      const user = await manager.findOne(User, {
        where: { idUser: userId },
        relations: ['carts'],
      });
      if (!user) throw new NotFoundException('User not found');
  
      // Create active cart
      let cart: Cart | null | undefined = user.carts?.find(c => c.status === 'active');
      if (!cart) {
        cart = manager.create(Cart, {
          user,
          totalPrice: 0,
          nbrItem: 0,
          status: 'active',
          itemCarts: [],
        });
        cart = await manager.save(Cart, cart);
      }
  
      // Load full cart with itemCarts
      cart = await manager.findOne(Cart, {
        where: { idCart: cart.idCart },
        relations: ['itemCarts', 'itemCarts.product'],
      });
  
      if (!cart) throw new NotFoundException('Cart not found');
      cart.itemCarts = cart.itemCarts ?? [];
  
      const product = await manager.findOne(Product, {
        where: { idProduct: productId },
      });
      if (!product) throw new NotFoundException('Product not found');
  
      if (product.availableStock < quantity) {
        throw new BadRequestException('Not enough stock available');
      }
  
      let itemCart = cart.itemCarts.find(item => item.product.idProduct === productId);
  
      if (itemCart) {
        if (itemCart.quantity + quantity > product.availableStock) {
          throw new BadRequestException('Not enough stock for this quantity');
        }
        itemCart.quantity += quantity;
        itemCart.unitPrice = itemCart.quantity * product.price;
      } else {
        itemCart = manager.create(ItemCart, {
          cart,
          product,
          quantity,
          unitPrice: quantity * product.price,
        });
        cart.itemCarts.push(itemCart);
      }
  
      await manager.save(ItemCart, itemCart);
  
      // Update product stock
      product.availableStock -= quantity;
      await manager.save(Product, product);
  
      // Recalculate and save cart
      this.recalculateCartTotals(cart);
      return await manager.save(Cart, cart);
    });
  }
  

  // Get user's active cart
  async getCart(userId: number): Promise<Cart> {
    const user = await this.UserRepository.findOne({
      where: { idUser: userId },
      relations: ['carts'],
    });
    if (!user) throw new NotFoundException('User not found');

    const activeCart = user.carts.find(c => c.status === 'active');
    if (!activeCart) throw new NotFoundException('Active cart not found');

    const cart = await this.CartRepository.findOne({
      where: { idCart: activeCart.idCart },
      relations: ['itemCarts', 'itemCarts.product'],
    });

    if (!cart) throw new NotFoundException('Cart not found');
    cart.itemCarts = cart.itemCarts ?? [];

    return cart;
  }

  // Remove item from cart
  async removeItemFromCart(cartId: number, productId: number, quantityToRemove: number): Promise<Cart> {
    return await this.dataSource.transaction(async manager => {
      const cart = await manager.findOne(Cart, {
        where: { idCart: cartId },
        relations: ['itemCarts', 'itemCarts.product'],
      });
      if (!cart) throw new NotFoundException('Cart not found');

      cart.itemCarts = cart.itemCarts ?? [];

      const itemCart = cart.itemCarts.find(item => item.product.idProduct === productId);
      if (!itemCart) throw new NotFoundException('Product not found in cart');

      const product = itemCart.product;

      if (itemCart.quantity <= quantityToRemove) {
        cart.itemCarts = cart.itemCarts.filter(item => item.product.idProduct !== productId);
        await manager.remove(ItemCart, itemCart);
      } else {
        itemCart.quantity -= quantityToRemove;
        itemCart.unitPrice = itemCart.quantity * product.price;
        await manager.save(ItemCart, itemCart);
      }

      product.availableStock += quantityToRemove;
      await manager.save(Product, product);

      this.recalculateCartTotals(cart);
      return await manager.save(Cart, cart);
    });
  }


  // Remove all items for a product from the cart
  async removeProductCompletely(cartId: number, productId: number): Promise<Cart> {
  return await this.dataSource.transaction(async manager => {
    const cart = await manager.findOne(Cart, {
      where: { idCart: cartId },
      relations: ['itemCarts', 'itemCarts.product'],
    });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.itemCarts = cart.itemCarts ?? [];

    const itemCart = cart.itemCarts.find(item => item.product.idProduct === productId);
    if (!itemCart) throw new NotFoundException('Product not found in cart');

    // Remettre la quantité dans le stock du produit
    const product = itemCart.product;
    product.availableStock += itemCart.quantity;
    await manager.save(Product, product);

    // Supprimer l'item du panier
    cart.itemCarts = cart.itemCarts.filter(item => item.product.idProduct !== productId);
    await manager.remove(ItemCart, itemCart);

    this.recalculateCartTotals(cart);
    return await manager.save(Cart, cart);
  });
}

}
