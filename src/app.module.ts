import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCategoriesModule } from './health-categories/health-categories.module';
import { HealthMarkersModule } from './health-markers/health-markers.module';

@Module({
  imports: [HealthCategoriesModule, HealthMarkersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
