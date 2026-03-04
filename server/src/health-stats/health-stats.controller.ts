import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {HealthStatsService} from './health-stats.service';
import {CreateHealthStatDto} from './dto/create-health-stat.dto';
import {UpdateHealthStatDto} from './dto/update-health-stat.dto';
import {UpdateSingleFieldDto} from '../dto/update-single-field.dto';
import {User} from "@customation/model/document";
import {CurrentUser} from '@customation/security'
import {snakeToCamel} from "@customation/core";

@Controller('health-stats')
export class HealthStatsController {

    constructor(private readonly healthStatsService: HealthStatsService) {
    }

    @Post()
    create(@Body() createHealthStatDto: CreateHealthStatDto) {
        return this.healthStatsService.create(createHealthStatDto);
    }

    @Get()
    findAll() {
        return this.healthStatsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.healthStatsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHealthStatDto: UpdateHealthStatDto) {
        return this.healthStatsService.update(id, updateHealthStatDto);
    }

    @Patch('field/update')
    updateField(@Body() updateSingleFieldDto: UpdateSingleFieldDto) {
        return this.healthStatsService.updateField(updateSingleFieldDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.healthStatsService.remove(id);
    }

    @Post('apple-health-data')
    loadAppleHealthData(@CurrentUser() user: User, @Body() appleHealthData: any) {

        const userId = user.id;
        const stats = appleHealthData.data.metrics;

        const healthStats = stats.flatMap((stat: { data: any[]; name: string; }) =>
            stat.data.map(({ date, ...rest }: any) => ({
                timestamp: new Date(date),
                metadata: {
                    healthMarkerId: snakeToCamel(stat.name),
                    userId
                },
                data: rest
            }))
        );

        return this.healthStatsService.insertMany(healthStats);
    }
}
