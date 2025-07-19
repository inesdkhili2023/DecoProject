/* eslint-disable prettier/prettier */
import { Product } from "src/product/entities/product.entity";
import { SubCategory } from "src/sub-category/entities/sub-category.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Category')
export class Category {

  @PrimaryGeneratedColumn()
  idCategory: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false }) 
  isPublished: boolean;

  //Relation with Product 
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  // Relation with SubCategory 
   @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories: SubCategory[];

}
