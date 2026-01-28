import nools from "nools";
import * as path from "path";

describe("hrv.nools", () => {

    let flow: any;
    let HRV: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "hrv.nools"));
        HRV = flow.getDefined("HRV");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluate(milliseconds: number, age: number, sex: 'M' | 'F' = 'M'): Promise<any> {

        const hrv = new HRV({ milliseconds, age, sex });

        const result = new ScoreResult();
        const session = flow.getSession(hrv, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("evaluateStatus", () => {

        describe("Age Group 18-24", () => {
            // Thresholds: [30, 45, 65, 85, 100]

            it("should return 'low' for HRV 25ms at age 20", async () => {
                const result = await evaluate(25, 20);
                expect(result.status).toBe("low");
            });

            it("should return 'low' for HRV 30ms at age 20", async () => {
                const result = await evaluate(30, 20);
                expect(result.status).toBe("low");
            });

            it("should return 'below.average' for HRV 31ms at age 20", async () => {
                const result = await evaluate(31, 20);
                expect(result.status).toBe("below.average");
            });

            it("should return 'below.average' for HRV 45ms at age 20", async () => {
                const result = await evaluate(45, 20);
                expect(result.status).toBe("below.average");
            });

            it("should return 'average' for HRV 46ms at age 20", async () => {
                const result = await evaluate(46, 20);
                expect(result.status).toBe("average");
            });

            it("should return 'average' for HRV 65ms at age 20", async () => {
                const result = await evaluate(65, 20);
                expect(result.status).toBe("average");
            });

            it("should return 'above.average' for HRV 66ms at age 20", async () => {
                const result = await evaluate(66, 20);
                expect(result.status).toBe("above.average");
            });

            it("should return 'above.average' for HRV 85ms at age 20", async () => {
                const result = await evaluate(85, 20);
                expect(result.status).toBe("above.average");
            });

            it("should return 'excellent' for HRV 86ms at age 20", async () => {
                const result = await evaluate(86, 20);
                expect(result.status).toBe("excellent");
            });

            it("should return 'excellent' for HRV 100ms at age 20", async () => {
                const result = await evaluate(100, 20);
                expect(result.status).toBe("excellent");
            });

            it("should return 'elite' for HRV 101ms at age 20", async () => {
                const result = await evaluate(101, 20);
                expect(result.status).toBe("elite");
            });

            it("should return 'elite' for HRV 150ms at age 20", async () => {
                const result = await evaluate(150, 20);
                expect(result.status).toBe("elite");
            });
        });

        describe("Age Group 35-39", () => {
            // Thresholds: [25, 38, 55, 72, 88]

            it("should return 'low' for HRV 20ms at age 37", async () => {
                const result = await evaluate(20, 37);
                expect(result.status).toBe("low");
            });

            it("should return 'below.average' for HRV 30ms at age 37", async () => {
                const result = await evaluate(30, 37);
                expect(result.status).toBe("below.average");
            });

            it("should return 'average' for HRV 45ms at age 37", async () => {
                const result = await evaluate(45, 37);
                expect(result.status).toBe("average");
            });

            it("should return 'above.average' for HRV 60ms at age 37", async () => {
                const result = await evaluate(60, 37);
                expect(result.status).toBe("above.average");
            });

            it("should return 'excellent' for HRV 80ms at age 37", async () => {
                const result = await evaluate(80, 37);
                expect(result.status).toBe("excellent");
            });

            it("should return 'elite' for HRV 90ms at age 37", async () => {
                const result = await evaluate(90, 37);
                expect(result.status).toBe("elite");
            });
        });

        describe("Age Group 55-59", () => {
            // Thresholds: [19, 30, 45, 60, 75]

            it("should return 'low' for HRV 15ms at age 57", async () => {
                const result = await evaluate(15, 57);
                expect(result.status).toBe("low");
            });

            it("should return 'below.average' for HRV 25ms at age 57", async () => {
                const result = await evaluate(25, 57);
                expect(result.status).toBe("below.average");
            });

            it("should return 'average' for HRV 40ms at age 57", async () => {
                const result = await evaluate(40, 57);
                expect(result.status).toBe("average");
            });

            it("should return 'above.average' for HRV 50ms at age 57", async () => {
                const result = await evaluate(50, 57);
                expect(result.status).toBe("above.average");
            });

            it("should return 'excellent' for HRV 70ms at age 57", async () => {
                const result = await evaluate(70, 57);
                expect(result.status).toBe("excellent");
            });

            it("should return 'elite' for HRV 80ms at age 57", async () => {
                const result = await evaluate(80, 57);
                expect(result.status).toBe("elite");
            });
        });

        describe("Age Group 65+", () => {
            // Thresholds: [17, 26, 40, 54, 70]

            it("should return 'low' for HRV 10ms at age 70", async () => {
                const result = await evaluate(10, 70);
                expect(result.status).toBe("low");
            });

            it("should return 'below.average' for HRV 20ms at age 70", async () => {
                const result = await evaluate(20, 70);
                expect(result.status).toBe("below.average");
            });

            it("should return 'average' for HRV 35ms at age 70", async () => {
                const result = await evaluate(35, 70);
                expect(result.status).toBe("average");
            });

            it("should return 'above.average' for HRV 50ms at age 70", async () => {
                const result = await evaluate(50, 70);
                expect(result.status).toBe("above.average");
            });

            it("should return 'excellent' for HRV 60ms at age 70", async () => {
                const result = await evaluate(60, 70);
                expect(result.status).toBe("excellent");
            });

            it("should return 'elite' for HRV 75ms at age 70", async () => {
                const result = await evaluate(75, 70);
                expect(result.status).toBe("elite");
            });
        });

        describe("Edge Cases", () => {

            it("should use 18-24 thresholds for age below 18", async () => {
                const result = await evaluate(50, 16);
                expect(result.status).toBe("average");
            });

            it("should handle HRV of 0", async () => {
                const result = await evaluate(0, 30);
                expect(result.status).toBe("low");
                expect(result.score).toBe(0);
            });

            it("should handle very high HRV values", async () => {
                const result = await evaluate(200, 30);
                expect(result.status).toBe("elite");
            });
        });
    });

    describe("evaluateScore", () => {

        describe("Low Status Scoring (0-199)", () => {
            // Score scales from 0 at HRV=0 to 199 at lowMax

            it("should score 0 for HRV 0ms", async () => {
                const result = await evaluate(0, 30);
                expect(result.score).toBe(0);
            });

            it("should score ~100 midway through low range", async () => {
                // Age 30-34: lowMax = 26, so HRV 13 is midway
                const result = await evaluate(13, 30);
                expect(result.score).toBeCloseTo(100, -1);
            });

            it("should score ~199 at low threshold boundary", async () => {
                // Age 30-34: lowMax = 26
                const result = await evaluate(26, 30);
                expect(result.score).toBe(199);
            });
        });

        describe("Below Average Scoring (200-449)", () => {
            // Score ranges from 200 to 449

            it("should score ~200 at below.average lower boundary", async () => {
                // Age 30-34: lowMax = 26, so HRV 27 enters below.average
                const result = await evaluate(27, 30);
                expect(result.score).toBeGreaterThanOrEqual(200);
                expect(result.score).toBeLessThan(220);
            });

            it("should score ~325 midway through below.average range", async () => {
                // Age 30-34: belowAvgMax = 40, lowMax = 26, midpoint = 33
                const result = await evaluate(33, 30);
                expect(result.score).toBeGreaterThanOrEqual(300);
                expect(result.score).toBeLessThanOrEqual(350);
            });

            it("should score ~449 at below.average upper boundary", async () => {
                // Age 30-34: belowAvgMax = 40
                const result = await evaluate(40, 30);
                expect(result.score).toBe(449);
            });
        });

        describe("Average Scoring (450-649)", () => {
            // Score ranges from 450 to 649

            it("should score ~450 at average lower boundary", async () => {
                // Age 30-34: belowAvgMax = 40, so HRV 41 enters average
                const result = await evaluate(41, 30);
                expect(result.score).toBeGreaterThanOrEqual(450);
                expect(result.score).toBeLessThan(470);
            });

            it("should score ~550 midway through average range", async () => {
                // Age 30-34: avgMax = 58, belowAvgMax = 40, midpoint = 49
                const result = await evaluate(49, 30);
                expect(result.score).toBeGreaterThanOrEqual(530);
                expect(result.score).toBeLessThanOrEqual(570);
            });

            it("should score ~649 at average upper boundary", async () => {
                // Age 30-34: avgMax = 58
                const result = await evaluate(58, 30);
                expect(result.score).toBe(649);
            });
        });

        describe("Above Average Scoring (650-799)", () => {
            // Score ranges from 650 to 799

            it("should score ~650 at above.average lower boundary", async () => {
                // Age 30-34: avgMax = 58, so HRV 59 enters above.average
                const result = await evaluate(59, 30);
                expect(result.score).toBeGreaterThanOrEqual(650);
                expect(result.score).toBeLessThan(670);
            });

            it("should score ~725 midway through above.average range", async () => {
                // Age 30-34: aboveAvgMax = 75, avgMax = 58, midpoint = 66.5
                const result = await evaluate(67, 30);
                expect(result.score).toBeGreaterThanOrEqual(710);
                expect(result.score).toBeLessThanOrEqual(740);
            });

            it("should score ~799 at above.average upper boundary", async () => {
                // Age 30-34: aboveAvgMax = 75
                const result = await evaluate(75, 30);
                expect(result.score).toBe(799);
            });
        });

        describe("Excellent Scoring (800-899)", () => {
            // Score ranges from 800 to 899

            it("should score ~800 at excellent lower boundary", async () => {
                // Age 30-34: aboveAvgMax = 75, so HRV 76 enters excellent
                const result = await evaluate(76, 30);
                expect(result.score).toBeGreaterThanOrEqual(800);
                expect(result.score).toBeLessThan(810);
            });

            it("should score ~850 midway through excellent range", async () => {
                // Age 30-34: excellentMax = 90, aboveAvgMax = 75, midpoint = 82.5
                const result = await evaluate(83, 30);
                expect(result.score).toBeGreaterThanOrEqual(840);
                expect(result.score).toBeLessThanOrEqual(860);
            });

            it("should score ~899 at excellent upper boundary", async () => {
                // Age 30-34: excellentMax = 90
                const result = await evaluate(90, 30);
                expect(result.score).toBe(899);
            });
        });

        describe("Elite Scoring (900-1000)", () => {
            // Score ranges from 900 to 1000

            it("should score ~900 at elite lower boundary", async () => {
                // Age 30-34: excellentMax = 90, so HRV 91 enters elite
                const result = await evaluate(91, 30);
                expect(result.score).toBeGreaterThanOrEqual(900);
                expect(result.score).toBeLessThan(910);
            });

            it("should score ~950 at 25ms above elite threshold", async () => {
                // Age 30-34: excellentMax = 90, so 90 + 25 = 115
                const result = await evaluate(115, 30);
                expect(result.score).toBeGreaterThanOrEqual(945);
                expect(result.score).toBeLessThanOrEqual(955);
            });

            it("should score 1000 at 50ms or more above elite threshold", async () => {
                // Age 30-34: excellentMax = 90, so 90 + 50 = 140
                const result = await evaluate(140, 30);
                expect(result.score).toBe(1000);
            });

            it("should cap at 1000 for very high HRV values", async () => {
                const result = await evaluate(200, 30);
                expect(result.score).toBe(1000);
            });
        });
    });

    describe("Age-Specific Scoring", () => {
        // Same HRV value should produce different scores for different ages

        it("should score higher for older person with same HRV", async () => {
            // HRV of 50ms
            const youngResult = await evaluate(50, 25);  // 25-29 thresholds
            const olderResult = await evaluate(50, 57);  // 55-59 thresholds

            // For 25-year-old: 50ms is in "average" range (43-60)
            // For 57-year-old: 50ms is in "above.average" range (46-60)
            expect(olderResult.score).toBeGreaterThan(youngResult.score);
        });

        it("should produce elite status for older person at lower HRV", async () => {
            // Age 20: elite threshold is 101+
            // Age 70: elite threshold is 71+
            const youngResult = await evaluate(75, 20);
            const olderResult = await evaluate(75, 70);

            expect(youngResult.status).toBe("above.average");
            expect(olderResult.status).toBe("elite");
        });
    });

    describe("Status Boundary Transitions", () => {

        describe("Age 30-34 boundaries", () => {
            // Thresholds: [26, 40, 58, 75, 90]

            it("should transition from low to below.average at 27ms", async () => {
                const low = await evaluate(26, 30);
                const belowAvg = await evaluate(27, 30);

                expect(low.status).toBe("low");
                expect(belowAvg.status).toBe("below.average");
            });

            it("should transition from below.average to average at 41ms", async () => {
                const belowAvg = await evaluate(40, 30);
                const average = await evaluate(41, 30);

                expect(belowAvg.status).toBe("below.average");
                expect(average.status).toBe("average");
            });

            it("should transition from average to above.average at 59ms", async () => {
                const average = await evaluate(58, 30);
                const aboveAvg = await evaluate(59, 30);

                expect(average.status).toBe("average");
                expect(aboveAvg.status).toBe("above.average");
            });

            it("should transition from above.average to excellent at 76ms", async () => {
                const aboveAvg = await evaluate(75, 30);
                const excellent = await evaluate(76, 30);

                expect(aboveAvg.status).toBe("above.average");
                expect(excellent.status).toBe("excellent");
            });

            it("should transition from excellent to elite at 91ms", async () => {
                const excellent = await evaluate(90, 30);
                const elite = await evaluate(91, 30);

                expect(excellent.status).toBe("excellent");
                expect(elite.status).toBe("elite");
            });
        });
    });

    describe("Real-World Scenarios", () => {

        it("should classify healthy young athlete (age 22, HRV 95ms)", async () => {
            const result = await evaluate(95, 22);

            expect(result.status).toBe("excellent");
            expect(result.score).toBeGreaterThanOrEqual(850);
            expect(result.score).toBeLessThanOrEqual(899);
        });

        it("should classify fit middle-aged adult (age 45, HRV 60ms)", async () => {
            const result = await evaluate(60, 45);

            expect(result.status).toBe("above.average");
            expect(result.score).toBeGreaterThanOrEqual(650);
            expect(result.score).toBeLessThanOrEqual(750);
        });

        it("should classify stressed office worker (age 35, HRV 30ms)", async () => {
            const result = await evaluate(30, 35);

            expect(result.status).toBe("below.average");
            expect(result.score).toBeGreaterThanOrEqual(250);
            expect(result.score).toBeLessThanOrEqual(400);
        });

        it("should classify healthy senior (age 68, HRV 55ms)", async () => {
            const result = await evaluate(55, 68);

            expect(result.status).toBe("excellent");
            expect(result.score).toBeGreaterThanOrEqual(800);
        });

        it("should classify elite endurance athlete (age 28, HRV 120ms)", async () => {
            const result = await evaluate(120, 28);

            expect(result.status).toBe("elite");
            expect(result.score).toBeGreaterThanOrEqual(950);
        });

        it("should classify fatigued/overtrained athlete (age 25, HRV 25ms)", async () => {
            const result = await evaluate(25, 25);

            expect(result.status).toBe("low");
            expect(result.score).toBeLessThanOrEqual(199);
        });
    });

    describe("Data Storage", () => {

        it("should store milliseconds, age, and sex in data", async () => {
            const result = await evaluate(50, 35, 'F');

            expect(result.data.milliseconds).toBe(50);
            expect(result.data.age).toBe(35);
            expect(result.data.sex).toBe('F');
        });

        it("should set all result fields", async () => {
            const result = await evaluate(60, 40);

            expect(result.status).toBeDefined();
            expect(result.score).toBeDefined();
            expect(result.data).toBeDefined();
        });
    });

    describe("Sex Parameter", () => {
        // Currently sex is not used in thresholds, but verify it doesn't break anything

        it("should produce same results for male and female with same HRV and age", async () => {
            const maleResult = await evaluate(50, 35, 'M');
            const femaleResult = await evaluate(50, 35, 'F');

            expect(maleResult.status).toBe(femaleResult.status);
            expect(maleResult.score).toBe(femaleResult.score);
        });
    });
});
