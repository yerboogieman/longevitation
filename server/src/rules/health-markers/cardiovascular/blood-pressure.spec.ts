import nools from "nools";
import * as path from "path";

describe("blood-pressure.nools", () => {

    let flow: any;
    let BloodPressure: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "blood-pressure.nools"));
        BloodPressure = flow.getDefined("BloodPressure");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluate(
        systolic: number,
        diastolic: number,
        hasHypertensionSymptoms: boolean = false,
        hasHypotensionSymptoms: boolean = false
    ): Promise<any> {

        const bp = new BloodPressure({ systolic, diastolic, hasHypertensionSymptoms, hasHypotensionSymptoms });

        const result = new ScoreResult();
        const session = flow.getSession(bp, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("evaluateSystolicStatus", () => {

        describe("Low (systolic < 90)", () => {

            it("should return 'low' for systolic 80", async () => {
                const result = await evaluate(80, 55);
                expect(result.systolicStatus).toBe("low");
            });

            it("should return 'low' for systolic 89", async () => {
                const result = await evaluate(89, 55);
                expect(result.systolicStatus).toBe("low");
            });
        });

        describe("Normal (90 <= systolic < 120)", () => {

            it("should return 'normal' for systolic 90", async () => {
                const result = await evaluate(90, 65);
                expect(result.systolicStatus).toBe("normal");
            });

            it("should return 'normal' for systolic 110", async () => {
                const result = await evaluate(110, 72);
                expect(result.systolicStatus).toBe("normal");
            });

            it("should return 'normal' for systolic 119", async () => {
                const result = await evaluate(119, 75);
                expect(result.systolicStatus).toBe("normal");
            });
        });

        describe("Elevated (120 <= systolic <= 129)", () => {

            it("should return 'elevated' for systolic 120", async () => {
                const result = await evaluate(120, 75);
                expect(result.systolicStatus).toBe("elevated");
            });

            it("should return 'elevated' for systolic 125", async () => {
                const result = await evaluate(125, 75);
                expect(result.systolicStatus).toBe("elevated");
            });

            it("should return 'elevated' for systolic 129", async () => {
                const result = await evaluate(129, 75);
                expect(result.systolicStatus).toBe("elevated");
            });
        });

        describe("Stage 1 Hypertension (130 <= systolic <= 139)", () => {

            it("should return 'stage1.hypertension' for systolic 130", async () => {
                const result = await evaluate(130, 75);
                expect(result.systolicStatus).toBe("stage1.hypertension");
            });

            it("should return 'stage1.hypertension' for systolic 135", async () => {
                const result = await evaluate(135, 75);
                expect(result.systolicStatus).toBe("stage1.hypertension");
            });

            it("should return 'stage1.hypertension' for systolic 139", async () => {
                const result = await evaluate(139, 75);
                expect(result.systolicStatus).toBe("stage1.hypertension");
            });
        });

        describe("Stage 2 Hypertension (140 <= systolic <= 180)", () => {

            it("should return 'stage2.hypertension' for systolic 140", async () => {
                const result = await evaluate(140, 75);
                expect(result.systolicStatus).toBe("stage2.hypertension");
            });

            it("should return 'stage2.hypertension' for systolic 160", async () => {
                const result = await evaluate(160, 75);
                expect(result.systolicStatus).toBe("stage2.hypertension");
            });

            it("should return 'stage2.hypertension' for systolic 180", async () => {
                const result = await evaluate(180, 75);
                expect(result.systolicStatus).toBe("stage2.hypertension");
            });
        });

        describe("Severe Hypertension (systolic > 180)", () => {

            it("should return 'severe.hypertension' for systolic 181", async () => {
                const result = await evaluate(181, 75);
                expect(result.systolicStatus).toBe("severe.hypertension");
            });

            it("should return 'severe.hypertension' for systolic 200", async () => {
                const result = await evaluate(200, 75);
                expect(result.systolicStatus).toBe("severe.hypertension");
            });
        });
    });

    describe("evaluateDiastolicStatus", () => {

        describe("Low (diastolic < 60)", () => {

            it("should return 'low' for diastolic 50", async () => {
                const result = await evaluate(85, 50);
                expect(result.diastolicStatus).toBe("low");
            });

            it("should return 'low' for diastolic 59", async () => {
                const result = await evaluate(85, 59);
                expect(result.diastolicStatus).toBe("low");
            });
        });

        describe("Normal (60 <= diastolic < 80)", () => {

            it("should return 'normal' for diastolic 60", async () => {
                const result = await evaluate(110, 60);
                expect(result.diastolicStatus).toBe("normal");
            });

            it("should return 'normal' for diastolic 70", async () => {
                const result = await evaluate(110, 70);
                expect(result.diastolicStatus).toBe("normal");
            });

            it("should return 'normal' for diastolic 79", async () => {
                const result = await evaluate(110, 79);
                expect(result.diastolicStatus).toBe("normal");
            });
        });

        describe("Stage 1 Hypertension (80 <= diastolic <= 89)", () => {

            it("should return 'stage1.hypertension' for diastolic 80", async () => {
                const result = await evaluate(110, 80);
                expect(result.diastolicStatus).toBe("stage1.hypertension");
            });

            it("should return 'stage1.hypertension' for diastolic 85", async () => {
                const result = await evaluate(110, 85);
                expect(result.diastolicStatus).toBe("stage1.hypertension");
            });

            it("should return 'stage1.hypertension' for diastolic 89", async () => {
                const result = await evaluate(110, 89);
                expect(result.diastolicStatus).toBe("stage1.hypertension");
            });
        });

        describe("Stage 2 Hypertension (90 <= diastolic <= 120)", () => {

            it("should return 'stage2.hypertension' for diastolic 90", async () => {
                const result = await evaluate(110, 90);
                expect(result.diastolicStatus).toBe("stage2.hypertension");
            });

            it("should return 'stage2.hypertension' for diastolic 105", async () => {
                const result = await evaluate(110, 105);
                expect(result.diastolicStatus).toBe("stage2.hypertension");
            });

            it("should return 'stage2.hypertension' for diastolic 120", async () => {
                const result = await evaluate(110, 120);
                expect(result.diastolicStatus).toBe("stage2.hypertension");
            });
        });

        describe("Severe Hypertension (diastolic > 120)", () => {

            it("should return 'severe.hypertension' for diastolic 121", async () => {
                const result = await evaluate(110, 121);
                expect(result.diastolicStatus).toBe("severe.hypertension");
            });

            it("should return 'severe.hypertension' for diastolic 140", async () => {
                const result = await evaluate(110, 140);
                expect(result.diastolicStatus).toBe("severe.hypertension");
            });
        });
    });

    describe("evaluateBloodPressureStatus", () => {

        describe("Hypotension (systolic < 90 AND diastolic < 60)", () => {

            it("should return 'hypotension' for 85/55", async () => {
                const result = await evaluate(85, 55);
                expect(result.bloodPressureStatus).toBe("hypotension");
            });

            it("should return 'hypotension' for 70/40", async () => {
                const result = await evaluate(70, 40);
                expect(result.bloodPressureStatus).toBe("hypotension");
            });
        });

        describe("Normal (systolic < 120 AND diastolic < 80)", () => {

            it("should return 'normal' for 110/70 (optimal)", async () => {
                const result = await evaluate(110, 70);
                expect(result.bloodPressureStatus).toBe("normal");
            });

            it("should return 'normal' for 95/65 (lower normal)", async () => {
                const result = await evaluate(95, 65);
                expect(result.bloodPressureStatus).toBe("normal");
            });

            it("should return 'normal' for 119/79 (upper normal)", async () => {
                const result = await evaluate(119, 79);
                expect(result.bloodPressureStatus).toBe("normal");
            });

            it("should return 'normal' at lower boundary 90/60", async () => {
                const result = await evaluate(90, 60);
                expect(result.bloodPressureStatus).toBe("normal");
            });
        });

        describe("Elevated (120-129 systolic AND diastolic < 80)", () => {

            it("should return 'elevated' for 120/70", async () => {
                const result = await evaluate(120, 70);
                expect(result.bloodPressureStatus).toBe("elevated");
            });

            it("should return 'elevated' for 125/75", async () => {
                const result = await evaluate(125, 75);
                expect(result.bloodPressureStatus).toBe("elevated");
            });

            it("should return 'elevated' for 129/79", async () => {
                const result = await evaluate(129, 79);
                expect(result.bloodPressureStatus).toBe("elevated");
            });
        });

        describe("Stage 1 Hypertension (130-139 systolic OR 80-89 diastolic)", () => {

            it("should return 'stage1.hypertension' for 130/80", async () => {
                const result = await evaluate(130, 80);
                expect(result.bloodPressureStatus).toBe("stage1.hypertension");
            });

            it("should return 'stage1.hypertension' for 135/85", async () => {
                const result = await evaluate(135, 85);
                expect(result.bloodPressureStatus).toBe("stage1.hypertension");
            });

            it("should return 'stage1.hypertension' for 125/85 (diastolic triggers)", async () => {
                const result = await evaluate(125, 85);
                expect(result.bloodPressureStatus).toBe("stage1.hypertension");
            });

            it("should return 'stage1.hypertension' for 135/70 (systolic triggers)", async () => {
                const result = await evaluate(135, 70);
                expect(result.bloodPressureStatus).toBe("stage1.hypertension");
            });
        });

        describe("Stage 2 Hypertension (140-180 systolic OR 90-120 diastolic)", () => {

            it("should return 'stage2.hypertension' for 140/90", async () => {
                const result = await evaluate(140, 90);
                expect(result.bloodPressureStatus).toBe("stage2.hypertension");
            });

            it("should return 'stage2.hypertension' for 160/100", async () => {
                const result = await evaluate(160, 100);
                expect(result.bloodPressureStatus).toBe("stage2.hypertension");
            });

            it("should return 'stage2.hypertension' for 180/120", async () => {
                const result = await evaluate(180, 120);
                expect(result.bloodPressureStatus).toBe("stage2.hypertension");
            });

            it("should return 'stage2.hypertension' for 130/95 (diastolic triggers)", async () => {
                const result = await evaluate(130, 95);
                expect(result.bloodPressureStatus).toBe("stage2.hypertension");
            });

            it("should return 'stage2.hypertension' for 150/70 (systolic triggers)", async () => {
                const result = await evaluate(150, 70);
                expect(result.bloodPressureStatus).toBe("stage2.hypertension");
            });
        });

        describe("Severe Hypertension / Hypertensive Crisis (systolic > 180 OR diastolic > 120)", () => {

            it("should return 'severe.hypertension' for 185/100 without symptoms", async () => {
                const result = await evaluate(185, 100, false);
                expect(result.bloodPressureStatus).toBe("severe.hypertension");
            });

            it("should return 'severe.hypertension' for 160/125 without symptoms", async () => {
                const result = await evaluate(160, 125, false);
                expect(result.bloodPressureStatus).toBe("severe.hypertension");
            });

            it("should return 'hypertensive.crisis' for 200/130 with symptoms", async () => {
                const result = await evaluate(200, 130, true);
                expect(result.bloodPressureStatus).toBe("hypertensive.crisis");
            });

            it("should return 'hypertensive.crisis' for 185/100 with symptoms", async () => {
                const result = await evaluate(185, 100, true);
                expect(result.bloodPressureStatus).toBe("hypertensive.crisis");
            });
        });
    });

    describe("calculateBloodPressureScore", () => {

        describe("Hypotension Scoring (systolic < 90 AND diastolic < 60)", () => {
            // Without symptoms: max score 900 at threshold (90/60), approaches 0 as values drop
            // With symptoms: max score 600 at threshold

            it("should score ~900 at upper bound without symptoms (89/59)", async () => {
                const result = await evaluate(89, 59, false, false);
                // Combined ratio: (89/90 * 0.6) + (59/60 * 0.4) = 0.593 + 0.393 = 0.986
                // Score: 900 * 0.986 = 888
                expect(result.score).toBeGreaterThanOrEqual(880);
                expect(result.score).toBeLessThanOrEqual(900);
            });

            it("should score ~600 at upper bound with symptoms (89/59)", async () => {
                const result = await evaluate(89, 59, false, true);
                // Score: 600 * 0.986 = 592
                expect(result.score).toBeGreaterThanOrEqual(580);
                expect(result.score).toBeLessThanOrEqual(600);
            });

            it("should score ~690 for moderate hypotension without symptoms (70/45)", async () => {
                const result = await evaluate(70, 45, false, false);
                // Combined ratio: (70/90 * 0.6) + (45/60 * 0.4) = 0.467 + 0.3 = 0.767
                // Score: 900 * 0.767 = 690
                expect(result.score).toBeGreaterThanOrEqual(650);
                expect(result.score).toBeLessThanOrEqual(720);
            });

            it("should score lower for severe hypotension (50/30)", async () => {
                const result = await evaluate(50, 30, false, false);
                // Combined ratio: (50/90 * 0.6) + (30/60 * 0.4) = 0.333 + 0.2 = 0.533
                // Score: 900 * 0.533 = 480
                expect(result.score).toBeGreaterThanOrEqual(450);
                expect(result.score).toBeLessThanOrEqual(510);
            });

            it("should score even lower with symptoms (50/30)", async () => {
                const result = await evaluate(50, 30, false, true);
                // Score: 600 * 0.533 = 320
                expect(result.score).toBeGreaterThanOrEqual(300);
                expect(result.score).toBeLessThanOrEqual(350);
            });
        });

        describe("Normal Lower-Optimal Scoring (90-105 systolic AND 60-70 diastolic)", () => {
            // Score starts at 899 at lower bound, reaches 1000 at upper bound

            it("should score ~899 at lower bound (90/60)", async () => {
                const result = await evaluate(90, 60, false, false);
                expect(result.score).toBeGreaterThanOrEqual(895);
                expect(result.score).toBeLessThanOrEqual(910);
            });

            it("should score ~950 midway (98/65)", async () => {
                const result = await evaluate(98, 65, false, false);
                expect(result.score).toBeGreaterThanOrEqual(940);
                expect(result.score).toBeLessThanOrEqual(960);
            });

            it("should score ~1000 at upper bound (104/69)", async () => {
                const result = await evaluate(104, 69, false, false);
                expect(result.score).toBeGreaterThanOrEqual(990);
                expect(result.score).toBeLessThanOrEqual(1000);
            });
        });

        describe("Normal Upper-Optimal Scoring (105-120 systolic AND 70-80 diastolic)", () => {
            // Score starts at 1000 at lower bound, approaches 900 at upper bound

            it("should score ~1000 at lower bound (105/70)", async () => {
                const result = await evaluate(105, 70, false, false);
                expect(result.score).toBeGreaterThanOrEqual(995);
                expect(result.score).toBeLessThanOrEqual(1000);
            });

            it("should score ~950 midway (112/75)", async () => {
                const result = await evaluate(112, 75, false, false);
                expect(result.score).toBeGreaterThanOrEqual(940);
                expect(result.score).toBeLessThanOrEqual(960);
            });

            it("should score ~900 at upper bound (119/79)", async () => {
                const result = await evaluate(119, 79, false, false);
                expect(result.score).toBeGreaterThanOrEqual(895);
                expect(result.score).toBeLessThanOrEqual(920);
            });
        });

        describe("Elevated Scoring (120-129 systolic AND diastolic < 80)", () => {
            // Score starts at 899 at lower bound, approaches 750 at upper bound

            it("should score ~899 at lower bound (120/75)", async () => {
                const result = await evaluate(120, 75, false, false);
                expect(result.score).toBeGreaterThanOrEqual(890);
                expect(result.score).toBeLessThanOrEqual(899);
            });

            it("should score ~825 midway (124/75)", async () => {
                const result = await evaluate(124, 75, false, false);
                expect(result.score).toBeGreaterThanOrEqual(815);
                expect(result.score).toBeLessThanOrEqual(840);
            });

            it("should score ~750 at upper bound (129/75)", async () => {
                const result = await evaluate(129, 75, false, false);
                expect(result.score).toBeGreaterThanOrEqual(745);
                expect(result.score).toBeLessThanOrEqual(760);
            });
        });

        describe("Stage 1 Hypertension Scoring (130-139 systolic OR 80-89 diastolic)", () => {
            // Score starts at 749, approaches 680

            it("should score ~749 at lower bound (130/80)", async () => {
                const result = await evaluate(130, 80, false, false);
                expect(result.score).toBeGreaterThanOrEqual(740);
                expect(result.score).toBeLessThanOrEqual(749);
            });

            it("should score ~715 midway (134/84)", async () => {
                const result = await evaluate(134, 84, false, false);
                expect(result.score).toBeGreaterThanOrEqual(705);
                expect(result.score).toBeLessThanOrEqual(725);
            });

            it("should score ~680 at upper bound (139/89)", async () => {
                const result = await evaluate(139, 89, false, false);
                expect(result.score).toBeGreaterThanOrEqual(675);
                expect(result.score).toBeLessThanOrEqual(690);
            });

            it("should score based on systolic when diastolic is normal (135/70)", async () => {
                const result = await evaluate(135, 70, false, false);
                // systolicProgress = (135-130)/9 = 0.556
                // Score = 749 - (0.556 * 69) = 749 - 38 = 711
                expect(result.score).toBeGreaterThanOrEqual(705);
                expect(result.score).toBeLessThanOrEqual(720);
            });

            it("should score based on diastolic when systolic is elevated (115/85)", async () => {
                const result = await evaluate(115, 85, false, false);
                // diastolicProgress = (85-80)/9 = 0.556
                // Score = 749 - (0.556 * 69) = 749 - 38 = 711
                expect(result.score).toBeGreaterThanOrEqual(705);
                expect(result.score).toBeLessThanOrEqual(720);
            });
        });

        describe("Stage 2 Hypertension Scoring (140-180 systolic OR 90-120 diastolic)", () => {
            // Score starts at 679, approaches 400

            it("should score ~679 at lower bound (140/90)", async () => {
                const result = await evaluate(140, 90, false, false);
                expect(result.score).toBeGreaterThanOrEqual(670);
                expect(result.score).toBeLessThanOrEqual(679);
            });

            it("should score ~540 midway (160/105)", async () => {
                const result = await evaluate(160, 105, false, false);
                // systolicProgress = (160-140)/40 = 0.5
                // diastolicProgress = (105-90)/30 = 0.5
                // Score = 679 - (0.5 * 279) = 679 - 140 = 540
                expect(result.score).toBeGreaterThanOrEqual(530);
                expect(result.score).toBeLessThanOrEqual(550);
            });

            it("should score ~400 at upper bound (180/120)", async () => {
                const result = await evaluate(180, 120, false, false);
                expect(result.score).toBeGreaterThanOrEqual(395);
                expect(result.score).toBeLessThanOrEqual(410);
            });

            it("should score based on systolic when diastolic is moderate (170/95)", async () => {
                const result = await evaluate(170, 95, false, false);
                // systolicProgress = (170-140)/40 = 0.75
                // diastolicProgress = (95-90)/30 = 0.167
                // maxProgress = 0.75
                // Score = 679 - (0.75 * 279) = 679 - 209 = 470
                expect(result.score).toBeGreaterThanOrEqual(460);
                expect(result.score).toBeLessThanOrEqual(480);
            });
        });

        describe("Severe Hypertension Scoring (systolic > 180 OR diastolic > 120)", () => {
            // Without symptoms: max 399, approaches 0
            // With symptoms (crisis): max 250, approaches 0

            it("should score ~399 at lower bound without symptoms (181/121)", async () => {
                const result = await evaluate(181, 121, false, false);
                expect(result.score).toBeGreaterThanOrEqual(380);
                expect(result.score).toBeLessThanOrEqual(399);
            });

            it("should score ~250 at lower bound with symptoms (181/121)", async () => {
                const result = await evaluate(181, 121, true, false);
                expect(result.score).toBeGreaterThanOrEqual(235);
                expect(result.score).toBeLessThanOrEqual(250);
            });

            it("should score ~133 for severe values without symptoms (200/140)", async () => {
                const result = await evaluate(200, 140, false, false);
                // systolicExcess = (200-180)/40 = 0.5
                // diastolicExcess = (140-120)/30 = 0.667
                // Score = 399 * (1 - 0.667) = 399 * 0.333 = 133
                expect(result.score).toBeGreaterThanOrEqual(120);
                expect(result.score).toBeLessThanOrEqual(150);
            });

            it("should score ~0 for extreme values (220/150)", async () => {
                const result = await evaluate(220, 150, false, false);
                // systolicExcess = (220-180)/40 = 1.0
                // diastolicExcess = (150-120)/30 = 1.0
                // Score = 399 * (1 - 1.0) = 0
                expect(result.score).toBe(0);
            });

            it("should score even lower with symptoms for extreme values (220/150)", async () => {
                const result = await evaluate(220, 150, true, false);
                expect(result.score).toBe(0);
            });
        });
    });

    describe("Status Boundary Transitions", () => {

        it("should transition from hypotension to normal at 90/60", async () => {
            const hypotension = await evaluate(89, 59);
            const normal = await evaluate(90, 60);

            expect(hypotension.bloodPressureStatus).toBe("hypotension");
            expect(normal.bloodPressureStatus).toBe("normal");
        });

        it("should transition from normal to elevated at 120/xx (diastolic < 80)", async () => {
            const normal = await evaluate(119, 75);
            const elevated = await evaluate(120, 75);

            expect(normal.bloodPressureStatus).toBe("normal");
            expect(elevated.bloodPressureStatus).toBe("elevated");
        });

        it("should transition from elevated to stage 1 at 130/80", async () => {
            const elevated = await evaluate(129, 79);
            const stage1 = await evaluate(130, 80);

            expect(elevated.bloodPressureStatus).toBe("elevated");
            expect(stage1.bloodPressureStatus).toBe("stage1.hypertension");
        });

        it("should transition from normal to stage 1 when diastolic reaches 80", async () => {
            const normal = await evaluate(115, 79);
            const stage1 = await evaluate(115, 80);

            expect(normal.bloodPressureStatus).toBe("normal");
            expect(stage1.bloodPressureStatus).toBe("stage1.hypertension");
        });

        it("should transition from stage 1 to stage 2 at 140/90", async () => {
            const stage1 = await evaluate(139, 89);
            const stage2 = await evaluate(140, 90);

            expect(stage1.bloodPressureStatus).toBe("stage1.hypertension");
            expect(stage2.bloodPressureStatus).toBe("stage2.hypertension");
        });

        it("should transition from stage 2 to severe at 181/121", async () => {
            const stage2 = await evaluate(180, 120);
            const severe = await evaluate(181, 121);

            expect(stage2.bloodPressureStatus).toBe("stage2.hypertension");
            expect(severe.bloodPressureStatus).toBe("severe.hypertension");
        });
    });

    describe("Real-World Scenarios", () => {

        it("should classify ideal blood pressure (110/70)", async () => {
            const result = await evaluate(110, 70);

            expect(result.data.systolic).toBe(110);
            expect(result.data.diastolic).toBe(70);
            expect(result.bloodPressureStatus).toBe("normal");
            expect(result.score).toBeGreaterThanOrEqual(980);
        });

        it("should classify athlete with low-normal BP (100/62)", async () => {
            const result = await evaluate(100, 62);

            expect(result.bloodPressureStatus).toBe("normal");
            expect(result.score).toBeGreaterThanOrEqual(920);
            expect(result.score).toBeLessThanOrEqual(960);
        });

        it("should classify elderly with slightly elevated BP (125/78)", async () => {
            const result = await evaluate(125, 78);

            expect(result.bloodPressureStatus).toBe("elevated");
            expect(result.score).toBeGreaterThanOrEqual(800);
            expect(result.score).toBeLessThanOrEqual(870);
        });

        it("should classify person with controlled hypertension (138/85)", async () => {
            const result = await evaluate(138, 85);

            expect(result.bloodPressureStatus).toBe("stage1.hypertension");
            expect(result.score).toBeGreaterThanOrEqual(680);
            expect(result.score).toBeLessThanOrEqual(720);
        });

        it("should classify person with uncontrolled hypertension (165/100)", async () => {
            const result = await evaluate(165, 100);

            expect(result.bloodPressureStatus).toBe("stage2.hypertension");
            expect(result.score).toBeGreaterThanOrEqual(480);
            expect(result.score).toBeLessThanOrEqual(540);
        });

        it("should classify hypertensive emergency with symptoms (195/125)", async () => {
            const result = await evaluate(195, 125, true);

            expect(result.bloodPressureStatus).toBe("hypertensive.crisis");
            expect(result.score).toBeLessThanOrEqual(200);
        });

        it("should classify symptomatic hypotension (80/50)", async () => {
            const result = await evaluate(80, 50, false, true);

            expect(result.bloodPressureStatus).toBe("hypotension");
            expect(result.score).toBeLessThanOrEqual(550);
        });
    });

    describe("Data Storage", () => {

        it("should store systolic and diastolic values in data", async () => {
            const result = await evaluate(120, 80);

            expect(result.data.systolic).toBe(120);
            expect(result.data.diastolic).toBe(80);
        });

        it("should set all status fields", async () => {
            const result = await evaluate(130, 85);

            expect(result.systolicStatus).toBeDefined();
            expect(result.diastolicStatus).toBeDefined();
            expect(result.bloodPressureStatus).toBeDefined();
            expect(result.score).toBeDefined();
        });
    });
});
