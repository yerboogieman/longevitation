import nools from "nools";
import * as path from "path";

describe("resting-heart-rate.nools", () => {

    let flow: any;
    let RestingHeartRate: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "resting-heart-rate.nools"));
        RestingHeartRate = flow.getDefined("RestingHeartRate");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluate(
        value: number,
        age: number,
        sex: 'M' | 'F' = 'M',
        hasBradycardiaSymptoms: boolean = false,
        hasTachycardiaSymptoms: boolean = false
    ): Promise<any> {

        const rhr = new RestingHeartRate({ value, age, sex, hasBradycardiaSymptoms, hasTachycardiaSymptoms });

        const result = new ScoreResult();
        const session = flow.getSession(rhr, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("evaluateStatus", () => {

        describe("Men Age 18-25", () => {
            // Thresholds: [55, 61, 65, 69, 73, 81]
            // Athlete 49-55, Excellent 56-61, Good 62-65, Above Avg 66-69, Avg 70-73, Below Avg 74-81, Poor 82+

            it("should return 'athlete' for RHR 50bpm at age 20", async () => {
                const result = await evaluate(50, 20, 'M');
                expect(result.status).toBe("athlete");
            });

            it("should return 'athlete' for RHR 55bpm at age 20", async () => {
                const result = await evaluate(55, 20, 'M');
                expect(result.status).toBe("athlete");
            });

            it("should return 'excellent' for RHR 56bpm at age 20", async () => {
                const result = await evaluate(56, 20, 'M');
                expect(result.status).toBe("excellent");
            });

            it("should return 'excellent' for RHR 61bpm at age 20", async () => {
                const result = await evaluate(61, 20, 'M');
                expect(result.status).toBe("excellent");
            });

            it("should return 'good' for RHR 62bpm at age 20", async () => {
                const result = await evaluate(62, 20, 'M');
                expect(result.status).toBe("good");
            });

            it("should return 'good' for RHR 65bpm at age 20", async () => {
                const result = await evaluate(65, 20, 'M');
                expect(result.status).toBe("good");
            });

            it("should return 'above.average' for RHR 66bpm at age 20", async () => {
                const result = await evaluate(66, 20, 'M');
                expect(result.status).toBe("above.average");
            });

            it("should return 'above.average' for RHR 69bpm at age 20", async () => {
                const result = await evaluate(69, 20, 'M');
                expect(result.status).toBe("above.average");
            });

            it("should return 'average' for RHR 70bpm at age 20", async () => {
                const result = await evaluate(70, 20, 'M');
                expect(result.status).toBe("average");
            });

            it("should return 'average' for RHR 73bpm at age 20", async () => {
                const result = await evaluate(73, 20, 'M');
                expect(result.status).toBe("average");
            });

            it("should return 'below.average' for RHR 74bpm at age 20", async () => {
                const result = await evaluate(74, 20, 'M');
                expect(result.status).toBe("below.average");
            });

            it("should return 'below.average' for RHR 81bpm at age 20", async () => {
                const result = await evaluate(81, 20, 'M');
                expect(result.status).toBe("below.average");
            });

            it("should return 'poor' for RHR 82bpm at age 20", async () => {
                const result = await evaluate(82, 20, 'M');
                expect(result.status).toBe("poor");
            });

            it("should return 'poor' for RHR 95bpm at age 20", async () => {
                const result = await evaluate(95, 20, 'M');
                expect(result.status).toBe("poor");
            });
        });

        describe("Men Age 46-55", () => {
            // Thresholds: [57, 63, 67, 71, 76, 83]
            // Athlete 50-57, Excellent 58-63, Good 64-67, Above Avg 68-71, Avg 72-76, Below Avg 77-83, Poor 84+

            it("should return 'athlete' for RHR 52bpm at age 50", async () => {
                const result = await evaluate(52, 50, 'M');
                expect(result.status).toBe("athlete");
            });

            it("should return 'excellent' for RHR 60bpm at age 50", async () => {
                const result = await evaluate(60, 50, 'M');
                expect(result.status).toBe("excellent");
            });

            it("should return 'good' for RHR 65bpm at age 50", async () => {
                const result = await evaluate(65, 50, 'M');
                expect(result.status).toBe("good");
            });

            it("should return 'above.average' for RHR 70bpm at age 50", async () => {
                const result = await evaluate(70, 50, 'M');
                expect(result.status).toBe("above.average");
            });

            it("should return 'average' for RHR 74bpm at age 50", async () => {
                const result = await evaluate(74, 50, 'M');
                expect(result.status).toBe("average");
            });

            it("should return 'below.average' for RHR 80bpm at age 50", async () => {
                const result = await evaluate(80, 50, 'M');
                expect(result.status).toBe("below.average");
            });

            it("should return 'poor' for RHR 85bpm at age 50", async () => {
                const result = await evaluate(85, 50, 'M');
                expect(result.status).toBe("poor");
            });
        });

        describe("Women Age 18-25", () => {
            // Thresholds: [60, 65, 69, 73, 78, 84]
            // Athlete 54-60, Excellent 61-65, Good 66-69, Above Avg 70-73, Avg 74-78, Below Avg 79-84, Poor 85+

            it("should return 'athlete' for RHR 56bpm at age 22", async () => {
                const result = await evaluate(56, 22, 'F');
                expect(result.status).toBe("athlete");
            });

            it("should return 'athlete' for RHR 60bpm at age 22", async () => {
                const result = await evaluate(60, 22, 'F');
                expect(result.status).toBe("athlete");
            });

            it("should return 'excellent' for RHR 61bpm at age 22", async () => {
                const result = await evaluate(61, 22, 'F');
                expect(result.status).toBe("excellent");
            });

            it("should return 'excellent' for RHR 65bpm at age 22", async () => {
                const result = await evaluate(65, 22, 'F');
                expect(result.status).toBe("excellent");
            });

            it("should return 'good' for RHR 66bpm at age 22", async () => {
                const result = await evaluate(66, 22, 'F');
                expect(result.status).toBe("good");
            });

            it("should return 'good' for RHR 69bpm at age 22", async () => {
                const result = await evaluate(69, 22, 'F');
                expect(result.status).toBe("good");
            });

            it("should return 'above.average' for RHR 72bpm at age 22", async () => {
                const result = await evaluate(72, 22, 'F');
                expect(result.status).toBe("above.average");
            });

            it("should return 'average' for RHR 76bpm at age 22", async () => {
                const result = await evaluate(76, 22, 'F');
                expect(result.status).toBe("average");
            });

            it("should return 'below.average' for RHR 82bpm at age 22", async () => {
                const result = await evaluate(82, 22, 'F');
                expect(result.status).toBe("below.average");
            });

            it("should return 'poor' for RHR 86bpm at age 22", async () => {
                const result = await evaluate(86, 22, 'F');
                expect(result.status).toBe("poor");
            });
        });

        describe("Women Age 36-45", () => {
            // Thresholds: [59, 64, 69, 73, 78, 84]
            // Athlete 54-59, Excellent 60-64, Good 65-69, Above Avg 70-73, Avg 74-78, Below Avg 79-84, Poor 85+

            it("should return 'athlete' for RHR 56bpm at age 40", async () => {
                const result = await evaluate(56, 40, 'F');
                expect(result.status).toBe("athlete");
            });

            it("should return 'excellent' for RHR 62bpm at age 40", async () => {
                const result = await evaluate(62, 40, 'F');
                expect(result.status).toBe("excellent");
            });

            it("should return 'good' for RHR 67bpm at age 40", async () => {
                const result = await evaluate(67, 40, 'F');
                expect(result.status).toBe("good");
            });

            it("should return 'above.average' for RHR 72bpm at age 40", async () => {
                const result = await evaluate(72, 40, 'F');
                expect(result.status).toBe("above.average");
            });

            it("should return 'average' for RHR 76bpm at age 40", async () => {
                const result = await evaluate(76, 40, 'F');
                expect(result.status).toBe("average");
            });

            it("should return 'below.average' for RHR 82bpm at age 40", async () => {
                const result = await evaluate(82, 40, 'F');
                expect(result.status).toBe("below.average");
            });

            it("should return 'poor' for RHR 90bpm at age 40", async () => {
                const result = await evaluate(90, 40, 'F');
                expect(result.status).toBe("poor");
            });
        });

        describe("Men Age 65+", () => {
            // Thresholds: [55, 61, 65, 69, 73, 79]
            // Athlete 50-55, Excellent 56-61, Good 62-65, Above Avg 66-69, Avg 70-73, Below Avg 74-79, Poor 80+

            it("should return 'athlete' for RHR 52bpm at age 70", async () => {
                const result = await evaluate(52, 70, 'M');
                expect(result.status).toBe("athlete");
            });

            it("should return 'excellent' for RHR 58bpm at age 70", async () => {
                const result = await evaluate(58, 70, 'M');
                expect(result.status).toBe("excellent");
            });

            it("should return 'good' for RHR 64bpm at age 70", async () => {
                const result = await evaluate(64, 70, 'M');
                expect(result.status).toBe("good");
            });

            it("should return 'above.average' for RHR 68bpm at age 70", async () => {
                const result = await evaluate(68, 70, 'M');
                expect(result.status).toBe("above.average");
            });

            it("should return 'average' for RHR 72bpm at age 70", async () => {
                const result = await evaluate(72, 70, 'M');
                expect(result.status).toBe("average");
            });

            it("should return 'below.average' for RHR 76bpm at age 70", async () => {
                const result = await evaluate(76, 70, 'M');
                expect(result.status).toBe("below.average");
            });

            it("should return 'poor' for RHR 82bpm at age 70", async () => {
                const result = await evaluate(82, 70, 'M');
                expect(result.status).toBe("poor");
            });
        });

        describe("Bradycardia", () => {

            it("should return 'bradycardia' for RHR 45bpm with symptoms", async () => {
                const result = await evaluate(45, 30, 'M', true, false);
                expect(result.status).toBe("bradycardia");
            });

            it("should return 'bradycardia' for RHR 55bpm with symptoms", async () => {
                const result = await evaluate(55, 30, 'M', true, false);
                expect(result.status).toBe("bradycardia");
            });

            it("should return 'bradycardia' for RHR 59bpm with symptoms", async () => {
                const result = await evaluate(59, 30, 'M', true, false);
                expect(result.status).toBe("bradycardia");
            });

            it("should NOT return 'bradycardia' for RHR 60bpm with symptoms", async () => {
                const result = await evaluate(60, 30, 'M', true, false);
                expect(result.status).not.toBe("bradycardia");
            });

            it("should NOT return 'bradycardia' for RHR 45bpm WITHOUT symptoms", async () => {
                const result = await evaluate(45, 30, 'M', false, false);
                expect(result.status).toBe("athlete");
            });

            it("should return 'bradycardia' for women with low RHR and symptoms", async () => {
                const result = await evaluate(50, 35, 'F', true, false);
                expect(result.status).toBe("bradycardia");
            });
        });

        describe("Tachycardia", () => {

            it("should return 'tachycardia' for RHR 105bpm with symptoms", async () => {
                const result = await evaluate(105, 30, 'M', false, true);
                expect(result.status).toBe("tachycardia");
            });

            it("should return 'tachycardia' for RHR 120bpm with symptoms", async () => {
                const result = await evaluate(120, 30, 'M', false, true);
                expect(result.status).toBe("tachycardia");
            });

            it("should return 'tachycardia' for RHR 101bpm with symptoms", async () => {
                const result = await evaluate(101, 30, 'M', false, true);
                expect(result.status).toBe("tachycardia");
            });

            it("should NOT return 'tachycardia' for RHR 100bpm with symptoms", async () => {
                const result = await evaluate(100, 30, 'M', false, true);
                expect(result.status).not.toBe("tachycardia");
            });

            it("should NOT return 'tachycardia' for RHR 110bpm WITHOUT symptoms", async () => {
                const result = await evaluate(110, 30, 'M', false, false);
                expect(result.status).toBe("poor");
            });

            it("should return 'tachycardia' for women with high RHR and symptoms", async () => {
                const result = await evaluate(115, 40, 'F', false, true);
                expect(result.status).toBe("tachycardia");
            });
        });

        describe("Edge Cases", () => {

            it("should return null for age below 18", async () => {
                const result = await evaluate(70, 16, 'M');
                expect(result.status).toBeNull();
            });

            it("should return null for age 17", async () => {
                const result = await evaluate(65, 17, 'F');
                expect(result.status).toBeNull();
            });

            it("should handle very low athlete-level RHR", async () => {
                const result = await evaluate(42, 25, 'M');
                expect(result.status).toBe("athlete");
            });

            it("should handle very high RHR values", async () => {
                const result = await evaluate(150, 30, 'M');
                expect(result.status).toBe("poor");
            });
        });
    });

    describe("evaluateScore", () => {

        describe("Athlete Scoring (900-1000)", () => {
            // Score ranges from 900 to 1000, with lower RHR = higher score

            it("should score 1000 for elite athlete RHR (40bpm)", async () => {
                const result = await evaluate(40, 25, 'M');
                expect(result.score).toBe(1000);
            });

            it("should score ~900 at athlete upper boundary", async () => {
                // Men 18-25: athleteMax = 55
                const result = await evaluate(55, 20, 'M');
                expect(result.score).toBe(900);
            });

            it("should score ~950 midway through athlete range", async () => {
                // Men 18-25: athleteMax = 55, athleteMin = 40, midpoint ~47
                const result = await evaluate(47, 20, 'M');
                expect(result.score).toBeGreaterThanOrEqual(945);
                expect(result.score).toBeLessThanOrEqual(960);
            });
        });

        describe("Excellent Scoring (800-899)", () => {

            it("should score high at excellent lower boundary", async () => {
                // Men 18-25: athleteMax = 55, so RHR 56 enters excellent
                const result = await evaluate(56, 20, 'M');
                expect(result.score).toBeGreaterThanOrEqual(875);
                expect(result.score).toBeLessThanOrEqual(899);
            });

            it("should score ~800 at excellent upper boundary", async () => {
                // Men 18-25: excellentMax = 61
                const result = await evaluate(61, 20, 'M');
                expect(result.score).toBe(800);
            });

            it("should score ~850 midway through excellent range", async () => {
                // Men 18-25: athleteMax = 55, excellentMax = 61, midpoint ~58
                const result = await evaluate(58, 20, 'M');
                expect(result.score).toBeGreaterThanOrEqual(840);
                expect(result.score).toBeLessThanOrEqual(860);
            });
        });

        describe("Good Scoring (650-799)", () => {

            it("should score high within good range near lower boundary", async () => {
                // Men 18-25: excellentMax = 61, so RHR 62 enters good
                const result = await evaluate(62, 20, 'M');
                expect(result.score).toBeGreaterThanOrEqual(750);
                expect(result.score).toBeLessThanOrEqual(799);
            });

            it("should score ~650 at good upper boundary", async () => {
                // Men 18-25: goodMax = 65
                const result = await evaluate(65, 20, 'M');
                expect(result.score).toBe(650);
            });
        });

        describe("Above Average Scoring (500-649)", () => {

            it("should score within above.average range near lower boundary", async () => {
                // Men 18-25: goodMax = 65, so RHR 66 enters above.average
                const result = await evaluate(66, 20, 'M');
                expect(result.score).toBeGreaterThanOrEqual(600);
                expect(result.score).toBeLessThanOrEqual(649);
            });

            it("should score ~500 at above.average upper boundary", async () => {
                // Men 18-25: aboveAvgMax = 69
                const result = await evaluate(69, 20, 'M');
                expect(result.score).toBe(500);
            });
        });

        describe("Average Scoring (350-499)", () => {

            it("should score within average range near lower boundary", async () => {
                // Men 18-25: aboveAvgMax = 69, so RHR 70 enters average
                const result = await evaluate(70, 20, 'M');
                expect(result.score).toBeGreaterThanOrEqual(450);
                expect(result.score).toBeLessThanOrEqual(499);
            });

            it("should score ~350 at average upper boundary", async () => {
                // Men 18-25: avgMax = 73
                const result = await evaluate(73, 20, 'M');
                expect(result.score).toBe(350);
            });
        });

        describe("Below Average Scoring (200-349)", () => {

            it("should score within below.average range near lower boundary", async () => {
                // Men 18-25: avgMax = 73, so RHR 74 enters below.average
                const result = await evaluate(74, 20, 'M');
                expect(result.score).toBeGreaterThanOrEqual(320);
                expect(result.score).toBeLessThanOrEqual(349);
            });

            it("should score ~200 at below.average upper boundary", async () => {
                // Men 18-25: belowAvgMax = 81
                const result = await evaluate(81, 20, 'M');
                expect(result.score).toBe(200);
            });
        });

        describe("Poor Scoring (0-199)", () => {

            it("should score ~199 at poor lower boundary", async () => {
                // Men 18-25: belowAvgMax = 81, so RHR 82 enters poor
                const result = await evaluate(82, 20, 'M');
                expect(result.score).toBeGreaterThanOrEqual(180);
                expect(result.score).toBeLessThanOrEqual(199);
            });

            it("should score 0 at RHR 120+", async () => {
                const result = await evaluate(120, 20, 'M');
                expect(result.score).toBe(0);
            });

            it("should score ~100 midway through poor range", async () => {
                // Men 18-25: belowAvgMax = 81, poorMax = 120, midpoint ~100
                const result = await evaluate(100, 20, 'M');
                expect(result.score).toBeGreaterThanOrEqual(90);
                expect(result.score).toBeLessThanOrEqual(115);
            });
        });

        describe("Bradycardia Scoring (0-100)", () => {

            it("should score ~100 at bradycardia upper boundary (RHR 59)", async () => {
                const result = await evaluate(59, 30, 'M', true, false);
                expect(result.score).toBeGreaterThanOrEqual(95);
                expect(result.score).toBeLessThanOrEqual(100);
            });

            it("should score 0 at very low RHR with symptoms", async () => {
                const result = await evaluate(30, 30, 'M', true, false);
                expect(result.score).toBe(0);
            });

            it("should score ~50 midway through bradycardia range", async () => {
                // Bradycardia: 30-59, midpoint = 45
                const result = await evaluate(45, 30, 'M', true, false);
                expect(result.score).toBeGreaterThanOrEqual(45);
                expect(result.score).toBeLessThanOrEqual(55);
            });
        });

        describe("Tachycardia Scoring (0-100)", () => {

            it("should score ~100 at tachycardia lower boundary (RHR 101)", async () => {
                const result = await evaluate(101, 30, 'M', false, true);
                expect(result.score).toBeGreaterThanOrEqual(95);
                expect(result.score).toBeLessThanOrEqual(100);
            });

            it("should score 0 at very high RHR with symptoms", async () => {
                const result = await evaluate(150, 30, 'M', false, true);
                expect(result.score).toBe(0);
            });

            it("should score ~50 midway through tachycardia range", async () => {
                // Tachycardia: 101-150, midpoint = 125
                const result = await evaluate(125, 30, 'M', false, true);
                expect(result.score).toBeGreaterThanOrEqual(45);
                expect(result.score).toBeLessThanOrEqual(55);
            });
        });

        describe("Age/Sex Specific Scoring", () => {

            it("should score differently for same RHR at different ages", async () => {
                const youngResult = await evaluate(65, 22, 'M');  // 18-25 thresholds
                const olderResult = await evaluate(65, 50, 'M');  // 46-55 thresholds

                // For 22-year-old: 65 is at good upper boundary
                // For 50-year-old: 65 is in good range (thresholds: 67 goodMax)
                expect(olderResult.score).toBeGreaterThan(youngResult.score);
            });

            it("should score differently for same RHR with different sex", async () => {
                const maleResult = await evaluate(65, 30, 'M');    // Men thresholds
                const femaleResult = await evaluate(65, 30, 'F'); // Women thresholds

                // For men 26-35: 65 is in good range (goodMax = 65)
                // For women 26-35: 65 is in good range (goodMax = 68)
                expect(femaleResult.score).toBeGreaterThan(maleResult.score);
            });
        });

        describe("Edge Cases", () => {

            it("should return null score for age below 18", async () => {
                const result = await evaluate(70, 16, 'M');
                expect(result.score).toBeNull();
            });

            it("should handle RHR at exact boundary values", async () => {
                // Test exact boundary between athlete and excellent
                const athleteResult = await evaluate(55, 20, 'M');
                const excellentResult = await evaluate(56, 20, 'M');

                expect(athleteResult.status).toBe("athlete");
                expect(excellentResult.status).toBe("excellent");
                expect(athleteResult.score).toBe(900);
                expect(excellentResult.score).toBeGreaterThanOrEqual(875);
            });
        });
    });

    describe("Status Boundary Transitions", () => {

        describe("Men Age 26-35 boundaries", () => {
            // Thresholds: [54, 61, 65, 70, 74, 81]

            it("should transition from athlete to excellent at 55bpm", async () => {
                const athlete = await evaluate(54, 30, 'M');
                const excellent = await evaluate(55, 30, 'M');

                expect(athlete.status).toBe("athlete");
                expect(excellent.status).toBe("excellent");
            });

            it("should transition from excellent to good at 62bpm", async () => {
                const excellent = await evaluate(61, 30, 'M');
                const good = await evaluate(62, 30, 'M');

                expect(excellent.status).toBe("excellent");
                expect(good.status).toBe("good");
            });

            it("should transition from good to above.average at 66bpm", async () => {
                const good = await evaluate(65, 30, 'M');
                const aboveAvg = await evaluate(66, 30, 'M');

                expect(good.status).toBe("good");
                expect(aboveAvg.status).toBe("above.average");
            });

            it("should transition from above.average to average at 71bpm", async () => {
                const aboveAvg = await evaluate(70, 30, 'M');
                const average = await evaluate(71, 30, 'M');

                expect(aboveAvg.status).toBe("above.average");
                expect(average.status).toBe("average");
            });

            it("should transition from average to below.average at 75bpm", async () => {
                const average = await evaluate(74, 30, 'M');
                const belowAvg = await evaluate(75, 30, 'M');

                expect(average.status).toBe("average");
                expect(belowAvg.status).toBe("below.average");
            });

            it("should transition from below.average to poor at 82bpm", async () => {
                const belowAvg = await evaluate(81, 30, 'M');
                const poor = await evaluate(82, 30, 'M');

                expect(belowAvg.status).toBe("below.average");
                expect(poor.status).toBe("poor");
            });
        });
    });

    describe("Real-World Scenarios", () => {

        it("should classify elite male athlete (age 28, RHR 42bpm)", async () => {
            const result = await evaluate(42, 28, 'M');

            expect(result.status).toBe("athlete");
            expect(result.score).toBeGreaterThanOrEqual(980);
        });

        it("should classify fit female runner (age 35, RHR 58bpm)", async () => {
            const result = await evaluate(58, 35, 'F');

            expect(result.status).toBe("athlete");
            expect(result.score).toBeGreaterThanOrEqual(900);
        });

        it("should classify healthy middle-aged man (age 45, RHR 68bpm)", async () => {
            const result = await evaluate(68, 45, 'M');

            expect(result.status).toBe("above.average");
            expect(result.score).toBeGreaterThanOrEqual(500);
            expect(result.score).toBeLessThanOrEqual(649);
        });

        it("should classify sedentary office worker (age 40, RHR 78bpm)", async () => {
            const result = await evaluate(78, 40, 'F');

            expect(result.status).toBe("average");
            expect(result.score).toBeGreaterThanOrEqual(350);
            expect(result.score).toBeLessThanOrEqual(499);
        });

        it("should classify healthy senior (age 70, RHR 62bpm)", async () => {
            const result = await evaluate(62, 70, 'M');

            expect(result.status).toBe("good");
            expect(result.score).toBeGreaterThanOrEqual(650);
        });

        it("should classify person with concerning bradycardia (age 55, RHR 48bpm with symptoms)", async () => {
            const result = await evaluate(48, 55, 'M', true, false);

            expect(result.status).toBe("bradycardia");
            expect(result.score).toBeLessThanOrEqual(100);
        });

        it("should classify person with tachycardia (age 30, RHR 115bpm with symptoms)", async () => {
            const result = await evaluate(115, 30, 'M', false, true);

            expect(result.status).toBe("tachycardia");
            expect(result.score).toBeLessThanOrEqual(100);
        });

        it("should NOT classify healthy athlete as bradycardia (age 25, RHR 48bpm no symptoms)", async () => {
            const result = await evaluate(48, 25, 'M', false, false);

            expect(result.status).toBe("athlete");
            expect(result.score).toBeGreaterThanOrEqual(900);
        });
    });

    describe("Data Storage", () => {

        it("should store rhr in data", async () => {
            const result = await evaluate(65, 35, 'M');

            expect(result.data.rhr).toBe(65);
        });

        it("should set all result fields", async () => {
            const result = await evaluate(70, 40, 'F');

            expect(result.status).toBeDefined();
            expect(result.score).toBeDefined();
            expect(result.data).toBeDefined();
        });
    });
});
