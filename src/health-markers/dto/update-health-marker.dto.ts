import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthMarkerDto } from './create-health-marker.dto';

export class UpdateHealthMarkerDto extends PartialType(CreateHealthMarkerDto) {}
