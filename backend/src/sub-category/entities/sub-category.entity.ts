import { Category } from "src/category/entities/category.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('SubCategory')
export class SubCategory {
  @PrimaryGeneratedColumn()
  idSubCategory: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  // Relation with Category 
  @ManyToOne(() => Category, (category) => category.subCategories)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  // Relation with Product 
  @OneToMany(() => Product, (product) => product.subCategory)
  products: Product[];
}