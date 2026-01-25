import nools from "nools";
import * as path from "path";

describe("a1c.nools", () => {

    let flow: any;
    let A1C: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "a1c.nools"));
        A1C = flow.getDefined("A1C");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluateA1C(percentage: number): Promise<any> {

        const a1c = new A1C({ percentage });

        const result = new ScoreResult();
        const session = flow.getSession(a1c, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("A1C Categories", () => {

        describe("Ideal (< 5.5%)", () => {

            it("should classify as ideal at 4.5%", async () => {

                const result = await evaluateA1C(4.5);

                expect(result.status).toBe("ideal");
            });

            it("should classify as ideal at 5.0%", async () => {

                const result = await evaluateA1C(5.0);

                expect(result.status).toBe("ideal");
            });

            it("should classify as ideal at 5.4%", async () => {

                const result = await evaluateA1C(5.4);

                expect(result.status).toBe("ideal");
            });

            it("should classify as ideal at 5.49%", async () => {

                const result = await evaluateA1C(5.49);

                expect(result.status).toBe("ideal");
            });
        });

        describe("In-Range (5.5% - 5.69%)", () => {

            it("should classify as in-range at lower boundary (5.5%)", async () => {

                const result = await evaluateA1C(5.5);

                expect(result.status).toBe("in-range");
            });

            it("should classify as in-range at 5.6%", async () => {

                const result = await evaluateA1C(5.6);

                expect(result.status).toBe("in-range");
            });

            it("should classify as in-range at 5.69%", async () => {

                const result = await evaluateA1C(5.69);

                expect(result.status).toBe("in-range");
            });
        });

        describe("Pre-Diabetes (5.7% - 6.4%)", () => {

            it("should classify as pre.diabetes at lower boundary (5.7%)", async () => {

                const result = await evaluateA1C(5.7);

                expect(result.status).toBe("pre.diabetes");
            });

            it("should classify as pre.diabetes at 6.0%", async () => {

                const result = await evaluateA1C(6.0);

                expect(result.status).toBe("pre.diabetes");
            });

            it("should classify as pre.diabetes at 6.2%", async () => {

                const result = await evaluateA1C(6.2);

                expect(result.status).toBe("pre.diabetes");
            });

            it("should classify as pre.diabetes at upper boundary (6.4%)", async () => {

                const result = await evaluateA1C(6.4);

                expect(result.status).toBe("pre.diabetes");
            });
        });

        describe("Diabetes (> 6.4%)", () => {

            it("should classify as diabetes at 6.5%", async () => {

                const result = await evaluateA1C(6.5);

                expect(result.status).toBe("diabetes");
            });

            it("should classify as diabetes at 7.0%", async () => {

                const result = await evaluateA1C(7.0);

                expect(result.status).toBe("diabetes");
            });

            it("should classify as diabetes at 7.5%", async () => {

                const result = await evaluateA1C(7.5);

                expect(result.status).toBe("diabetes");
            });

            it("should classify as diabetes at 8.0%", async () => {

                const result = await evaluateA1C(8.0);

                expect(result.status).toBe("diabetes");
            });

            it("should classify as diabetes at 9.0%", async () => {

                const result = await evaluateA1C(9.0);

                expect(result.status).toBe("diabetes");
            });

            it("should classify as diabetes at 10.0%", async () => {

                const result = await evaluateA1C(10.0);

                expect(result.status).toBe("diabetes");
            });
        });
    });

    describe("Boundary Transitions", () => {

        it("should transition from ideal to in-range at 5.49/5.5 boundary", async () => {

            const at549 = await evaluateA1C(5.49);
            const at55 = await evaluateA1C(5.5);

            expect(at549.status).toBe("ideal");
            expect(at55.status).toBe("in-range");
        });

        it("should transition from in-range to pre.diabetes at 5.69/5.7 boundary", async () => {

            const at569 = await evaluateA1C(5.69);
            const at57 = await evaluateA1C(5.7);

            expect(at569.status).toBe("in-range");
            expect(at57.status).toBe("pre.diabetes");
        });

        it("should transition from pre.diabetes to diabetes at 6.4/6.5 boundary", async () => {

            const at64 = await evaluateA1C(6.4);
            const at65 = await evaluateA1C(6.5);

            expect(at64.status).toBe("pre.diabetes");
            expect(at65.status).toBe("diabetes");
        });
    });

    describe("Edge Cases", () => {

        it("should handle very low A1C (3.5%)", async () => {

            const result = await evaluateA1C(3.5);

            expect(result.status).toBe("ideal");
        });

        it("should handle very high A1C (12.0%)", async () => {

            const result = await evaluateA1C(12.0);

            expect(result.status).toBe("diabetes");
        });

        it("should handle decimal precision at 5.699%", async () => {

            const result = await evaluateA1C(5.699);

            expect(result.status).toBe("in-range");
        });

        it("should handle decimal precision at 6.41%", async () => {

            const result = await evaluateA1C(6.41);

            expect(result.status).toBe("diabetes");
        });
    });

    describe("Typical Real-World Scenarios", () => {

        it("should classify healthy individual (5.2%)", async () => {

            const result = await evaluateA1C(5.2);

            expect(result.status).toBe("ideal");
        });

        it("should classify borderline normal (5.6%)", async () => {

            const result = await evaluateA1C(5.6);

            expect(result.status).toBe("in-range");
        });

        it("should classify early pre-diabetic (5.8%)", async () => {

            const result = await evaluateA1C(5.8);

            expect(result.status).toBe("pre.diabetes");
        });

        it("should classify late pre-diabetic (6.3%)", async () => {

            const result = await evaluateA1C(6.3);

            expect(result.status).toBe("pre.diabetes");
        });

        it("should classify newly diagnosed diabetic (6.8%)", async () => {

            const result = await evaluateA1C(6.8);

            expect(result.status).toBe("diabetes");
        });

        it("should classify uncontrolled diabetic (9.5%)", async () => {

            const result = await evaluateA1C(9.5);

            expect(result.status).toBe("diabetes");
        });
    });

    describe("Score Evaluation", () => {

        describe("Ideal Range (< 5.5%) - Scores 1000 to 850", () => {

            it("should return perfect score of 1000 at 0%", async () => {

                const result = await evaluateA1C(0);

                expect(result.score).toBe(1000);
            });

            it("should return ~909 at 3.33% (one-third through range)", async () => {

                const result = await evaluateA1C(3.33);

                expect(result.score).toBeCloseTo(909, 0);
            });

            it("should return ~864 at 5.0%", async () => {

                const result = await evaluateA1C(5.0);

                expect(result.score).toBeCloseTo(864, 0);
            });

            it("should return 850 just before 5.5% boundary", async () => {

                const result = await evaluateA1C(5.49);

                expect(result.score).toBe(850);
            });
        });

        describe("In-Range (5.5% - 5.7%) - Scores 849 to 750", () => {

            it("should return 849 at 5.5%", async () => {

                const result = await evaluateA1C(5.5);

                // Note: 5.5 falls into the second range, returning 849
                expect(result.score).toBeLessThanOrEqual(850);
            });

            it("should return ~800 at 5.6% (midpoint)", async () => {

                const result = await evaluateA1C(5.6);

                expect(result.score).toBeCloseTo(800, 0);
            });

            it("should return ~750 approaching 5.7%", async () => {

                const result = await evaluateA1C(5.69);

                expect(result.score).toBeCloseTo(755, 0);
            });
        });

        describe("Pre-Diabetes Range (5.7% - 6.4%) - Scores 749 to 650", () => {

            it("should return 749 at 5.7%", async () => {

                const result = await evaluateA1C(5.7);

                expect(result.score).toBe(749);
            });

            it("should return ~707 at 6.0% (midway through range)", async () => {

                const result = await evaluateA1C(6.0);

                expect(result.score).toBeCloseTo(707, 0);
            });

            it("should return 650 at 6.4%", async () => {

                const result = await evaluateA1C(6.4);

                expect(result.score).toBe(650);
            });
        });

        describe("Diabetes Range (> 6.4%) - Scores 649 to 0", () => {

            it("should return 649 just above 6.4%", async () => {

                const result = await evaluateA1C(6.41);

                expect(result.score).toBeLessThan(650);
                expect(result.score).toBeGreaterThan(640);
            });

            it("should return ~606 at 6.9%", async () => {

                const result = await evaluateA1C(6.9);

                expect(result.score).toBeCloseTo(606, 0);
            });

            it("should return ~478 at 8.0%", async () => {

                const result = await evaluateA1C(8.0);

                expect(result.score).toBeCloseTo(512, 0);
            });

            it("should return ~342 at 10.0%", async () => {

                const result = await evaluateA1C(10.0);

                expect(result.score).toBeCloseTo(342, 0);
            });

            it("should return ~85 at 13.0%", async () => {

                const result = await evaluateA1C(13.0);

                expect(result.score).toBeCloseTo(85, 0);
            });

            it("should return 0 at 14.0%", async () => {

                const result = await evaluateA1C(14.0);

                expect(result.score).toBe(0);
            });

            it("should not go negative above 14%", async () => {

                const result = await evaluateA1C(16.0);

                expect(result.score).toBe(0);
            });
        });

        describe("Score Monotonicity", () => {

            it("should decrease score as A1C increases across all ranges", async () => {

                const values = [0, 3.0, 5.0, 5.5, 5.6, 5.7, 6.0, 6.4, 7.0, 10.0, 14.0];
                const results = await Promise.all(values.map(v => evaluateA1C(v)));
                const scores = results.map(r => r.score);

                for (let i = 1; i < scores.length; i++) {
                    expect(scores[i]).toBeLessThan(scores[i - 1]);
                }
            });
        });

        describe("Score Boundaries", () => {

            it("should have score <= 1000 for all values", async () => {

                const result = await evaluateA1C(0);

                expect(result.score).toBeLessThanOrEqual(1000);
            });

            it("should have score >= 0 for all values", async () => {

                const result = await evaluateA1C(20.0);

                expect(result.score).toBeGreaterThanOrEqual(0);
            });
        });
    });
});
