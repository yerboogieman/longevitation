import nools from "nools";
import * as path from "path";

describe("blood-pressure.nools", () => {

    let flow: any;
    let MarkerData: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "blood-pressure.nools"));
        MarkerData = flow.getDefined("BloodPressure");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluateMarkerData(markerData: any): Promise<any> {

        const markerDataWrapper = new MarkerData(markerData);

        const result = new ScoreResult();
        const session = flow.getSession(markerDataWrapper, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("Blood Pressure Categories", () => {

        describe("Low Blood Pressure", () => {

            it("should classify as low when systolic < 90 and diastolic < 60", async () => {

                const result = await evaluateMarkerData({
                    systolic: 85,
                    diastolic: 55,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("low");
                expect(result.diastolicStatus).toBe("low");
                expect(result.bloodPressureStatus).toBe("low");
            });
        });

        describe("Normal Blood Pressure", () => {

            it("should classify as normal when systolic < 120 and diastolic < 80", async () => {

                const result = await evaluateMarkerData({
                    systolic: 118,
                    diastolic: 76,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("normal");
                expect(result.diastolicStatus).toBe("normal");
                expect(result.bloodPressureStatus).toBe("normal");
            });

            it("should classify as normal at lower boundary (90/60)", async () => {

                const result = await evaluateMarkerData({
                    systolic: 90,
                    diastolic: 60,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("normal");
                expect(result.diastolicStatus).toBe("normal");
                expect(result.bloodPressureStatus).toBe("normal");
            });
        });

        describe("Elevated Blood Pressure", () => {

            it("should classify as elevated when systolic 120-129 and diastolic < 80", async () => {

                const result = await evaluateMarkerData({
                    systolic: 125,
                    diastolic: 75,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("elevated");
                expect(result.diastolicStatus).toBe("normal");
                expect(result.bloodPressureStatus).toBe("elevated");
            });

            it("should classify as elevated at lower boundary (120/79)", async () => {

                const result = await evaluateMarkerData({
                    systolic: 120,
                    diastolic: 79,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("elevated");
                expect(result.diastolicStatus).toBe("normal");
                expect(result.bloodPressureStatus).toBe("elevated");
            });

            it("should classify as elevated at upper boundary (129/79)", async () => {

                const result = await evaluateMarkerData({
                    systolic: 129,
                    diastolic: 79,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("elevated");
                expect(result.diastolicStatus).toBe("normal");
                expect(result.bloodPressureStatus).toBe("elevated");
            });
        });

        describe("Stage 1 Hypertension", () => {

            it("should classify as stage 1 hypertension when systolic 130-139 and diastolic 80-89", async () => {

                const result = await evaluateMarkerData({
                    systolic: 135,
                    diastolic: 85,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("stage1.hypertension");
                expect(result.diastolicStatus).toBe("stage1.hypertension");
                expect(result.bloodPressureStatus).toBe("stage1.hypertension");
            });

            it("should classify as stage 1 hypertension at lower boundary (130/80)", async () => {

                const result = await evaluateMarkerData({
                    systolic: 130,
                    diastolic: 80,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("stage1.hypertension");
                expect(result.diastolicStatus).toBe("stage1.hypertension");
                expect(result.bloodPressureStatus).toBe("stage1.hypertension");
            });

            it("should classify as stage 1 hypertension at upper boundary (139/89)", async () => {

                const result = await evaluateMarkerData({
                    systolic: 139,
                    diastolic: 89,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("stage1.hypertension");
                expect(result.diastolicStatus).toBe("stage1.hypertension");
                expect(result.bloodPressureStatus).toBe("stage1.hypertension");
            });
        });

        describe("Stage 2 Hypertension", () => {

            it("should classify as stage 2 hypertension when systolic 140-180 and diastolic 90-120", async () => {

                const result = await evaluateMarkerData({
                    systolic: 160,
                    diastolic: 100,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("stage2.hypertension");
                expect(result.diastolicStatus).toBe("stage2.hypertension");
                expect(result.bloodPressureStatus).toBe("stage2.hypertension");
            });

            it("should classify as stage 2 hypertension at lower boundary (140/90)", async () => {

                const result = await evaluateMarkerData({
                    systolic: 140,
                    diastolic: 90,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("stage2.hypertension");
                expect(result.diastolicStatus).toBe("stage2.hypertension");
                expect(result.bloodPressureStatus).toBe("stage2.hypertension");
            });

            it("should classify as stage 2 hypertension at upper boundary (180/120)", async () => {

                const result = await evaluateMarkerData({
                    systolic: 180,
                    diastolic: 120,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("stage2.hypertension");
                expect(result.diastolicStatus).toBe("stage2.hypertension");
                expect(result.bloodPressureStatus).toBe("stage2.hypertension");
            });
        });

        describe("Severe Hypertension (without symptoms)", () => {

            it("should classify as severe hypertension when systolic > 180 (without symptoms)", async () => {

                const result = await evaluateMarkerData({
                    systolic: 185,
                    diastolic: 100,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("severe.hypertension");
                expect(result.bloodPressureStatus).toBe("severe.hypertension");
            });

            it("should classify as severe hypertension when diastolic > 120 (without symptoms)", async () => {

                const result = await evaluateMarkerData({
                    systolic: 160,
                    diastolic: 125,
                    hasHypertensionSymptoms: false
                });

                expect(result.diastolicStatus).toBe("severe.hypertension");
                expect(result.bloodPressureStatus).toBe("severe.hypertension");
            });

            it("should classify as severe hypertension when both systolic > 180 and diastolic > 120 (without symptoms)", async () => {

                const result = await evaluateMarkerData({
                    systolic: 190,
                    diastolic: 130,
                    hasHypertensionSymptoms: false
                });

                expect(result.systolicStatus).toBe("severe.hypertension");
                expect(result.diastolicStatus).toBe("severe.hypertension");
                expect(result.bloodPressureStatus).toBe("severe.hypertension");
            });
        });

        describe("Hypertensive Crisis (with symptoms)", () => {

            it("should classify as hypertensive crisis when systolic > 180 with symptoms", async () => {

                const result = await evaluateMarkerData({
                    systolic: 185,
                    diastolic: 100,
                    hasHypertensionSymptoms: true
                });

                expect(result.systolicStatus).toBe("severe.hypertension");
                expect(result.bloodPressureStatus).toBe("hypertensive.crisis");
            });

            it("should classify as hypertensive crisis when diastolic > 120 with symptoms", async () => {

                const result = await evaluateMarkerData({
                    systolic: 160,
                    diastolic: 125,
                    hasHypertensionSymptoms: true
                });

                expect(result.diastolicStatus).toBe("severe.hypertension");
                expect(result.bloodPressureStatus).toBe("hypertensive.crisis");
            });

            it("should classify as hypertensive crisis when both systolic > 180 and diastolic > 120 with symptoms", async () => {

                const result = await evaluateMarkerData({
                    systolic: 190,
                    diastolic: 130,
                    hasHypertensionSymptoms: true
                });

                expect(result.systolicStatus).toBe("severe.hypertension");
                expect(result.diastolicStatus).toBe("severe.hypertension");
                expect(result.bloodPressureStatus).toBe("hypertensive.crisis");
            });
        });
    });

    describe("Individual Systolic Ratings", () => {

        it("should rate systolic as low when < 90", async () => {

            const result = await evaluateMarkerData({
                systolic: 85,
                diastolic: 70,
                hasHypertensionSymptoms: false
            });

            expect(result.systolicStatus).toBe("low");
        });

        it("should rate systolic as normal when 90-120", async () => {

            const result = await evaluateMarkerData({
                systolic: 110,
                diastolic: 70,
                hasHypertensionSymptoms: false
            });

            expect(result.systolicStatus).toBe("normal");
        });

        it("should rate systolic as elevated when 121-129", async () => {

            const result = await evaluateMarkerData({
                systolic: 125,
                diastolic: 70,
                hasHypertensionSymptoms: false
            });

            expect(result.systolicStatus).toBe("elevated");
        });

        it("should rate systolic as stage 1 hypertension when 130-139", async () => {

            const result = await evaluateMarkerData({
                systolic: 135,
                diastolic: 70,
                hasHypertensionSymptoms: false
            });

            expect(result.systolicStatus).toBe("stage1.hypertension");
        });

        it("should rate systolic as stage 2 hypertension when 140-180", async () => {

            const result = await evaluateMarkerData({
                systolic: 160,
                diastolic: 70,
                hasHypertensionSymptoms: false
            });

            expect(result.systolicStatus).toBe("stage2.hypertension");
        });

        it("should rate systolic as severe hypertension when > 180", async () => {

            const result = await evaluateMarkerData({
                systolic: 185,
                diastolic: 70,
                hasHypertensionSymptoms: false
            });

            expect(result.systolicStatus).toBe("severe.hypertension");
        });
    });

    describe("Individual Diastolic Ratings", () => {

        it("should rate diastolic as low when < 60", async () => {

            const result = await evaluateMarkerData({
                systolic: 110,
                diastolic: 55,
                hasHypertensionSymptoms: false
            });

            expect(result.diastolicStatus).toBe("low");
        });

        it("should rate diastolic as normal when 60-79", async () => {

            const result = await evaluateMarkerData({
                systolic: 110,
                diastolic: 70,
                hasHypertensionSymptoms: false
            });

            expect(result.diastolicStatus).toBe("normal");
        });

        it("should rate diastolic as stage 1 hypertension when 80-89", async () => {

            const result = await evaluateMarkerData({
                systolic: 110,
                diastolic: 85,
                hasHypertensionSymptoms: false
            });

            expect(result.diastolicStatus).toBe("stage1.hypertension");
        });

        it("should rate diastolic as stage 2 hypertension when 90-120", async () => {

            const result = await evaluateMarkerData({
                systolic: 110,
                diastolic: 100,
                hasHypertensionSymptoms: false
            });

            expect(result.diastolicStatus).toBe("stage2.hypertension");
        });

        it("should rate diastolic as severe hypertension when > 120", async () => {

            const result = await evaluateMarkerData({
                systolic: 110,
                diastolic: 125,
                hasHypertensionSymptoms: false
            });

            expect(result.diastolicStatus).toBe("severe.hypertension");
        });
    });
});
