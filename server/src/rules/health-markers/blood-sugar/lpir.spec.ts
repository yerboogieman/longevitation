import nools from "nools";
import * as path from "path";

describe("lpir.nools", () => {

    let flow: any;
    let LPIR: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "lpir.nools"));
        LPIR = flow.getDefined("LPIR");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluateLPIR(score: number): Promise<any> {

        const lpir = new LPIR({ score });

        const result = new ScoreResult();
        const session = flow.getSession(lpir, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("LP-IR Status Categories", () => {

        // LP-IR 0-45: Low risk
        describe("Low Risk (0-45)", () => {

            it("should classify as low risk at 0", async () => {

                const result = await evaluateLPIR(0);

                expect(result.status).toBe("low.risk");
            });

            it("should classify as low risk at 20", async () => {

                const result = await evaluateLPIR(20);

                expect(result.status).toBe("low.risk");
            });

            it("should classify as low risk at 45", async () => {

                const result = await evaluateLPIR(45);

                expect(result.status).toBe("low.risk");
            });
        });

        // LP-IR 46-64: Moderate risk
        describe("Moderate Risk (46-64)", () => {

            it("should classify as moderate risk at 46", async () => {

                const result = await evaluateLPIR(46);

                expect(result.status).toBe("moderate.risk");
            });

            it("should classify as moderate risk at 55", async () => {

                const result = await evaluateLPIR(55);

                expect(result.status).toBe("moderate.risk");
            });

            it("should classify as moderate risk at 64", async () => {

                const result = await evaluateLPIR(64);

                expect(result.status).toBe("moderate.risk");
            });
        });

        // LP-IR 65-100: High risk
        describe("High Risk (65-100)", () => {

            it("should classify as high risk at 65", async () => {

                const result = await evaluateLPIR(65);

                expect(result.status).toBe("high.risk");
            });

            it("should classify as high risk at 80", async () => {

                const result = await evaluateLPIR(80);

                expect(result.status).toBe("high.risk");
            });

            it("should classify as high risk at 100", async () => {

                const result = await evaluateLPIR(100);

                expect(result.status).toBe("high.risk");
            });
        });
    });

    describe("LP-IR Score Calculations", () => {

        // Low risk range (0-45): score from 1000 to 640
        // Formula: score = 1000 - (lpir * 8)
        describe("Low Risk Range Scores (0-45)", () => {

            it("should return score of 1000 at LP-IR 0", async () => {

                const result = await evaluateLPIR(0);

                expect(result.score).toBe(1000);
            });

            it("should return score of 840 at LP-IR 20", async () => {

                const result = await evaluateLPIR(20);

                // 1000 - (20 * 8) = 840
                expect(result.score).toBe(840);
            });

            it("should return score of 640 at LP-IR 45", async () => {

                const result = await evaluateLPIR(45);

                // 1000 - (45 * 8) = 640
                expect(result.score).toBe(640);
            });
        });

        // Moderate risk range (46-64): score from 639 to 350
        // Formula: score = 639 - ((lpir - 46) / 18 * 289)
        describe("Moderate Risk Range Scores (46-64)", () => {

            it("should return score of 639 at LP-IR 46", async () => {

                const result = await evaluateLPIR(46);

                expect(result.score).toBe(639);
            });

            it("should return score of 495 at LP-IR 55", async () => {

                const result = await evaluateLPIR(55);

                // 639 - ((55 - 46) / 18 * 289) = 639 - (9/18 * 289) = 639 - 144.5 = 494.5 -> 495
                expect(result.score).toBe(495);
            });

            it("should return score of 350 at LP-IR 64", async () => {

                const result = await evaluateLPIR(64);

                // 639 - ((64 - 46) / 18 * 289) = 639 - 289 = 350
                expect(result.score).toBe(350);
            });
        });

        // High risk range (65-100): score from 349 to 0
        // Formula: score = 349 - ((lpir - 65) / 35 * 349)
        describe("High Risk Range Scores (65-100)", () => {

            it("should return score of 349 at LP-IR 65", async () => {

                const result = await evaluateLPIR(65);

                expect(result.score).toBe(349);
            });

            it("should return score of 199 at LP-IR 80", async () => {

                const result = await evaluateLPIR(80);

                // 349 - ((80 - 65) / 35 * 349) = 349 - (15/35 * 349) = 349 - 149.57 = 199.43 -> 199
                expect(result.score).toBe(199);
            });

            it("should return score of 0 at LP-IR 100", async () => {

                const result = await evaluateLPIR(100);

                // 349 - ((100 - 65) / 35 * 349) = 349 - 349 = 0
                expect(result.score).toBe(0);
            });
        });
    });

    describe("Boundary Transitions", () => {

        it("should transition from low risk to moderate risk at 45/46 boundary", async () => {

            const at45 = await evaluateLPIR(45);
            const at46 = await evaluateLPIR(46);

            expect(at45.status).toBe("low.risk");
            expect(at46.status).toBe("moderate.risk");
        });

        it("should transition from moderate risk to high risk at 64/65 boundary", async () => {

            const at64 = await evaluateLPIR(64);
            const at65 = await evaluateLPIR(65);

            expect(at64.status).toBe("moderate.risk");
            expect(at65.status).toBe("high.risk");
        });

        it("should show score transition at low/moderate boundary", async () => {

            const at45 = await evaluateLPIR(45);
            const at46 = await evaluateLPIR(46);

            expect(at45.score).toBe(640);
            expect(at46.score).toBe(639);
        });

        it("should show score transition at moderate/high boundary", async () => {

            const at64 = await evaluateLPIR(64);
            const at65 = await evaluateLPIR(65);

            expect(at64.score).toBe(350);
            expect(at65.score).toBe(349);
        });
    });

    describe("Edge Cases", () => {

        it("should handle LP-IR of exactly 0", async () => {

            const result = await evaluateLPIR(0);

            expect(result.status).toBe("low.risk");
            expect(result.score).toBe(1000);
        });

        it("should handle LP-IR of exactly 100", async () => {

            const result = await evaluateLPIR(100);

            expect(result.status).toBe("high.risk");
            expect(result.score).toBe(0);
        });

        it("should handle LP-IR above 100", async () => {

            const result = await evaluateLPIR(110);

            expect(result.status).toBe("high.risk");
            expect(result.score).toBe(0);
        });
    });

    describe("Typical Real-World Scenarios", () => {

        it("should classify healthy individual (LP-IR 25)", async () => {

            const result = await evaluateLPIR(25);

            expect(result.status).toBe("low.risk");
            expect(result.score).toBe(800); // 1000 - (25 * 8) = 800
        });

        it("should classify borderline individual (LP-IR 50)", async () => {

            const result = await evaluateLPIR(50);

            expect(result.status).toBe("moderate.risk");
            // 639 - ((50 - 46) / 18 * 289) = 639 - (4/18 * 289) = 639 - 64.22 = 574.78 -> 575
            expect(result.score).toBe(575);
        });

        it("should classify high insulin resistance (LP-IR 75)", async () => {

            const result = await evaluateLPIR(75);

            expect(result.status).toBe("high.risk");
            // 349 - ((75 - 65) / 35 * 349) = 349 - (10/35 * 349) = 349 - 99.71 = 249.29 -> 249
            expect(result.score).toBe(249);
        });

        it("should classify severe insulin resistance (LP-IR 90)", async () => {

            const result = await evaluateLPIR(90);

            expect(result.status).toBe("high.risk");
            // 349 - ((90 - 65) / 35 * 349) = 349 - (25/35 * 349) = 349 - 249.29 = 99.71 -> 100
            expect(result.score).toBe(100);
        });
    });
});
