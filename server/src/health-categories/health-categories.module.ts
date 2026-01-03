import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {HealthCategoriesService} from './health-categories.service';
import {HealthCategoriesController} from './health-categories.controller';
import {HealthCategory, HealthCategorySchema} from './entities/health-category.entity';
import {HealthMarker, HealthMarkerSchema} from '../health-markers/entities/health-marker.entity';

@Module({
    imports: [MongooseModule.forFeature([
        {name: HealthCategory.name, schema: HealthCategorySchema},
        {name: HealthMarker.name, schema: HealthMarkerSchema}
    ])],
    controllers: [HealthCategoriesController],
    providers: [HealthCategoriesService],
})
export class HealthCategoriesModule {
}
