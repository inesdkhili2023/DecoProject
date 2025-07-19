/* eslint-disable prettier/prettier */
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Supplier')
export class Supplier {
  @PrimaryGeneratedColumn('increment')
  idSupplier: number;

  @Column({ type: 'text', nullable: true, name: 'nameCompany' })
  nameCompany: string;

  @Column({type: 'text', nullable: true, name: 'phone'})
  phone: string | string[];

  @Column({type: 'text', nullable: true, name: 'place'})
  place: string;

  @Column({type: 'text', nullable: true, name: 'field'})
  field: string;

  @Column({type: 'text', nullable: true, name: 'taxCode', unique: true})
  taxCode: string;

  @Column({ type: 'date', nullable: true, name: 'dealDate', unique: true }) 
  dealDate: Date;

  // Relation with Product 
  @OneToMany(() => Product, (product) => product.supplier)
  products: Product[];
}
