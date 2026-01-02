import {Test, TestingModule} from '@nestjs/testing';
import {HealthCategoriesController} from './health-categories.controller';
import {HealthCategoriesService} from './health-categories.service';

describe('HealthCategoriesController', () => {
    let controller: HealthCategoriesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthCategoriesController],
            providers: [HealthCategoriesService],
        }).compile();

        controller = module.get<HealthCategoriesController>(HealthCategoriesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
