import { Injectable } from '@nestjs/common';
import { CreateHealthMarkerDto } from './dto/create-health-marker.dto';
import { UpdateHealthMarkerDto } from './dto/update-health-marker.dto';

@Injectable()
export class HealthMarkersService {
  create(createHealthMarkerDto: CreateHealthMarkerDto) {
    return 'This action adds a new healthMarker';
  }

  findAll() {
    return `This action returns all healthMarkers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} healthMarker`;
  }

  update(id: number, updateHealthMarkerDto: UpdateHealthMarkerDto) {
    return `This action updates a #${id} healthMarker`;
  }

  remove(id: number) {
    return `This action removes a #${id} healthMarker`;
  }
}
