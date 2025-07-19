/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseBoolPipe, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  // 1. Routes GET statiques (sans paramètres) 
  @Get('published/list') 
  async getPublishedCategories(): Promise<Category[]> {
    return this.categoryService.findPublished();
  }

  @Get('all/with-subcategories') 
  findAllWithSubCategories() {
    return this.categoryService.findAllWithSubCategories();
  }



  @Get()
  findAll() {
    return this.categoryService.findAll();
  }


  

  @Get('name/:name') 
  findByName(@Param('name') name: string) {
    return this.categoryService.findByName(name);
  }

  // 2. Routes GET avec paramètres - ORDRE DE SPÉCIFICITÉ
  @Get(':id/subcategories') 
  async findCategoryWithSubCategories(
    @Param('id', ParseIntPipe) idCategory: number,
  ): Promise<Category> {
    return this.categoryService.findCategoryWithSubCategories(idCategory);
  }

  @Get(':idCategory')
  findOne(@Param('idCategory', ParseIntPipe) idCategory: number) {
    return this.categoryService.findOne(idCategory);
  }

  // 3. Routes POST 
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  // 4. Routes PATCH/PUT
  @Patch(':id/publish')
  async togglePublishStatus( 
    @Param('id', ParseIntPipe) idCategory: number,
    @Body('publish', ParseBoolPipe) publish: boolean
  ): Promise<Category> {
    return this.categoryService.togglePublish(idCategory, publish);
  }

  @Patch(':idCategory')
  update(
    @Param('idCategory', ParseIntPipe) idCategory: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(idCategory, updateCategoryDto);
  }

  // 5. Routes DELETE
  @Delete(':idCategory')
  remove(@Param('idCategory', ParseIntPipe) idCategory: number) {
    return this.categoryService.remove(idCategory);
  }

  // 6. Actions en masse 
  @Patch('bulk/update-publish') 
  @UsePipes(new ValidationPipe({ transform: true })) 
  async bulkUpdatePublishStatus(
    @Body() body: { ids: number[], publish: boolean }
  ): Promise<Category[]> {
    
    if (!body.ids || !Array.isArray(body.ids)) {
      throw new BadRequestException('Les IDs doivent être un tableau');
    }
    
    if (typeof body.publish !== 'boolean') {
      throw new BadRequestException('Le statut publish doit être un boolean');
    }

    return this.categoryService.bulkTogglePublish(
      body.ids,
      body.publish
    );
  }
}