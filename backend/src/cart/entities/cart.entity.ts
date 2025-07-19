import { ItemCart } from "src/item-cart/entities/itemcart.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Cart')
  export class Cart {
    @PrimaryGeneratedColumn('increment', {
      type: 'int',
      name: 'idCart',
    })
    idCart: number;
  
    @Column({
      type: 'int',
      nullable: true,
      name: 'nbrItem',
    })
    nbrItem: number;
  
    @Column({
      type:'double precision',
      nullable: true,
      name: 'totalPrice',
    })
    totalPrice: number;

    @Column({ default: 'active' })
    status: string;
    
    
    @ManyToOne(() => User, (user) => user.carts) 
    user: User;
    
  @OneToMany(() => ItemCart, (itemCart) => itemCart.cart, { cascade: ['insert', 'update', 'remove'] }) 
  itemCarts: ItemCart[];

//   @OneToOne(() => Order, (order) => order.cart)
//   order: Order;

  }