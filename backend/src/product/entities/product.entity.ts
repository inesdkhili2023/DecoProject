/* eslint-disable prettier/prettier */
import { Brand } from "src/brand/entities/brand.entity";
import { Category } from "src/category/entities/category.entity";
import { ItemCart } from "src/item-cart/entities/itemcart.entity";
import { Promotion } from "src/promotion/entities/promotion.entity";
import { SubCategory } from "src/sub-category/entities/sub-category.entity";
import { Supplier } from "src/supplier/entities/supplier.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Product')
export class Product {
    @PrimaryGeneratedColumn()
    idProduct: number;
  
    @Column({
    type: 'text',
    nullable: true,
    name: 'title',
    })
    title: string;
  
    @Column({type: 'text'})
    description: string;
  
    @Column({
    type: 'float',
    nullable: true,
    name: 'price',
        })
    price: number;

    @Column({
    type: 'int',
    nullable: true,
    name: 'availableStock',
    })
    availableStock: number;


    @Column({
    type: 'text',
    nullable: true,
    })
    localProd: string;

    @Column('simple-array', { nullable: true })
    picturePaths: string[]; 


    @Column({
    type: 'float',
    nullable: true,
    default: 0,
    name: 'averageRating',
    })
    averageRating: number;


    @Column({
    type: 'simple-json',
    nullable: true,
    name: 'availableColors',
    })
    availableColors: string[]; 


    @Column({
    type: 'text',
    nullable: true,
    name: 'technicalSheet',
    })
    technicalSheet: string | null; 

    @Column({
        type: 'boolean',
        default: false,
        name: 'isPublished',
    })
    isPublished: boolean;


    // Category relation
    @ManyToOne(() => Category, (category) => category.products, { eager: false })
    @JoinColumn({ name: 'categoryId' })
    category: Category;
   

    // Brand relation
    @ManyToOne(() => Brand, (brand) => brand.products, { eager: false })
    @JoinColumn({ name: 'brandId' })
    brand: Brand;


    //Promotion relation
    @ManyToOne(() => Promotion, (promotion) => promotion.products, {
        eager: false,
        nullable: true,
      })
      @JoinColumn({ name: 'promotionId' })
      promotion: Promotion | null;


    // Supplier relation
    @ManyToOne(() => Supplier, (supplier) => supplier.products, { eager: false })
    @JoinColumn({ name: 'supplierId' })
    supplier: Supplier;

     // SubCategory relation
    @ManyToOne(() => SubCategory, (subCategory) => subCategory.products, { eager: false })
    @JoinColumn({ name: 'subCategoryId' })
    subCategory: SubCategory;

    //ItemCart relation
    @OneToMany(() => ItemCart, (itemCart) => itemCart.product, { cascade: ['insert', 'update', 'remove'] })
    itemCarts: ItemCart[];

}

