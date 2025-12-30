import { Module } from '@nestjs/common';
import { HealthCategoriesService } from './health-categories.service';
import { HealthCategoriesController } from './health-categories.controller';

@Module({
  controllers: [HealthCategoriesController],
  providers: [HealthCategoriesService],
})
export class HealthCategoriesModule {}
