import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthCategoriesService } from './health-categories.service';
import { CreateHealthCategoryDto } from './dto/create-health-category.dto';
import { UpdateHealthCategoryDto } from './dto/update-health-category.dto';
import { UpdateSingleFieldDto } from '../dto/update-single-field.dto';

@Controller('health-categories')
export class HealthCategoriesController {
  constructor(private readonly healthCategoriesService: HealthCategoriesService) {}

  @Post()
  create(@Body() createHealthCategoryDto: CreateHealthCategoryDto) {
    return this.healthCategoriesService.create(createHealthCategoryDto);
  }

  @Get()
  findAll() {
    return this.healthCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthCategoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHealthCategoryDto: UpdateHealthCategoryDto) {
    return this.healthCategoriesService.update(id, updateHealthCategoryDto);
  }

  @Patch('field/update')
  updateField(@Body() updateSingleFieldDto: UpdateSingleFieldDto) {
    return this.healthCategoriesService.updateField(updateSingleFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthCategoriesService.remove(id);
  }
}
