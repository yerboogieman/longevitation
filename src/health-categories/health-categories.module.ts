import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {HealthCategoriesService} from './health-categories.service';
import {HealthCategoriesController} from './health-categories.controller';
import {HealthCategory, HealthCategorySchema} from './entities/health-category.entity';

@Module({
    imports: [MongooseModule.forFeature([{name: HealthCategory.name, schema: HealthCategorySchema}])],
    controllers: [HealthCategoriesController],
    providers: [HealthCategoriesService],
})
export class HealthCategoriesModule {
}
