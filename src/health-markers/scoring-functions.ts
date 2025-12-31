
export type ScoringFunctions = {
    bmi: (weight: number, height: number) => number;
    bloodPressure: (systolic: number, diastolic: number) => number;
    cholesterol: (total: number, hdl: number) => number;
};

export const scoringFunctions: ScoringFunctions = {
    bmi: (weight, height): number => {
        const bmi = weight / (height * height);
        if (bmi < 18.5) return 1;
        if (bmi < 25) return 5;
        if (bmi < 30) return 3;
        return 1;
    },

    bloodPressure: (systolic, diastolic): number => {
        if (systolic < 120 && diastolic < 80) return 5;
        if (systolic < 140 && diastolic < 90) return 3;
        return 1;
    },

    cholesterol: (total, hdl): number => {
        const ratio = total / hdl;
        if (ratio < 3.5) return 5;
        if (ratio < 5) return 3;
        return 1;
    }
};