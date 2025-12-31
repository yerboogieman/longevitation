import {Module, OnModuleInit} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HealthCategoriesModule} from './health-categories/health-categories.module';
import {HealthMarkersModule} from './health-markers/health-markers.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from '@nestjs/config';
import { HealthStatsModule } from './health-stats/health-stats.module';
import { UsersModule } from './users/users.module';
import {HealthMarkerUtil} from "./health-markers/health-marker-utils";
import {scoringFunctions} from "./health-markers/scoring-functions";
import {HealthMarkersController} from "./health-markers/health-markers.controller";
import {HealthCategoriesController} from "./health-categories/health-categories.controller";

@Module({
    controllers: [
        AppController,
        HealthCategoriesController,
        HealthMarkersController,
    ],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        HealthCategoriesModule,
        HealthMarkersModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: `mongodb://${configService.get('MONGO_ROOT_USERNAME')}:${configService.get('MONGO_ROOT_PASSWORD')}@localhost:${configService.get('MONGO_PORT')}/${configService.get('MONGO_DATABASE')}?authSource=admin`,
            }),
            inject: [ConfigService],
        }),
        HealthStatsModule,
        UsersModule,
    ],
    providers: [AppService],
})
export class AppModule implements OnModuleInit {
    onModuleInit() {
        // Register health marker scoring functions
        HealthMarkerUtil.register(scoringFunctions);
        console.log('HealthMarkerUtil initialized');
    }
}
