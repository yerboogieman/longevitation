import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCategoriesModule } from './health-categories/health-categories.module';

@Module({
  imports: [HealthCategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
