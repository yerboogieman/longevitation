import nools from "nools";
import * as path from "path";

describe("sdldl.nools", () => {

    let flow: any;
    let SDLDL: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "sdldl.nools"));
        SDLDL = flow.getDefined("SDLDL");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluate(
        value: number,
        age: number = 40,
        sex: 'M' | 'F' = 'M'
    ): Promise<any> {
        const sdldl = new SDLDL({ value, age, sex });

        const result = new ScoreResult();
        const session = flow.getSession(sdldl, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("evaluateStatus", () => {

        describe("Optimal (< 30 mg/dL)", () => {

            it("should return 'optimal' for sdLDL 10 mg/dL", async () => {
                const result = await evaluate(10);
                expect(result.status).toBe("optimal");
            });

            it("should return 'optimal' for sdLDL 20 mg/dL", async () => {
                const result = await evaluate(20);
                expect(result.status).toBe("optimal");
            });

            it("should return 'optimal' for sdLDL 29.9 mg/dL", async () => {
                const result = await evaluate(29.9);
                expect(result.status).toBe("optimal");
            });
        });

        describe("Normal (30-49.9 mg/dL)", () => {

            it("should return 'normal' for sdLDL 30 mg/dL", async () => {
                const result = await evaluate(30);
                expect(result.status).toBe("normal");
            });

            it("should return 'normal' for sdLDL 40 mg/dL", async () => {
                const result = await evaluate(40);
                expect(result.status).toBe("normal");
            });

            it("should return 'normal' for sdLDL 49.9 mg/dL", async () => {
                const result = await evaluate(49.9);
                expect(result.status).toBe("normal");
            });
        });

        describe("Above Goal (50-59.9 mg/dL)", () => {

            it("should return 'above.goal' for sdLDL 50 mg/dL", async () => {
                const result = await evaluate(50);
                expect(result.status).toBe("above.goal");
            });

            it("should return 'above.goal' for sdLDL 55 mg/dL", async () => {
                const result = await evaluate(55);
                expect(result.status).toBe("above.goal");
            });

            it("should return 'above.goal' for sdLDL 59.9 mg/dL", async () => {
                const result = await evaluate(59.9);
                expect(result.status).toBe("above.goal");
            });
        });

        describe("Elevated (60-79.9 mg/dL)", () => {

            it("should return 'elevated' for sdLDL 60 mg/dL", async () => {
                const result = await evaluate(60);
                expect(result.status).toBe("elevated");
            });

            it("should return 'elevated' for sdLDL 70 mg/dL", async () => {
                const result = await evaluate(70);
                expect(result.status).toBe("elevated");
            });

            it("should return 'elevated' for sdLDL 79.9 mg/dL", async () => {
                const result = await evaluate(79.9);
                expect(result.status).toBe("elevated");
            });
        });

        describe("High (>= 80 mg/dL)", () => {

            it("should return 'high' for sdLDL 80 mg/dL", async () => {
                const result = await evaluate(80);
                expect(result.status).toBe("high");
            });

            it("should return 'high' for sdLDL 100 mg/dL", async () => {
                const result = await evaluate(100);
                expect(result.status).toBe("high");
            });

            it("should return 'high' for sdLDL 120 mg/dL", async () => {
                const result = await evaluate(120);
                expect(result.status).toBe("high");
            });

            it("should return 'high' for sdLDL 150 mg/dL", async () => {
                const result = await evaluate(150);
                expect(result.status).toBe("high");
            });
        });

        describe("Boundary Transitions", () => {

            it("should transition from optimal to normal at 30 mg/dL", async () => {
                const optimal = await evaluate(29.9);
                const normal = await evaluate(30);

                expect(optimal.status).toBe("optimal");
                expect(normal.status).toBe("normal");
            });

            it("should transition from normal to above.goal at 50 mg/dL", async () => {
                const normal = await evaluate(49.9);
                const aboveGoal = await evaluate(50);

                expect(normal.status).toBe("normal");
                expect(aboveGoal.status).toBe("above.goal");
            });

            it("should transition from above.goal to elevated at 60 mg/dL", async () => {
                const aboveGoal = await evaluate(59.9);
                const elevated = await evaluate(60);

                expect(aboveGoal.status).toBe("above.goal");
                expect(elevated.status).toBe("elevated");
            });

            it("should transition from elevated to high at 80 mg/dL", async () => {
                const elevated = await evaluate(79.9);
                const high = await evaluate(80);

                expect(elevated.status).toBe("elevated");
                expect(high.status).toBe("high");
            });
        });
    });

    describe("evaluateScore", () => {

        describe("Optimal Scoring (900-1000)", () => {

            it("should score 1000 for sdLDL near 0", async () => {
                const result = await evaluate(1);
                expect(result.score).toBeGreaterThanOrEqual(995);
                expect(result.score).toBeLessThanOrEqual(1000);
            });

            it("should score ~900 at optimal upper boundary (30 mg/dL)", async () => {
                const result = await evaluate(29.9);
                expect(result.score).toBeGreaterThanOrEqual(900);
                expect(result.score).toBeLessThanOrEqual(905);
            });

            it("should score ~950 midway through optimal range (15 mg/dL)", async () => {
                const result = await evaluate(15);
                expect(result.score).toBeGreaterThanOrEqual(945);
                expect(result.score).toBeLessThanOrEqual(955);
            });
        });

        describe("Normal Scoring (700-899)", () => {

            it("should score ~899 at normal lower boundary (30 mg/dL)", async () => {
                const result = await evaluate(30);
                expect(result.score).toBeGreaterThanOrEqual(895);
                expect(result.score).toBeLessThanOrEqual(899);
            });

            it("should score 700 at normal upper boundary (50 mg/dL)", async () => {
                const result = await evaluate(49.9);
                expect(result.score).toBeGreaterThanOrEqual(700);
                expect(result.score).toBeLessThanOrEqual(710);
            });

            it("should score ~800 midway through normal range (40 mg/dL)", async () => {
                const result = await evaluate(40);
                expect(result.score).toBeGreaterThanOrEqual(795);
                expect(result.score).toBeLessThanOrEqual(805);
            });
        });

        describe("Above Goal Scoring (400-699)", () => {

            it("should score ~699 at above.goal lower boundary (50 mg/dL)", async () => {
                const result = await evaluate(50);
                expect(result.score).toBeGreaterThanOrEqual(695);
                expect(result.score).toBeLessThanOrEqual(699);
            });

            it("should score ~400 at above.goal upper boundary (60 mg/dL)", async () => {
                const result = await evaluate(59.9);
                expect(result.score).toBeGreaterThanOrEqual(400);
                expect(result.score).toBeLessThanOrEqual(410);
            });

            it("should score ~550 midway through above.goal range (55 mg/dL)", async () => {
                const result = await evaluate(55);
                expect(result.score).toBeGreaterThanOrEqual(545);
                expect(result.score).toBeLessThanOrEqual(555);
            });
        });

        describe("Elevated Scoring (150-399)", () => {

            it("should score ~399 at elevated lower boundary (60 mg/dL)", async () => {
                const result = await evaluate(60);
                expect(result.score).toBeGreaterThanOrEqual(395);
                expect(result.score).toBeLessThanOrEqual(399);
            });

            it("should score ~150 at elevated upper boundary (80 mg/dL)", async () => {
                const result = await evaluate(79.9);
                expect(result.score).toBeGreaterThanOrEqual(150);
                expect(result.score).toBeLessThanOrEqual(160);
            });

            it("should score ~275 midway through elevated range (70 mg/dL)", async () => {
                const result = await evaluate(70);
                expect(result.score).toBeGreaterThanOrEqual(270);
                expect(result.score).toBeLessThanOrEqual(280);
            });
        });

        describe("High Scoring (0-149)", () => {

            it("should score ~149 at high lower boundary (80 mg/dL)", async () => {
                const result = await evaluate(80);
                expect(result.score).toBeGreaterThanOrEqual(145);
                expect(result.score).toBeLessThanOrEqual(149);
            });

            it("should score 0 at 120 mg/dL or above", async () => {
                const result = await evaluate(120);
                expect(result.score).toBe(0);
            });

            it("should score 0 for very high sdLDL (150 mg/dL)", async () => {
                const result = await evaluate(150);
                expect(result.score).toBe(0);
            });

            it("should score ~75 midway through high range (100 mg/dL)", async () => {
                const result = await evaluate(100);
                expect(result.score).toBeGreaterThanOrEqual(70);
                expect(result.score).toBeLessThanOrEqual(80);
            });
        });

        describe("Score Monotonicity", () => {

            it("should have higher score for lower sdLDL values", async () => {
                const values = [10, 25, 35, 45, 55, 65, 75, 85, 100, 115];
                const results = await Promise.all(values.map(v => evaluate(v)));

                for (let i = 1; i < results.length; i++) {
                    expect(results[i - 1].score).toBeGreaterThan(results[i].score);
                }
            });

            it("should score 0 for all values at or above 120 mg/dL", async () => {
                const values = [120, 130, 150, 200];
                const results = await Promise.all(values.map(v => evaluate(v)));

                for (const result of results) {
                    expect(result.score).toBe(0);
                }
            });
        });
    });

    describe("Real-World Scenarios", () => {

        it("should classify person with excellent lipid profile (sdLDL 18 mg/dL)", async () => {
            const result = await evaluate(18);

            expect(result.status).toBe("optimal");
            expect(result.score).toBeGreaterThanOrEqual(935);
        });

        it("should classify person at lower end of reference range (sdLDL 25 mg/dL)", async () => {
            const result = await evaluate(25);

            expect(result.status).toBe("optimal");
            expect(result.score).toBeGreaterThanOrEqual(915);
        });

        it("should classify person within normal range (sdLDL 40 mg/dL)", async () => {
            const result = await evaluate(40);

            expect(result.status).toBe("normal");
            expect(result.score).toBeGreaterThanOrEqual(795);
            expect(result.score).toBeLessThanOrEqual(805);
        });

        it("should classify person at goal threshold (sdLDL 48 mg/dL)", async () => {
            const result = await evaluate(48);

            expect(result.status).toBe("normal");
            expect(result.score).toBeGreaterThanOrEqual(710);
            expect(result.score).toBeLessThanOrEqual(730);
        });

        it("should classify person slightly above goal (sdLDL 52 mg/dL)", async () => {
            const result = await evaluate(52);

            expect(result.status).toBe("above.goal");
            expect(result.score).toBeGreaterThanOrEqual(630);
            expect(result.score).toBeLessThanOrEqual(650);
        });

        it("should classify person with moderately elevated sdLDL (65 mg/dL)", async () => {
            const result = await evaluate(65);

            expect(result.status).toBe("elevated");
            expect(result.score).toBeGreaterThanOrEqual(330);
            expect(result.score).toBeLessThanOrEqual(350);
        });

        it("should classify person with high sdLDL (90 mg/dL)", async () => {
            const result = await evaluate(90);

            expect(result.status).toBe("high");
            expect(result.score).toBeGreaterThanOrEqual(105);
            expect(result.score).toBeLessThanOrEqual(115);
        });

        it("should classify person with very high sdLDL (110 mg/dL)", async () => {
            const result = await evaluate(110);

            expect(result.status).toBe("high");
            expect(result.score).toBeGreaterThanOrEqual(35);
            expect(result.score).toBeLessThanOrEqual(45);
        });
    });

    describe("Data Storage", () => {

        it("should store sdldl value in data", async () => {
            const result = await evaluate(42);

            expect(result.data.sdldl).toBe(42);
        });

        it("should set all result fields", async () => {
            const result = await evaluate(35);

            expect(result.status).toBeDefined();
            expect(result.score).toBeDefined();
            expect(result.data).toBeDefined();
        });
    });

    describe("Edge Cases", () => {

        it("should handle sdLDL at exactly 50 mg/dL (goal threshold)", async () => {
            const result = await evaluate(50);

            expect(result.status).toBe("above.goal");
            expect(result.score).toBeLessThan(700);
        });

        it("should handle decimal values (37.5 mg/dL)", async () => {
            const result = await evaluate(37.5);

            expect(result.status).toBe("normal");
            expect(result.score).toBeGreaterThanOrEqual(820);
            expect(result.score).toBeLessThanOrEqual(835);
        });

        it("should handle very low sdLDL values (5 mg/dL)", async () => {
            const result = await evaluate(5);

            expect(result.status).toBe("optimal");
            expect(result.score).toBeGreaterThanOrEqual(980);
        });

        it("should handle zero or negative values gracefully", async () => {
            const result = await evaluate(0);

            expect(result.score).toBe(1000);
        });
    });
});
