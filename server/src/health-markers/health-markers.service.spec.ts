import {Test, TestingModule} from '@nestjs/testing';
import {getModelToken} from '@nestjs/mongoose';
import {HealthMarkersService} from './health-markers.service';
import {HealthMarker} from './entities/health-marker.entity';
import {HealthCategory} from '../health-categories/entities/health-category.entity';
import {HealthStat} from '../health-stats/entities/health-stat.entity';
import {HealthStatsService} from '../health-stats/health-stats.service';
import nools from 'nools';

describe('HealthMarkersService', () => {

    let service: HealthMarkersService;
    let healthStatsService: jest.Mocked<HealthStatsService>;

    afterEach(() => {
        nools.deleteFlows();
    });

    beforeEach(async () => {
        const mockHealthStatsService = {
            findLatest: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HealthMarkersService,
                {
                    provide: getModelToken(HealthMarker.name),
                    useValue: {},
                },
                {
                    provide: getModelToken(HealthCategory.name),
                    useValue: {},
                },
                {
                    provide: HealthStatsService,
                    useValue: mockHealthStatsService,
                },
            ],
        }).compile();

        service = module.get<HealthMarkersService>(HealthMarkersService);
        healthStatsService = module.get(HealthStatsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('evaluateMarkerData', () => {

        it('should evaluate A1C marker data and return in-range status for 5.6%', async () => {

            const healthStat = {
                metadata: {
                    userId: 'test-user',
                    healthMarkerId: 'a1c',
                },
                data: { percentage: 5.6 },
            } as HealthStat;

            const result = await service.evaluateMarkerData(
                'a1c',
                healthStat,
                '../rules/health-markers/blood-sugar'
            );

            expect(result.status).toBe('in-range');
        });
    });

    describe('evaluateMarkerDataForCategory', () => {

        it('should evaluate all markers in a category and return results', async () => {

            const mockA1cStat = {
                metadata: {
                    userId: 'test-user',
                    healthMarkerId: 'a1c',
                },
                data: { percentage: 5.6 },
            } as HealthStat;

            const mockHomaIrStat = {
                metadata: {
                    userId: 'test-user',
                    healthMarkerId: 'homa-ir',
                },
                data: { score: 0.5 },
            } as HealthStat;

            healthStatsService.findLatest.mockImplementation(async (markerId) => {
                if (markerId === 'a1c') return mockA1cStat as any;
                if (markerId === 'homa-ir') return mockHomaIrStat as any;
                return null;
            });

            const results = await service.evaluateMarkerDataForCategory('blood-sugar');
const joe = JSON.stringify(results);
            expect(healthStatsService.findLatest).toHaveBeenCalled();
            expect(results.length).toBeGreaterThan(0);

            const a1cResult = results.find(r => r.markerId === 'a1c');
            expect(a1cResult).toBeDefined();
            expect(a1cResult.status).toBe('in-range');

            const homaIrResult = results.find(r => r.markerId === 'homa-ir');
            expect(homaIrResult).toBeDefined();
            expect(homaIrResult.status).toBe('ideal');
        });

        it('should skip markers with no stats available', async () => {

            const mockA1cStat = {
                metadata: {
                    userId: 'test-user',
                    healthMarkerId: 'a1c',
                },
                data: { percentage: 5.6 },
            } as HealthStat;

            healthStatsService.findLatest.mockImplementation(async (markerId) => {
                if (markerId === 'a1c') return mockA1cStat as any;
                return null;
            });

            const results = await service.evaluateMarkerDataForCategory('blood-sugar');

            expect(results.length).toBe(1);
            expect(results[0].markerId).toBe('a1c');
        });
    });
});
