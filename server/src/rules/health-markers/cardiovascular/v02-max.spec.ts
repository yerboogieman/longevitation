import nools from "nools";
import * as path from "path";

describe("v02-max.nools", () => {

    let flow: any;
    let V02Max: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "v02-max.nools"));
        V02Max = flow.getDefined("V02Max");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluate(v02Max: number, age: number, sex: 'M' | 'F'): Promise<any> {

        const vo2 = new V02Max({ v02Max, age, sex });

        const result = new ScoreResult();
        const session = flow.getSession(vo2, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("evaluateStatus - Men", () => {

        describe("Age Group 18-25 (Men)", () => {
            // Thresholds: [29, 36, 41, 46, 51, 60]

            it("should return 'very.poor' for VO2 Max 25 at age 22", async () => {
                const result = await evaluate(25, 22, 'M');
                expect(result.status).toBe("very.poor");
            });

            it("should return 'very.poor' for VO2 Max 29 at age 22", async () => {
                const result = await evaluate(29, 22, 'M');
                expect(result.status).toBe("very.poor");
            });

            it("should return 'poor' for VO2 Max 30 at age 22", async () => {
                const result = await evaluate(30, 22, 'M');
                expect(result.status).toBe("poor");
            });

            it("should return 'poor' for VO2 Max 36 at age 22", async () => {
                const result = await evaluate(36, 22, 'M');
                expect(result.status).toBe("poor");
            });

            it("should return 'below.average' for VO2 Max 37 at age 22", async () => {
                const result = await evaluate(37, 22, 'M');
                expect(result.status).toBe("below.average");
            });

            it("should return 'below.average' for VO2 Max 41 at age 22", async () => {
                const result = await evaluate(41, 22, 'M');
                expect(result.status).toBe("below.average");
            });

            it("should return 'average' for VO2 Max 42 at age 22", async () => {
                const result = await evaluate(42, 22, 'M');
                expect(result.status).toBe("average");
            });

            it("should return 'average' for VO2 Max 46 at age 22", async () => {
                const result = await evaluate(46, 22, 'M');
                expect(result.status).toBe("average");
            });

            it("should return 'above.average' for VO2 Max 47 at age 22", async () => {
                const result = await evaluate(47, 22, 'M');
                expect(result.status).toBe("above.average");
            });

            it("should return 'above.average' for VO2 Max 51 at age 22", async () => {
                const result = await evaluate(51, 22, 'M');
                expect(result.status).toBe("above.average");
            });

            it("should return 'good' for VO2 Max 52 at age 22", async () => {
                const result = await evaluate(52, 22, 'M');
                expect(result.status).toBe("good");
            });

            it("should return 'good' for VO2 Max 60 at age 22", async () => {
                const result = await evaluate(60, 22, 'M');
                expect(result.status).toBe("good");
            });

            it("should return 'excellent' for VO2 Max 61 at age 22", async () => {
                const result = await evaluate(61, 22, 'M');
                expect(result.status).toBe("excellent");
            });

            it("should return 'excellent' for VO2 Max 75 at age 22", async () => {
                const result = await evaluate(75, 22, 'M');
                expect(result.status).toBe("excellent");
            });
        });

        describe("Age Group 46-55 (Men)", () => {
            // Thresholds: [24, 28, 31, 35, 38, 45]

            it("should return 'very.poor' for VO2 Max 20 at age 50", async () => {
                const result = await evaluate(20, 50, 'M');
                expect(result.status).toBe("very.poor");
            });

            it("should return 'poor' for VO2 Max 26 at age 50", async () => {
                const result = await evaluate(26, 50, 'M');
                expect(result.status).toBe("poor");
            });

            it("should return 'below.average' for VO2 Max 30 at age 50", async () => {
                const result = await evaluate(30, 50, 'M');
                expect(result.status).toBe("below.average");
            });

            it("should return 'average' for VO2 Max 33 at age 50", async () => {
                const result = await evaluate(33, 50, 'M');
                expect(result.status).toBe("average");
            });

            it("should return 'above.average' for VO2 Max 37 at age 50", async () => {
                const result = await evaluate(37, 50, 'M');
                expect(result.status).toBe("above.average");
            });

            it("should return 'good' for VO2 Max 42 at age 50", async () => {
                const result = await evaluate(42, 50, 'M');
                expect(result.status).toBe("good");
            });

            it("should return 'excellent' for VO2 Max 50 at age 50", async () => {
                const result = await evaluate(50, 50, 'M');
                expect(result.status).toBe("excellent");
            });
        });

        describe("Age Group 66+ (Men)", () => {
            // Thresholds: [19, 21, 25, 28, 32, 37]

            it("should return 'very.poor' for VO2 Max 15 at age 70", async () => {
                const result = await evaluate(15, 70, 'M');
                expect(result.status).toBe("very.poor");
            });

            it("should return 'poor' for VO2 Max 20 at age 70", async () => {
                const result = await evaluate(20, 70, 'M');
                expect(result.status).toBe("poor");
            });

            it("should return 'below.average' for VO2 Max 23 at age 70", async () => {
                const result = await evaluate(23, 70, 'M');
                expect(result.status).toBe("below.average");
            });

            it("should return 'average' for VO2 Max 27 at age 70", async () => {
                const result = await evaluate(27, 70, 'M');
                expect(result.status).toBe("average");
            });

            it("should return 'above.average' for VO2 Max 30 at age 70", async () => {
                const result = await evaluate(30, 70, 'M');
                expect(result.status).toBe("above.average");
            });

            it("should return 'good' for VO2 Max 35 at age 70", async () => {
                const result = await evaluate(35, 70, 'M');
                expect(result.status).toBe("good");
            });

            it("should return 'excellent' for VO2 Max 40 at age 70", async () => {
                const result = await evaluate(40, 70, 'M');
                expect(result.status).toBe("excellent");
            });
        });
    });

    describe("evaluateStatus - Women", () => {

        describe("Age Group 18-25 (Women)", () => {
            // Thresholds: [27, 32, 37, 41, 46, 56]

            it("should return 'very.poor' for VO2 Max 25 at age 22", async () => {
                const result = await evaluate(25, 22, 'F');
                expect(result.status).toBe("very.poor");
            });

            it("should return 'poor' for VO2 Max 30 at age 22", async () => {
                const result = await evaluate(30, 22, 'F');
                expect(result.status).toBe("poor");
            });

            it("should return 'below.average' for VO2 Max 35 at age 22", async () => {
                const result = await evaluate(35, 22, 'F');
                expect(result.status).toBe("below.average");
            });

            it("should return 'average' for VO2 Max 40 at age 22", async () => {
                const result = await evaluate(40, 22, 'F');
                expect(result.status).toBe("average");
            });

            it("should return 'above.average' for VO2 Max 44 at age 22", async () => {
                const result = await evaluate(44, 22, 'F');
                expect(result.status).toBe("above.average");
            });

            it("should return 'good' for VO2 Max 50 at age 22", async () => {
                const result = await evaluate(50, 22, 'F');
                expect(result.status).toBe("good");
            });

            it("should return 'excellent' for VO2 Max 60 at age 22", async () => {
                const result = await evaluate(60, 22, 'F');
                expect(result.status).toBe("excellent");
            });
        });

        describe("Age Group 46-55 (Women)", () => {
            // Thresholds: [19, 24, 27, 30, 33, 40]

            it("should return 'very.poor' for VO2 Max 18 at age 50", async () => {
                const result = await evaluate(18, 50, 'F');
                expect(result.status).toBe("very.poor");
            });

            it("should return 'poor' for VO2 Max 22 at age 50", async () => {
                const result = await evaluate(22, 50, 'F');
                expect(result.status).toBe("poor");
            });

            it("should return 'below.average' for VO2 Max 26 at age 50", async () => {
                const result = await evaluate(26, 50, 'F');
                expect(result.status).toBe("below.average");
            });

            it("should return 'average' for VO2 Max 29 at age 50", async () => {
                const result = await evaluate(29, 50, 'F');
                expect(result.status).toBe("average");
            });

            it("should return 'above.average' for VO2 Max 32 at age 50", async () => {
                const result = await evaluate(32, 50, 'F');
                expect(result.status).toBe("above.average");
            });

            it("should return 'good' for VO2 Max 38 at age 50", async () => {
                const result = await evaluate(38, 50, 'F');
                expect(result.status).toBe("good");
            });

            it("should return 'excellent' for VO2 Max 45 at age 50", async () => {
                const result = await evaluate(45, 50, 'F');
                expect(result.status).toBe("excellent");
            });
        });
    });

    describe("evaluateScore", () => {

        describe("Very Poor Scoring (0-149)", () => {

            it("should score 0 for very low VO2 Max", async () => {
                const result = await evaluate(0, 30, 'M');
                expect(result.score).toBe(0);
            });

            it("should score ~75 midway through very.poor range (Men 26-35)", async () => {
                // Men 26-35: veryPoorMax = 29, so 14.5 is midway
                const result = await evaluate(15, 30, 'M');
                expect(result.score).toBeGreaterThanOrEqual(70);
                expect(result.score).toBeLessThanOrEqual(80);
            });

            it("should score ~149 at very.poor upper boundary", async () => {
                // Men 26-35: veryPoorMax = 29
                const result = await evaluate(29, 30, 'M');
                expect(result.score).toBe(149);
            });
        });

        describe("Poor Scoring (150-299)", () => {

            it("should score ~150 at poor lower boundary", async () => {
                // Men 26-35: veryPoorMax = 29, so 30 enters poor
                // At 30: progress = (30-29)/(34-29) = 0.2, score = 150 + 0.2*149 = 180
                const result = await evaluate(30, 30, 'M');
                expect(result.score).toBeGreaterThanOrEqual(150);
                expect(result.score).toBeLessThanOrEqual(180);
            });

            it("should score ~225 midway through poor range", async () => {
                // Men 26-35: poorMax = 34, veryPoorMax = 29, midpoint = 31.5
                const result = await evaluate(32, 30, 'M');
                expect(result.score).toBeGreaterThanOrEqual(200);
                expect(result.score).toBeLessThanOrEqual(250);
            });

            it("should score ~299 at poor upper boundary", async () => {
                // Men 26-35: poorMax = 34
                const result = await evaluate(34, 30, 'M');
                expect(result.score).toBe(299);
            });
        });

        describe("Below Average Scoring (300-449)", () => {

            it("should score ~300 at below.average lower boundary", async () => {
                // Men 26-35: poorMax = 34, so 35 enters below.average
                // At 35: progress = (35-34)/(39-34) = 0.2, score = 300 + 0.2*149 = 330
                const result = await evaluate(35, 30, 'M');
                expect(result.score).toBeGreaterThanOrEqual(300);
                expect(result.score).toBeLessThanOrEqual(330);
            });

            it("should score ~449 at below.average upper boundary", async () => {
                // Men 26-35: belowAvgMax = 39
                const result = await evaluate(39, 30, 'M');
                expect(result.score).toBe(449);
            });
        });

        describe("Average Scoring (450-649)", () => {

            it("should score ~450 at average lower boundary", async () => {
                // Men 26-35: belowAvgMax = 39, so 40 enters average
                // At 40: progress = (40-39)/(42-39) = 0.333, score = 450 + 0.333*199 = 516
                const result = await evaluate(40, 30, 'M');
                expect(result.score).toBeGreaterThanOrEqual(450);
                expect(result.score).toBeLessThanOrEqual(520);
            });

            it("should score ~649 at average upper boundary", async () => {
                // Men 26-35: avgMax = 42
                const result = await evaluate(42, 30, 'M');
                expect(result.score).toBe(649);
            });
        });

        describe("Above Average Scoring (650-799)", () => {

            it("should score ~650 at above.average lower boundary", async () => {
                // Men 26-35: avgMax = 42, so 43 enters above.average
                const result = await evaluate(43, 30, 'M');
                expect(result.score).toBeGreaterThanOrEqual(650);
                expect(result.score).toBeLessThan(680);
            });

            it("should score ~799 at above.average upper boundary", async () => {
                // Men 26-35: aboveAvgMax = 48
                const result = await evaluate(48, 30, 'M');
                expect(result.score).toBe(799);
            });
        });

        describe("Good Scoring (800-899)", () => {

            it("should score ~800 at good lower boundary", async () => {
                // Men 26-35: aboveAvgMax = 48, so 49 enters good
                const result = await evaluate(49, 30, 'M');
                expect(result.score).toBeGreaterThanOrEqual(800);
                expect(result.score).toBeLessThan(820);
            });

            it("should score ~899 at good upper boundary", async () => {
                // Men 26-35: goodMax = 56
                const result = await evaluate(56, 30, 'M');
                expect(result.score).toBe(899);
            });
        });

        describe("Excellent Scoring (900-1000)", () => {

            it("should score ~900 at excellent lower boundary", async () => {
                // Men 26-35: goodMax = 56, so 57 enters excellent
                const result = await evaluate(57, 30, 'M');
                expect(result.score).toBeGreaterThanOrEqual(900);
                expect(result.score).toBeLessThan(920);
            });

            it("should score ~950 at 5 units above excellent threshold", async () => {
                // Men 26-35: goodMax = 56, so 56 + 5 = 61
                const result = await evaluate(61, 30, 'M');
                expect(result.score).toBeGreaterThanOrEqual(945);
                expect(result.score).toBeLessThanOrEqual(955);
            });

            it("should score 1000 at 10 units or more above excellent threshold", async () => {
                // Men 26-35: goodMax = 56, so 56 + 10 = 66
                const result = await evaluate(66, 30, 'M');
                expect(result.score).toBe(1000);
            });

            it("should cap at 1000 for very high VO2 Max values", async () => {
                const result = await evaluate(80, 30, 'M');
                expect(result.score).toBe(1000);
            });
        });
    });

    describe("Sex-Specific Scoring", () => {

        it("should score differently for same VO2 Max between men and women", async () => {
            // VO2 Max of 40 at age 30
            const maleResult = await evaluate(40, 30, 'M');
            const femaleResult = await evaluate(40, 30, 'F');

            // Men 26-35: 40 is in "average" range (40-42)
            // Women 26-35: 40 is in "above.average" range (39-44)
            expect(femaleResult.score).toBeGreaterThan(maleResult.score);
        });

        it("should classify woman as 'good' where man would be 'above.average'", async () => {
            // VO2 Max of 40 at age 40
            const maleResult = await evaluate(40, 40, 'M');
            const femaleResult = await evaluate(40, 40, 'F');

            // Men 36-45: thresholds [25, 30, 34, 38, 42, 51], 40 is "above.average" (39-42)
            // Women 36-45: thresholds [21, 26, 30, 33, 37, 45], 40 is "good" (38-45)
            expect(maleResult.status).toBe("above.average");
            expect(femaleResult.status).toBe("good");
        });
    });

    describe("Age-Specific Scoring", () => {

        it("should score higher for older person with same VO2 Max (Men)", async () => {
            // VO2 Max of 35
            const youngResult = await evaluate(35, 25, 'M');  // 18-25 thresholds
            const olderResult = await evaluate(35, 60, 'M');  // 56-65 thresholds

            // For 25-year-old: 35 is in "poor" range
            // For 60-year-old: 35 is in "above.average" range
            expect(olderResult.score).toBeGreaterThan(youngResult.score);
        });

        it("should produce 'excellent' for older person at lower VO2 Max", async () => {
            // Men age 20: excellent threshold is >60
            // Men age 70: excellent threshold is >37
            const youngResult = await evaluate(40, 20, 'M');
            const olderResult = await evaluate(40, 70, 'M');

            expect(youngResult.status).toBe("below.average");
            expect(olderResult.status).toBe("excellent");
        });
    });

    describe("Status Boundary Transitions (Men 26-35)", () => {
        // Thresholds: [29, 34, 39, 42, 48, 56]

        it("should transition from very.poor to poor at 30", async () => {
            const veryPoor = await evaluate(29, 30, 'M');
            const poor = await evaluate(30, 30, 'M');

            expect(veryPoor.status).toBe("very.poor");
            expect(poor.status).toBe("poor");
        });

        it("should transition from poor to below.average at 35", async () => {
            const poor = await evaluate(34, 30, 'M');
            const belowAvg = await evaluate(35, 30, 'M');

            expect(poor.status).toBe("poor");
            expect(belowAvg.status).toBe("below.average");
        });

        it("should transition from below.average to average at 40", async () => {
            const belowAvg = await evaluate(39, 30, 'M');
            const average = await evaluate(40, 30, 'M');

            expect(belowAvg.status).toBe("below.average");
            expect(average.status).toBe("average");
        });

        it("should transition from average to above.average at 43", async () => {
            const average = await evaluate(42, 30, 'M');
            const aboveAvg = await evaluate(43, 30, 'M');

            expect(average.status).toBe("average");
            expect(aboveAvg.status).toBe("above.average");
        });

        it("should transition from above.average to good at 49", async () => {
            const aboveAvg = await evaluate(48, 30, 'M');
            const good = await evaluate(49, 30, 'M');

            expect(aboveAvg.status).toBe("above.average");
            expect(good.status).toBe("good");
        });

        it("should transition from good to excellent at 57", async () => {
            const good = await evaluate(56, 30, 'M');
            const excellent = await evaluate(57, 30, 'M');

            expect(good.status).toBe("good");
            expect(excellent.status).toBe("excellent");
        });
    });

    describe("Real-World Scenarios", () => {

        it("should classify elite male athlete (age 25, VO2 Max 70)", async () => {
            const result = await evaluate(70, 25, 'M');

            expect(result.status).toBe("excellent");
            expect(result.score).toBe(1000);
        });

        it("should classify fit middle-aged man (age 45, VO2 Max 45)", async () => {
            const result = await evaluate(45, 45, 'M');

            expect(result.status).toBe("good");
            expect(result.score).toBeGreaterThanOrEqual(800);
            expect(result.score).toBeLessThanOrEqual(899);
        });

        it("should classify sedentary young woman (age 28, VO2 Max 28)", async () => {
            const result = await evaluate(28, 28, 'F');

            expect(result.status).toBe("poor");
            expect(result.score).toBeGreaterThanOrEqual(150);
            expect(result.score).toBeLessThanOrEqual(299);
        });

        it("should classify active senior woman (age 65, VO2 Max 35)", async () => {
            const result = await evaluate(35, 65, 'F');

            expect(result.status).toBe("good");
            expect(result.score).toBeGreaterThanOrEqual(800);
        });

        it("should classify recreational runner man (age 35, VO2 Max 50)", async () => {
            const result = await evaluate(50, 35, 'M');

            expect(result.status).toBe("good");
            expect(result.score).toBeGreaterThanOrEqual(800);
            expect(result.score).toBeLessThanOrEqual(899);
        });

        it("should classify unfit older man (age 70, VO2 Max 18)", async () => {
            const result = await evaluate(18, 70, 'M');

            expect(result.status).toBe("very.poor");
            expect(result.score).toBeLessThanOrEqual(149);
        });
    });

    describe("Edge Cases", () => {

        it("should use 18-25 thresholds for age below 18 (Men)", async () => {
            const result = await evaluate(45, 16, 'M');
            // Men 18-25: 45 is "average" (42-46)
            expect(result.status).toBe("average");
        });

        it("should use 18-25 thresholds for age below 18 (Women)", async () => {
            const result = await evaluate(40, 16, 'F');
            // Women 18-25: 40 is "average" (38-41)
            expect(result.status).toBe("average");
        });

        it("should handle very high VO2 Max values", async () => {
            const result = await evaluate(100, 25, 'M');
            expect(result.status).toBe("excellent");
            expect(result.score).toBe(1000);
        });
    });

    describe("Data Storage", () => {

        it("should store v02Max, age, and sex in data", async () => {
            const result = await evaluate(45, 35, 'M');

            expect(result.data.v02Max).toBe(45);
            expect(result.data.age).toBe(35);
            expect(result.data.sex).toBe('M');
        });

        it("should set all result fields", async () => {
            const result = await evaluate(50, 40, 'F');

            expect(result.status).toBeDefined();
            expect(result.score).toBeDefined();
            expect(result.data).toBeDefined();
        });
    });
});
