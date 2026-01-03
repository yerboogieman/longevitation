import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {HealthMarkersService} from './health-markers.service';
import {HealthMarkersController} from './health-markers.controller';
import {HealthMarker, HealthMarkerSchema} from './entities/health-marker.entity';
import {HealthCategory, HealthCategorySchema} from '../health-categories/entities/health-category.entity';

@Module({
    imports: [MongooseModule.forFeature([
        {name: HealthMarker.name, schema: HealthMarkerSchema},
        {name: HealthCategory.name, schema: HealthCategorySchema}
    ])],
    controllers: [HealthMarkersController],
    providers: [HealthMarkersService],
})
export class HealthMarkersModule {
}
