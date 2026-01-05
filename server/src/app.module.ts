import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HealthCategoriesModule} from './health-categories/health-categories.module';
import {HealthMarkersModule} from './health-markers/health-markers.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from '@nestjs/config';
import {HealthStatsModule} from './health-stats/health-stats.module';

@Module({
    controllers: [
        AppController,
    ],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        HealthCategoriesModule,
        HealthMarkersModule,
        HealthStatsModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: `mongodb://${configService.get('MONGO_ROOT_USERNAME')}:${configService.get('MONGO_ROOT_PASSWORD')}@localhost:${configService.get('MONGO_PORT')}/${configService.get('MONGO_DATABASE')}?authSource=admin`,
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AppService],
})
export class AppModule {
}
