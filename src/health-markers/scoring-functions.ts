export type ScoringFunctions = {
    bmi: (weight: number, height: number) => number;
    bloodPressure: (systolic: number, diastolic: number) => number;
    cholesterol: (total: number, hdl: number) => number;
};

export const scoringFunctions: ScoringFunctions = {
    bmi: (data: any): number => {
        const {weight, height} = data;
        const bmi = weight / (height * height);
        if (bmi < 18.5) return 1;
        if (bmi < 25) return 5;
        if (bmi < 30) return 3;
        return 1;
    },

    bloodPressure: (data: any): number => {
        const {systolic, diastolic} = data;
        if (systolic < 120 && diastolic < 80) return 5;
        if (systolic < 140 && diastolic < 90) return 3;
        return 1;
    },

    cholesterol: (data: any): number => {
        const {total, hdl} = data;
        const ratio = total / hdl;
        if (ratio < 3.5) return 5;
        if (ratio < 5) return 3;
        return 1;
    }
};