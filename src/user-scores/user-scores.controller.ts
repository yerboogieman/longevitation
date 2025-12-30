import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserScoresService } from './user-scores.service';
import { CreateUserScoreDto } from './dto/create-user-score.dto';
import { UpdateUserScoreDto } from './dto/update-user-score.dto';
import { UpdateSingleFieldDto } from '../dto/update-single-field.dto';

@Controller('user-scores')
export class UserScoresController {
  constructor(private readonly userScoresService: UserScoresService) {}

  @Post()
  create(@Body() createUserScoreDto: CreateUserScoreDto) {
    return this.userScoresService.create(createUserScoreDto);
  }

  @Get()
  findAll() {
    return this.userScoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userScoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserScoreDto: UpdateUserScoreDto) {
    return this.userScoresService.update(id, updateUserScoreDto);
  }

  @Patch('field/update')
  updateField(@Body() updateSingleFieldDto: UpdateSingleFieldDto) {
    return this.userScoresService.updateField(updateSingleFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userScoresService.remove(id);
  }
}
