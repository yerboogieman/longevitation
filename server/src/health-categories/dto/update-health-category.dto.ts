import {PartialType} from '@nestjs/mapped-types';
import {CreateHealthCategoryDto} from './create-health-category.dto';

export class UpdateHealthCategoryDto extends PartialType(CreateHealthCategoryDto) {
}
