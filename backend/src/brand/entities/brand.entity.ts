/* eslint-disable prettier/prettier */
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Brand')
export class Brand {

    @PrimaryGeneratedColumn('increment')
    idBrand: number;
  
    @Column({type: 'text', nullable: true,})
    name: string;

    @Column('simple-array', { nullable: true })
    picturePaths: string[]; 
    
    //Relation with Product 
    @OneToMany(() => Product, product => product.brand)
    products: Product[];

}
