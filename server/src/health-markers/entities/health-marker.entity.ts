import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Types} from 'mongoose';
import {BaseDocument} from '@customation/model/document';
import {HealthCategory} from '../../health-categories/entities/health-category.entity';

@Schema({collection: 'healthMarkers'})
export class HealthMarker extends BaseDocument {

    @Prop({type: [{type: Types.ObjectId, ref: 'HealthCategory'}], default: []})
    healthCategories: HealthCategory[];

    @Prop({required: true})
    importance: number;

    calculateScore(userScores: { category: string; score: number }[]): number {

        const MAX_CATEGORY_SCORE = 100;
        let possibleScoresTotal = 0;
        let actualScoresTotal = 0;

        for (const userScore of userScores) {

            const importance = this.importance;
            const maxPossibleScores = importance * MAX_CATEGORY_SCORE;
            const actualScore = importance * userScore.score;

            possibleScoresTotal += maxPossibleScores;
            actualScoresTotal += actualScore;
        }

        return possibleScoresTotal > 0 ? (actualScoresTotal / possibleScoresTotal) * 100 : 0;
    }
}

export const HealthMarkerSchema = SchemaFactory.createForClass(HealthMarker);
