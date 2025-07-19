import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  //create
  async create(createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory> {
  const subCategory = new SubCategory();
  subCategory.name = createSubCategoryDto.name;
  
  // Gestion explicite du cas undefined
  subCategory.description = createSubCategoryDto.description ?? '';
  
  // Assignation de la relation
  const category = new Category();
  category.idCategory = createSubCategoryDto.categoryId;
  subCategory.category = category;

  return await this.subCategoryRepository.save(subCategory);
}



 // FIND ALL
  async findAll(): Promise<SubCategory[]> {
    return await this.subCategoryRepository.find({
      relations: ['category'],
    });
  }

  // FIND ONE
 async findOne(id: number): Promise<SubCategory> {
  const subCategory = await this.subCategoryRepository.findOne({
    where: { idSubCategory: id },
    relations: ['category', 'products'],
  });

  if (!subCategory) {
    throw new NotFoundException(`SubCategory with ID ${id} not found`);
  }

  return subCategory; // Assurez-vous de retourner l'entité SubCategory
}



  // UPDATE
  async update(
    id: number,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    const subCategory = await this.findOne(id);

    if (updateSubCategoryDto.name) {
      subCategory.name = updateSubCategoryDto.name;
    }
    
    if (updateSubCategoryDto.description !== undefined) {
      subCategory.description = updateSubCategoryDto.description ?? '';
    }
    
    if (updateSubCategoryDto.categoryId) {
      const category = new Category();
      category.idCategory = updateSubCategoryDto.categoryId;
      subCategory.category = category;
    }

    return await this.subCategoryRepository.save(subCategory);
  }



  // DELETE
  async remove(id: number): Promise<void> {
    const result = await this.subCategoryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }
  }
}
