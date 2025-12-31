import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthStatsService } from './health-stats.service';
import { CreateHealthStatDto } from './dto/create-health-stat.dto';
import { UpdateHealthStatDto } from './dto/update-health-stat.dto';
import { UpdateSingleFieldDto } from '../dto/update-single-field.dto';

@Controller('health-stats')
export class HealthStatsController {
  constructor(private readonly healthStatsService: HealthStatsService) {}

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
}
