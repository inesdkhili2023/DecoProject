/* eslint-disable prettier/prettier */
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Promotion')
export class Promotion {

    @PrimaryGeneratedColumn('increment')
    idPromotion: number;
  
    @Column({type: 'text', nullable: true, name: 'name', unique: true})
    name: string;
  
    @Column({type:'float', nullable: true, name: 'percentage'})
    percentage: number;
  
    @Column({ type: 'date', nullable: true, name: 'startDate' })
    startDate: Date;
  
    @Column({ type: 'date', nullable: true, name: 'endDate' })
    endDate: Date;

    @OneToMany(() => Product, (product) => product.promotion)
    products: Product[];

}
