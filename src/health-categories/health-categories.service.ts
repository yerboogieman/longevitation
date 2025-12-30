import { Injectable } from '@nestjs/common';
import { CreateHealthCategoryDto } from './dto/create-health-category.dto';
import { UpdateHealthCategoryDto } from './dto/update-health-category.dto';

@Injectable()
export class HealthCategoriesService {
  create(createHealthCategoryDto: CreateHealthCategoryDto) {
    return 'This action adds a new healthCategory';
  }

  findAll() {
    return `This action returns all healthCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} healthCategory`;
  }

  update(id: number, updateHealthCategoryDto: UpdateHealthCategoryDto) {
    return `This action updates a #${id} healthCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} healthCategory`;
  }
}
