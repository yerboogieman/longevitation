
import { appleHealthData } from './apple-health-data';
import { snakeToCamel } from '@customation/core'

const stats = appleHealthData.data.metrics;
const userId = 'abc123';

const healthStats = stats.flatMap(stat =>
    stat.data.map(({ date, ...rest }: any) => ({
        timestamp: new Date(date),
        metadata: {
            healthMarkerId: snakeToCamel(stat.name),
            userId
        },
        data: rest
    }))
);

console.log(healthStats);