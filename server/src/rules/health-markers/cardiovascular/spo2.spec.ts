import nools from "nools";
import * as path from "path";

describe("spo2.nools", () => {

    let flow: any;
    let SPO2: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "spo2.nools"));
        SPO2 = flow.getDefined("SPO2");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluate(value: number): Promise<any> {
        const spo2 = new SPO2({ value });

        const result = new ScoreResult();
        const session = flow.getSession(spo2, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("evaluateStatus", () => {

        describe("Normal (95-100%)", () => {

            it("should return 'normal' for SpO2 100%", async () => {
                const result = await evaluate(100);
                expect(result.status).toBe("normal");
            });

            it("should return 'normal' for SpO2 99%", async () => {
                const result = await evaluate(99);
                expect(result.status).toBe("normal");
            });

            it("should return 'normal' for SpO2 97%", async () => {
                const result = await evaluate(97);
                expect(result.status).toBe("normal");
            });

            it("should return 'normal' for SpO2 95%", async () => {
                const result = await evaluate(95);
                expect(result.status).toBe("normal");
            });
        });

        describe("Concerning (91-94%)", () => {

            it("should return 'concerning' for SpO2 94%", async () => {
                const result = await evaluate(94);
                expect(result.status).toBe("concerning");
            });

            it("should return 'concerning' for SpO2 93%", async () => {
                const result = await evaluate(93);
                expect(result.status).toBe("concerning");
            });

            it("should return 'concerning' for SpO2 92%", async () => {
                const result = await evaluate(92);
                expect(result.status).toBe("concerning");
            });

            it("should return 'concerning' for SpO2 91%", async () => {
                const result = await evaluate(91);
                expect(result.status).toBe("concerning");
            });
        });

        describe("Low (86-90%)", () => {

            it("should return 'low' for SpO2 90%", async () => {
                const result = await evaluate(90);
                expect(result.status).toBe("low");
            });

            it("should return 'low' for SpO2 88%", async () => {
                const result = await evaluate(88);
                expect(result.status).toBe("low");
            });

            it("should return 'low' for SpO2 86%", async () => {
                const result = await evaluate(86);
                expect(result.status).toBe("low");
            });
        });

        describe("Possible Brain Effects (80-85%)", () => {

            it("should return 'possible.brain.effects' for SpO2 85%", async () => {
                const result = await evaluate(85);
                expect(result.status).toBe("possible.brain.effects");
            });

            it("should return 'possible.brain.effects' for SpO2 82%", async () => {
                const result = await evaluate(82);
                expect(result.status).toBe("possible.brain.effects");
            });

            it("should return 'possible.brain.effects' for SpO2 80%", async () => {
                const result = await evaluate(80);
                expect(result.status).toBe("possible.brain.effects");
            });
        });

        describe("Cyanosis (<80%)", () => {

            it("should return 'cyanosis' for SpO2 79%", async () => {
                const result = await evaluate(79);
                expect(result.status).toBe("cyanosis");
            });

            it("should return 'cyanosis' for SpO2 75%", async () => {
                const result = await evaluate(75);
                expect(result.status).toBe("cyanosis");
            });

            it("should return 'cyanosis' for SpO2 67%", async () => {
                const result = await evaluate(67);
                expect(result.status).toBe("cyanosis");
            });

            it("should return 'cyanosis' for SpO2 60%", async () => {
                const result = await evaluate(60);
                expect(result.status).toBe("cyanosis");
            });
        });

        describe("Boundary Transitions", () => {

            it("should transition from normal to concerning at 94%", async () => {
                const normal = await evaluate(95);
                const concerning = await evaluate(94);

                expect(normal.status).toBe("normal");
                expect(concerning.status).toBe("concerning");
            });

            it("should transition from concerning to low at 90%", async () => {
                const concerning = await evaluate(91);
                const low = await evaluate(90);

                expect(concerning.status).toBe("concerning");
                expect(low.status).toBe("low");
            });

            it("should transition from low to possible.brain.effects at 85%", async () => {
                const low = await evaluate(86);
                const brainEffects = await evaluate(85);

                expect(low.status).toBe("low");
                expect(brainEffects.status).toBe("possible.brain.effects");
            });

            it("should transition from possible.brain.effects to cyanosis at 79%", async () => {
                const brainEffects = await evaluate(80);
                const cyanosis = await evaluate(79);

                expect(brainEffects.status).toBe("possible.brain.effects");
                expect(cyanosis.status).toBe("cyanosis");
            });
        });
    });

    describe("evaluateScore", () => {

        describe("Normal Scoring (900-1000)", () => {

            it("should score 1000 for SpO2 100%", async () => {
                const result = await evaluate(100);
                expect(result.score).toBe(1000);
            });

            it("should score 900 for SpO2 95%", async () => {
                const result = await evaluate(95);
                expect(result.score).toBe(900);
            });

            it("should score ~960 for SpO2 98%", async () => {
                const result = await evaluate(98);
                expect(result.score).toBeGreaterThanOrEqual(955);
                expect(result.score).toBeLessThanOrEqual(965);
            });

            it("should score ~920 for SpO2 96%", async () => {
                const result = await evaluate(96);
                expect(result.score).toBeGreaterThanOrEqual(915);
                expect(result.score).toBeLessThanOrEqual(925);
            });
        });

        describe("Concerning Scoring (600-899)", () => {

            it("should score ~899 at upper boundary (94%)", async () => {
                const result = await evaluate(94);
                expect(result.score).toBeGreaterThanOrEqual(890);
                expect(result.score).toBeLessThanOrEqual(899);
            });

            it("should score 600 at lower boundary (91%)", async () => {
                const result = await evaluate(91);
                expect(result.score).toBe(600);
            });

            it("should score ~750 midway through concerning range (92-93%)", async () => {
                const result = await evaluate(92);
                expect(result.score).toBeGreaterThanOrEqual(690);
                expect(result.score).toBeLessThanOrEqual(710);
            });
        });

        describe("Low Scoring (300-599)", () => {

            it("should score ~599 at upper boundary (90%)", async () => {
                const result = await evaluate(90);
                expect(result.score).toBeGreaterThanOrEqual(590);
                expect(result.score).toBeLessThanOrEqual(599);
            });

            it("should score 300 at lower boundary (86%)", async () => {
                const result = await evaluate(86);
                expect(result.score).toBe(300);
            });

            it("should score ~450 midway through low range (88%)", async () => {
                const result = await evaluate(88);
                expect(result.score).toBeGreaterThanOrEqual(440);
                expect(result.score).toBeLessThanOrEqual(460);
            });
        });

        describe("Possible Brain Effects Scoring (100-299)", () => {

            it("should score ~299 at upper boundary (85%)", async () => {
                const result = await evaluate(85);
                expect(result.score).toBeGreaterThanOrEqual(290);
                expect(result.score).toBeLessThanOrEqual(299);
            });

            it("should score 100 at lower boundary (80%)", async () => {
                const result = await evaluate(80);
                expect(result.score).toBe(100);
            });

            it("should score ~200 midway through range (82-83%)", async () => {
                const result = await evaluate(82);
                expect(result.score).toBeGreaterThanOrEqual(170);
                expect(result.score).toBeLessThanOrEqual(190);
            });
        });

        describe("Cyanosis Scoring (0-99)", () => {

            it("should score ~99 at upper boundary (79%)", async () => {
                const result = await evaluate(79);
                expect(result.score).toBeGreaterThanOrEqual(95);
                expect(result.score).toBeLessThanOrEqual(99);
            });

            it("should score 0 at 67% or below", async () => {
                const result = await evaluate(67);
                expect(result.score).toBe(0);
            });

            it("should score 0 for extremely low SpO2 (60%)", async () => {
                const result = await evaluate(60);
                expect(result.score).toBe(0);
            });

            it("should score ~50 midway through cyanosis range (73%)", async () => {
                const result = await evaluate(73);
                expect(result.score).toBeGreaterThanOrEqual(45);
                expect(result.score).toBeLessThanOrEqual(55);
            });
        });

        describe("Score Monotonicity", () => {

            it("should have higher score for higher SpO2 values above 67%", async () => {
                // Note: values at or below 67% all score 0 (floor)
                const values = [68, 73, 79, 80, 85, 86, 90, 91, 94, 95, 100];
                const results = await Promise.all(values.map(v => evaluate(v)));

                for (let i = 1; i < results.length; i++) {
                    expect(results[i].score).toBeGreaterThan(results[i - 1].score);
                }
            });

            it("should score 0 for all values at or below 67%", async () => {
                const values = [60, 65, 67];
                const results = await Promise.all(values.map(v => evaluate(v)));

                for (const result of results) {
                    expect(result.score).toBe(0);
                }
            });
        });
    });

    describe("Real-World Scenarios", () => {

        it("should classify healthy person at rest (SpO2 98%)", async () => {
            const result = await evaluate(98);

            expect(result.status).toBe("normal");
            expect(result.score).toBeGreaterThanOrEqual(955);
        });

        it("should classify healthy person (SpO2 97%)", async () => {
            const result = await evaluate(97);

            expect(result.status).toBe("normal");
            expect(result.score).toBeGreaterThanOrEqual(935);
        });

        it("should classify person at high altitude (SpO2 93%)", async () => {
            const result = await evaluate(93);

            expect(result.status).toBe("concerning");
            expect(result.score).toBeGreaterThanOrEqual(750);
            expect(result.score).toBeLessThanOrEqual(850);
        });

        it("should classify person with mild respiratory issues (SpO2 91%)", async () => {
            const result = await evaluate(91);

            expect(result.status).toBe("concerning");
            expect(result.score).toBe(600);
        });

        it("should classify person needing supplemental oxygen (SpO2 88%)", async () => {
            const result = await evaluate(88);

            expect(result.status).toBe("low");
            expect(result.score).toBeGreaterThanOrEqual(400);
            expect(result.score).toBeLessThanOrEqual(500);
        });

        it("should classify person with severe hypoxemia (SpO2 82%)", async () => {
            const result = await evaluate(82);

            expect(result.status).toBe("possible.brain.effects");
            expect(result.score).toBeGreaterThanOrEqual(150);
            expect(result.score).toBeLessThanOrEqual(200);
        });

        it("should classify person with life-threatening hypoxemia (SpO2 75%)", async () => {
            const result = await evaluate(75);

            expect(result.status).toBe("cyanosis");
            expect(result.score).toBeLessThan(100);
        });

        it("should classify critical emergency (SpO2 67%)", async () => {
            const result = await evaluate(67);

            expect(result.status).toBe("cyanosis");
            expect(result.score).toBe(0);
        });
    });

    describe("Data Storage", () => {

        it("should store spo2 value in data", async () => {
            const result = await evaluate(97);

            expect(result.data.spo2).toBe(97);
        });

        it("should set all result fields", async () => {
            const result = await evaluate(95);

            expect(result.status).toBeDefined();
            expect(result.score).toBeDefined();
            expect(result.data).toBeDefined();
        });
    });

    describe("Edge Cases", () => {

        it("should handle SpO2 above 100% (treat as perfect)", async () => {
            const result = await evaluate(101);

            expect(result.status).toBe("normal");
            expect(result.score).toBe(1000);
        });

        it("should handle minimum normal boundary exactly (95%)", async () => {
            const result = await evaluate(95);

            expect(result.status).toBe("normal");
            expect(result.score).toBe(900);
        });

        it("should handle decimal values (97.5%)", async () => {
            const result = await evaluate(97.5);

            expect(result.status).toBe("normal");
            expect(result.score).toBeGreaterThanOrEqual(945);
            expect(result.score).toBeLessThanOrEqual(955);
        });
    });
});
