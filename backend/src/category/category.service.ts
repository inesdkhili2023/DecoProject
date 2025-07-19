/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }


  //Add a new category
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  // Get all categories
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['products'] });
  }

  // Get a category by ID
  async findOne(idCategory: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { idCategory },
      relations: ['products'],
    });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  // Get a category by name
  async findByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { name } });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  // Update a category
  async update(idCategory: number, updateDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(idCategory);
    Object.assign(category, updateDto);
    return this.categoryRepository.save(category);
  }

  // Delete a category
  async remove(idCategory: number): Promise<void> {
    const category = await this.findOne(idCategory);
    if (!category) {
      throw new Error('Category not found');
    }
    await this.categoryRepository.remove(category);
  }

  // Retrieve subcategories from category
  async findCategoryWithSubCategories(idCategory: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { idCategory },
      relations: ['subCategories', 'subCategories.products'], // Charge les sous-catégories et leurs produits
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${idCategory} not found`);
    }

    return category;
  }

  // Find All With SubCategories
  async findAllWithSubCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['subCategories', 'subCategories.products']
    });
  }

  // Find all published categories with subcategories
  async findPublished(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isPublished: true },
      relations: ['subCategories']
    });
  }

  async togglePublish(idCategory: number, publish: boolean): Promise<Category> {
    const category = await this.findOne(idCategory);
    category.isPublished = publish;
    return this.categoryRepository.save(category);
  }

  async bulkTogglePublish(ids: number[], publish: boolean): Promise<Category[]> {
    const categories = await this.categoryRepository.findByIds(ids);
    categories.forEach(cat => cat.isPublished = publish);
    return this.categoryRepository.save(categories);
  }
  


}
