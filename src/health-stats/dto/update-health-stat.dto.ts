import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthStatDto } from './create-health-stat.dto';

export class UpdateHealthStatDto extends PartialType(CreateHealthStatDto) {}
