import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class HealthMarker extends Document {

    @Prop({required: true, unique: true})
    id: string;

    @Prop({required: true})
    weightingFactor: number;

    getScore(userScores: { category: string; score: number }[]): number {
        const MAX_CATEGORY_SCORE = 100;
        let possibleScoresTotal = 0;
        let actualScoresTotal = 0;

        for (const userScore of userScores) {
            const weightingFactor = this.weightingFactor;
            const maxPossibleScores = weightingFactor * MAX_CATEGORY_SCORE;
            const actualScore = weightingFactor * userScore.score;

            possibleScoresTotal += maxPossibleScores;
            actualScoresTotal += actualScore;
        }

        return possibleScoresTotal > 0 ? (actualScoresTotal / possibleScoresTotal) * 100 : 0;
    }
}

export const HealthMarkerSchema = SchemaFactory.createForClass(HealthMarker);
