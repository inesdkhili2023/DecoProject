import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory } from './entities/sub-category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('sub-category')
export class SubCategoryController {
  constructor(
    private readonly subCategoryService: SubCategoryService
  ) {}

// POST - Create a new subcategory
  @Post()
  async create(
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategory> {
    return this.subCategoryService.create(createSubCategoryDto);
  }


  // GET - Retrieve all subcategories
  @Get()
  async findAll(): Promise<SubCategory[]> {
    return this.subCategoryService.findAll();
  }

// GET - Retrieve a subcategory by ID
  @Get(':id')
async findOne(
  @Param('id', ParseIntPipe) id: number
): Promise<SubCategory> { // Le type de retour doit correspondre
  return this.subCategoryService.findOne(id);
}


  // PUT - Update a subcategory
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  // DELETE - Delete a subcategory
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.subCategoryService.remove(id);
  }
}
