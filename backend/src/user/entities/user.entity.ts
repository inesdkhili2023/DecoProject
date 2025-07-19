/* eslint-disable prettier/prettier */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TypeRole } from '../dto/enums/role.enum';
import { Cart } from 'src/cart/entities/cart.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column({
    type: 'text',
    unique: false,
    nullable: true,
    name: 'name',
  })
  name: string;

  @Column({
    type: 'text',
    unique: false,
    nullable: true,
    name: 'lastName',
  })
  lastName: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
    name: 'email',
  })
  email: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
    name: 'phone',
  })
  phone: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'address',
  })
  address: string;

  @Column({ type: 'int', name: 'age'})
  age: number;

  @Column({ type: 'enum', 
    enum: TypeRole,
  nullable: true,
  name: 'role',
})
  role: TypeRole;

  @Column({
    type: 'text',
    unique: true,
    nullable: true,
    name: 'password',
  })
  password: string;


  @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
    carts: Cart[];

}
