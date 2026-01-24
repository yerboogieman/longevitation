import nools from "nools";
import * as path from "path";

describe("homa-ir.nools", () => {

    let flow: any;
    let HomaIR: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "homa-ir.nools"));
        HomaIR = flow.getDefined("HomaIR");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluateHomaIR(score: number): Promise<any> {

        const homaIR = new HomaIR({ score });

        const result = new ScoreResult();
        const session = flow.getSession(homaIR, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("HOMA-IR Status Categories", () => {

        // HOMA-IR < 1.0: Optimal insulin sensitivity
        describe("Ideal (< 1.0)", () => {

            it("should classify as ideal at 0", async () => {

                const result = await evaluateHomaIR(0);

                expect(result.status).toBe("ideal");
            });

            it("should classify as ideal at 0.5", async () => {

                const result = await evaluateHomaIR(0.5);

                expect(result.status).toBe("ideal");
            });

            it("should classify as ideal at 0.8", async () => {

                const result = await evaluateHomaIR(0.8);

                expect(result.status).toBe("ideal");
            });

            it("should classify as ideal at 0.99", async () => {

                const result = await evaluateHomaIR(0.99);

                expect(result.status).toBe("ideal");
            });
        });

        // HOMA-IR 1.0 - 1.9: Possible early or mild insulin resistance
        describe("Possible Early/Mild Insulin Resistance (1.0 - 1.9)", () => {

            it("should classify as possible early/mild at lower boundary (1.0)", async () => {

                const result = await evaluateHomaIR(1.0);

                expect(result.status).toBe("possible.early.or.mild.insulin.resistance");
            });

            it("should classify as possible early/mild at 1.5", async () => {

                const result = await evaluateHomaIR(1.5);

                expect(result.status).toBe("possible.early.or.mild.insulin.resistance");
            });

            it("should classify as possible early/mild at upper boundary (1.9)", async () => {

                const result = await evaluateHomaIR(1.9);

                expect(result.status).toBe("possible.early.or.mild.insulin.resistance");
            });
        });

        // HOMA-IR 2.0 - 2.9: Likely moderate insulin resistance
        describe("Likely Moderate Insulin Resistance (2.0 - 2.9)", () => {

            it("should classify as likely moderate at lower boundary (2.0)", async () => {

                const result = await evaluateHomaIR(2.0);

                expect(result.status).toBe("likely.moderate.insulin.resistance");
            });

            it("should classify as likely moderate at 2.5", async () => {

                const result = await evaluateHomaIR(2.5);

                expect(result.status).toBe("likely.moderate.insulin.resistance");
            });

            it("should classify as likely moderate at upper boundary (2.9)", async () => {

                const result = await evaluateHomaIR(2.9);

                expect(result.status).toBe("likely.moderate.insulin.resistance");
            });
        });

        // HOMA-IR >= 3.0: Likely significant insulin resistance
        describe("Likely Significant Insulin Resistance (>= 3.0)", () => {

            it("should classify as likely significant at 3.0", async () => {

                const result = await evaluateHomaIR(3.0);

                expect(result.status).toBe("likely.significant.insulin.resistance");
            });

            it("should classify as likely significant at 4.0", async () => {

                const result = await evaluateHomaIR(4.0);

                expect(result.status).toBe("likely.significant.insulin.resistance");
            });

            it("should classify as likely significant at 5.0", async () => {

                const result = await evaluateHomaIR(5.0);

                expect(result.status).toBe("likely.significant.insulin.resistance");
            });

            it("should classify as likely significant at 10.0", async () => {

                const result = await evaluateHomaIR(10.0);

                expect(result.status).toBe("likely.significant.insulin.resistance");
            });
        });
    });

    describe("HOMA-IR Score Calculations", () => {

        // Score range: 1000 (at 0) to 850 (approaching 1.0)
        // Formula: score = 1000 - (homaIR * 150)
        describe("Ideal Range Scores (< 1.0)", () => {

            it("should return score of 1000 at HOMA-IR 0", async () => {

                const result = await evaluateHomaIR(0);

                expect(result.score).toBe(1000);
            });

            it("should return score of 925 at HOMA-IR 0.5", async () => {

                const result = await evaluateHomaIR(0.5);

                expect(result.score).toBe(925);
            });

            it("should return score of 852 at HOMA-IR 0.99 (approaching boundary)", async () => {

                const result = await evaluateHomaIR(0.99);

                // 1000 - (0.99 * 150) = 851.5, rounded to 852
                expect(result.score).toBe(852);
            });
        });

        // Score range: 849 (at 1.0) to 750 (at 1.9)
        // Formula: score = 849 - ((homaIR - 1.0) / 0.9) * 99
        describe("Possible Early/Mild Range Scores (1.0 - 1.9)", () => {

            it("should return score of 849 at HOMA-IR 1.0", async () => {

                const result = await evaluateHomaIR(1.0);

                expect(result.score).toBe(849);
            });

            it("should return score of 794 at HOMA-IR 1.5", async () => {

                const result = await evaluateHomaIR(1.5);

                // 849 - ((1.5 - 1.0) / 0.9) * 99 = 849 - 55 = 794
                expect(result.score).toBe(794);
            });

            it("should return score of 750 at HOMA-IR 1.9", async () => {

                const result = await evaluateHomaIR(1.9);

                expect(result.score).toBe(750);
            });
        });

        // Score range: 749 (at 2.0) to 650 (at 2.9)
        // Formula: score = 749 - ((homaIR - 2.0) / 0.9) * 99
        describe("Likely Moderate Range Scores (2.0 - 2.9)", () => {

            it("should return score of 749 at HOMA-IR 2.0", async () => {

                const result = await evaluateHomaIR(2.0);

                expect(result.score).toBe(749);
            });

            it("should return score of 694 at HOMA-IR 2.5", async () => {

                const result = await evaluateHomaIR(2.5);

                // 749 - ((2.5 - 2.0) / 0.9) * 99 = 749 - 55 = 694
                expect(result.score).toBe(694);
            });

            it("should return score of 650 at HOMA-IR 2.9", async () => {

                const result = await evaluateHomaIR(2.9);

                expect(result.score).toBe(650);
            });
        });

        // Score range: 649 (at 3.0) decreasing by 100 per 1.0 increase, minimum 0
        // Formula: score = max(0, 649 - (homaIR - 3.0) * 100)
        describe("Likely Significant Range Scores (>= 3.0)", () => {

            it("should return score of 649 at HOMA-IR 3.0", async () => {

                const result = await evaluateHomaIR(3.0);

                expect(result.score).toBe(649);
            });

            it("should return score of 549 at HOMA-IR 4.0", async () => {

                const result = await evaluateHomaIR(4.0);

                // 649 - (4.0 - 3.0) * 100 = 549
                expect(result.score).toBe(549);
            });

            it("should return score of 449 at HOMA-IR 5.0", async () => {

                const result = await evaluateHomaIR(5.0);

                // 649 - (5.0 - 3.0) * 100 = 449
                expect(result.score).toBe(449);
            });

            it("should return score of 0 at HOMA-IR 10.0 (floor)", async () => {

                const result = await evaluateHomaIR(10.0);

                // 649 - (10.0 - 3.0) * 100 = -51, floored to 0
                expect(result.score).toBe(0);
            });

            it("should return score of 0 at HOMA-IR 15.0 (floor)", async () => {

                const result = await evaluateHomaIR(15.0);

                // 649 - (15.0 - 3.0) * 100 = -551, floored to 0
                expect(result.score).toBe(0);
            });
        });
    });

    describe("Boundary Transitions", () => {

        it("should transition from ideal to possible early/mild at 0.99/1.0 boundary", async () => {

            const at099 = await evaluateHomaIR(0.99);
            const at10 = await evaluateHomaIR(1.0);

            expect(at099.status).toBe("ideal");
            expect(at10.status).toBe("possible.early.or.mild.insulin.resistance");
        });

        it("should transition from possible early/mild to likely moderate at 1.9/2.0 boundary", async () => {

            const at19 = await evaluateHomaIR(1.9);
            const at20 = await evaluateHomaIR(2.0);

            expect(at19.status).toBe("possible.early.or.mild.insulin.resistance");
            expect(at20.status).toBe("likely.moderate.insulin.resistance");
        });

        it("should transition from likely moderate to likely significant at 2.9/3.0 boundary", async () => {

            const at29 = await evaluateHomaIR(2.9);
            const at30 = await evaluateHomaIR(3.0);

            expect(at29.status).toBe("likely.moderate.insulin.resistance");
            expect(at30.status).toBe("likely.significant.insulin.resistance");
        });

        it("should show score transition at ideal/early boundary", async () => {

            const at099 = await evaluateHomaIR(0.99);
            const at10 = await evaluateHomaIR(1.0);

            // Scores should be close but in different ranges
            expect(at099.score).toBe(852); // 1000 - 0.99 * 150 = 851.5 rounded
            expect(at10.score).toBe(849);
        });

        it("should show score transition at early/moderate boundary", async () => {

            const at19 = await evaluateHomaIR(1.9);
            const at20 = await evaluateHomaIR(2.0);

            expect(at19.score).toBe(750);
            expect(at20.score).toBe(749);
        });

        it("should show score transition at moderate/significant boundary", async () => {

            const at29 = await evaluateHomaIR(2.9);
            const at30 = await evaluateHomaIR(3.0);

            expect(at29.score).toBe(650);
            expect(at30.score).toBe(649);
        });
    });

    describe("Edge Cases", () => {

        it("should handle HOMA-IR of exactly 0", async () => {

            const result = await evaluateHomaIR(0);

            expect(result.status).toBe("ideal");
            expect(result.score).toBe(1000);
        });

        it("should handle very high HOMA-IR (20.0)", async () => {

            const result = await evaluateHomaIR(20.0);

            expect(result.status).toBe("likely.significant.insulin.resistance");
            expect(result.score).toBe(0);
        });

        it("should handle decimal precision at 1.95 (between 1.9 and 2.0)", async () => {

            const result = await evaluateHomaIR(1.95);

            // 1.95 falls in the 1.0-2.0 range (possible early/mild)
            expect(result.status).toBe("possible.early.or.mild.insulin.resistance");
            // 849 - ((1.95 - 1.0) / 0.9) * 99 = 849 - 104.5 = 744.5 rounded to 745
            expect(result.score).toBe(745);
        });

        it("should handle decimal precision at 2.95 (between 2.9 and 3.0)", async () => {

            const result = await evaluateHomaIR(2.95);

            // 2.95 falls in the 2.0-3.0 range (likely moderate)
            expect(result.status).toBe("likely.moderate.insulin.resistance");
            // 749 - ((2.95 - 2.0) / 0.9) * 99 = 749 - 104.5 = 644.5 rounded to 645
            expect(result.score).toBe(645);
        });
    });

    describe("Typical Real-World Scenarios", () => {

        // Per homa-ir.md: A HOMA-IR score above 2.5 typically indicates insulin resistance
        it("should classify healthy individual (0.7)", async () => {

            const result = await evaluateHomaIR(0.7);

            expect(result.status).toBe("ideal");
            expect(result.score).toBe(895); // 1000 - 0.7 * 150 = 895
        });

        it("should classify borderline individual (1.2)", async () => {

            const result = await evaluateHomaIR(1.2);

            expect(result.status).toBe("possible.early.or.mild.insulin.resistance");
            // 849 - ((1.2 - 1.0) / 0.9) * 99 = 849 - 22 = 827
            expect(result.score).toBe(827);
        });

        it("should classify at typical insulin resistance threshold (2.5)", async () => {

            const result = await evaluateHomaIR(2.5);

            expect(result.status).toBe("likely.moderate.insulin.resistance");
            expect(result.score).toBe(694);
        });

        it("should classify moderate insulin resistance (2.8)", async () => {

            const result = await evaluateHomaIR(2.8);

            expect(result.status).toBe("likely.moderate.insulin.resistance");
            // 749 - ((2.8 - 2.0) / 0.9) * 99 = 749 - 88 = 661
            expect(result.score).toBe(661);
        });

        it("should classify significant insulin resistance (3.5)", async () => {

            const result = await evaluateHomaIR(3.5);

            expect(result.status).toBe("likely.significant.insulin.resistance");
            // 649 - (3.5 - 3.0) * 100 = 599
            expect(result.score).toBe(599);
        });

        it("should classify severe insulin resistance (6.0)", async () => {

            const result = await evaluateHomaIR(6.0);

            expect(result.status).toBe("likely.significant.insulin.resistance");
            // 649 - (6.0 - 3.0) * 100 = 349
            expect(result.score).toBe(349);
        });
    });
});
