import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {HealthStatsService} from './health-stats.service';
import {HealthStatsController} from './health-stats.controller';
import {HealthStat, HealthStatSchema} from './entities/health-stat.entity';

@Module({
    imports: [MongooseModule.forFeature([{name: HealthStat.name, schema: HealthStatSchema}])],
    controllers: [HealthStatsController],
    providers: [HealthStatsService],
})
export class HealthStatsModule {
}
