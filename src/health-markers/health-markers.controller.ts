import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthMarkersService } from './health-markers.service';
import { CreateHealthMarkerDto } from './dto/create-health-marker.dto';
import { UpdateHealthMarkerDto } from './dto/update-health-marker.dto';

@Controller('health-markers')
export class HealthMarkersController {
  constructor(private readonly healthMarkersService: HealthMarkersService) {}

  @Post()
  create(@Body() createHealthMarkerDto: CreateHealthMarkerDto) {
    return this.healthMarkersService.create(createHealthMarkerDto);
  }

  @Get()
  findAll() {
    return this.healthMarkersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthMarkersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHealthMarkerDto: UpdateHealthMarkerDto) {
    return this.healthMarkersService.update(+id, updateHealthMarkerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthMarkersService.remove(+id);
  }
}
