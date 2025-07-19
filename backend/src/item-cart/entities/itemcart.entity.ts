import { Cart } from "src/cart/entities/cart.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('ItemCart')
export class ItemCart {
  @PrimaryGeneratedColumn(
    'increment', {
      type: 'int',
      name: 'idItemCart',}
  )
  idItemCart: number;

  @Column({ type: 'int',
    nullable: true,
    name: 'quantity',
   })
  quantity: number;

  @Column({
    type:'double precision',
    nullable: true,
    name: 'unitPrice', })
  unitPrice: number;



  @ManyToOne(() => Cart, (cart) => cart.itemCarts, { cascade: ['insert', 'update'] }) // Cascade insert/update for Cart
  @JoinColumn({ name: 'idCart' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.itemCarts, { cascade: ['insert', 'update'] }) // Cascade insert/update for Product
  @JoinColumn({ name: 'idProduct' })
  product: Product;
}