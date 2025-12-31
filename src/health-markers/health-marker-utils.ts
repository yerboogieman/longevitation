import {scoringFunctions} from "./scoring-functions";

export class HealthMarkerUtil {

    static calculateScore(functionName: string, ...args: any[]): number {

        const func = scoringFunctions[functionName];
        if (!func) {
            throw new Error(`Function '${functionName}' not found`);
        }

        return func(...args);
    }

}