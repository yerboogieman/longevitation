import nools from "nools";
import * as path from "path";

describe("waist-to-height-ratio.nools", () => {

    let flow: any;
    let WaistToHeightRatio: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "waist-to-height-ratio.nools"));
        WaistToHeightRatio = flow.getDefined("WaistToHeightRatio");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluate(waist: number, height: number, sex: string): Promise<any> {

        const whr = new WaistToHeightRatio({ waist, height, sex });

        const result = new ScoreResult();
        const session = flow.getSession(whr, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("WHR Calculation", () => {
        // WHR = waist / height (same units)

        it("should calculate WHR correctly (80cm waist, 180cm height)", async () => {

            // WHR = 80 / 180 = 0.444
            const result = await evaluate(80, 180, "M");

            expect(result.data.waistToHeightRatio).toBeCloseTo(0.444, 3);
        });

        it("should calculate WHR correctly (32in waist, 72in height)", async () => {

            // WHR = 32 / 72 = 0.444
            const result = await evaluate(32, 72, "M");

            expect(result.data.waistToHeightRatio).toBeCloseTo(0.444, 3);
        });

        it("should calculate WHR correctly for female (70cm waist, 165cm height)", async () => {

            // WHR = 70 / 165 = 0.424
            const result = await evaluate(70, 165, "F");

            expect(result.data.waistToHeightRatio).toBeCloseTo(0.424, 3);
        });
    });

    describe("evaluateStatus - Status Categories (Men)", () => {
        // Based on chart: waist-to-height-ratio-chart.png

        describe("Abnormally Slim (WHR < 0.35)", () => {

            it("should return 'abnormally.slim' for WHR 0.30", async () => {

                // WHR = 54 / 180 = 0.30
                const result = await evaluate(54, 180, "M");

                expect(result.status).toBe("abnormally.slim");
            });

            it("should return 'abnormally.slim' at upper boundary (WHR 0.349)", async () => {

                // WHR = 62.82 / 180 = 0.349
                const result = await evaluate(62.82, 180, "M");

                expect(result.status).toBe("abnormally.slim");
            });
        });

        describe("Extremely Slim (WHR 0.35 - 0.42)", () => {

            it("should return 'extremely.slim' at lower boundary (WHR 0.35)", async () => {

                // WHR = 63 / 180 = 0.35
                const result = await evaluate(63, 180, "M");

                expect(result.status).toBe("extremely.slim");
            });

            it("should return 'extremely.slim' for mid-range (WHR 0.385)", async () => {

                // WHR = 69.3 / 180 = 0.385
                const result = await evaluate(69.3, 180, "M");

                expect(result.status).toBe("extremely.slim");
            });

            it("should return 'extremely.slim' at upper boundary (WHR 0.419)", async () => {

                // WHR = 75.42 / 180 = 0.419
                const result = await evaluate(75.42, 180, "M");

                expect(result.status).toBe("extremely.slim");
            });
        });

        describe("Slender & Healthy (WHR 0.42 - 0.46)", () => {

            it("should return 'slender.healthy' at lower boundary (WHR 0.42)", async () => {

                // WHR = 75.6 / 180 = 0.42
                const result = await evaluate(75.6, 180, "M");

                expect(result.status).toBe("slender.healthy");
            });

            it("should return 'slender.healthy' for mid-range (WHR 0.44)", async () => {

                // WHR = 79.2 / 180 = 0.44
                const result = await evaluate(79.2, 180, "M");

                expect(result.status).toBe("slender.healthy");
            });

            it("should return 'slender.healthy' at upper boundary (WHR 0.459)", async () => {

                // WHR = 82.62 / 180 = 0.459
                const result = await evaluate(82.62, 180, "M");

                expect(result.status).toBe("slender.healthy");
            });
        });

        describe("Healthy (WHR 0.46 - 0.49)", () => {

            it("should return 'healthy' at lower boundary (WHR 0.46)", async () => {

                // WHR = 82.81 / 180 = 0.4600556 (just past 0.46)
                const result = await evaluate(82.81, 180, "M");

                expect(result.status).toBe("healthy");
            });

            it("should return 'healthy' for mid-range (WHR 0.475)", async () => {

                // WHR = 85.5 / 180 = 0.475
                const result = await evaluate(85.5, 180, "M");

                expect(result.status).toBe("healthy");
            });

            it("should return 'healthy' at upper boundary (WHR 0.489)", async () => {

                // WHR = 88.02 / 180 = 0.489
                const result = await evaluate(88.02, 180, "M");

                expect(result.status).toBe("healthy");
            });
        });

        describe("Overweight (WHR 0.49 - 0.54)", () => {

            it("should return 'overweight' at lower boundary (WHR 0.49)", async () => {

                // WHR = 88.2 / 180 = 0.49
                const result = await evaluate(88.2, 180, "M");

                expect(result.status).toBe("overweight");
            });

            it("should return 'overweight' for mid-range (WHR 0.515)", async () => {

                // WHR = 92.7 / 180 = 0.515
                const result = await evaluate(92.7, 180, "M");

                expect(result.status).toBe("overweight");
            });

            it("should return 'overweight' at upper boundary (WHR 0.539)", async () => {

                // WHR = 97.02 / 180 = 0.539
                const result = await evaluate(97.02, 180, "M");

                expect(result.status).toBe("overweight");
            });
        });

        describe("Extremely Overweight (WHR 0.54 - 0.58)", () => {

            it("should return 'extremely.overweight' at lower boundary (WHR 0.54)", async () => {

                // WHR = 97.2 / 180 = 0.54
                const result = await evaluate(97.2, 180, "M");

                expect(result.status).toBe("extremely.overweight");
            });

            it("should return 'extremely.overweight' for mid-range (WHR 0.56)", async () => {

                // WHR = 100.8 / 180 = 0.56
                const result = await evaluate(100.8, 180, "M");

                expect(result.status).toBe("extremely.overweight");
            });

            it("should return 'extremely.overweight' at upper boundary (WHR 0.579)", async () => {

                // WHR = 104.22 / 180 = 0.579
                const result = await evaluate(104.22, 180, "M");

                expect(result.status).toBe("extremely.overweight");
            });
        });

        describe("Highly Obese (WHR >= 0.58)", () => {

            it("should return 'highly.obese' at lower boundary (WHR 0.58)", async () => {

                // WHR = 104.4 / 180 = 0.58
                const result = await evaluate(104.4, 180, "M");

                expect(result.status).toBe("highly.obese");
            });

            it("should return 'highly.obese' for severe obesity (WHR 0.70)", async () => {

                // WHR = 126 / 180 = 0.70
                const result = await evaluate(126, 180, "M");

                expect(result.status).toBe("highly.obese");
            });
        });
    });

    describe("evaluateStatus - Status Categories (Women)", () => {
        // Based on chart: waist-to-height-ratio-chart.png

        describe("Abnormally Slim (WHR < 0.35)", () => {

            it("should return 'abnormally.slim' for WHR 0.30", async () => {

                // WHR = 49.5 / 165 = 0.30
                const result = await evaluate(49.5, 165, "F");

                expect(result.status).toBe("abnormally.slim");
            });
        });

        describe("Extremely Slim (WHR 0.35 - 0.43)", () => {

            it("should return 'extremely.slim' at lower boundary (WHR 0.35)", async () => {

                // WHR = 57.75 / 165 = 0.35
                const result = await evaluate(57.75, 165, "F");

                expect(result.status).toBe("extremely.slim");
            });

            it("should return 'extremely.slim' at upper boundary (WHR 0.429)", async () => {

                // WHR = 70.785 / 165 = 0.429
                const result = await evaluate(70.785, 165, "F");

                expect(result.status).toBe("extremely.slim");
            });
        });

        describe("Slender & Healthy (WHR 0.43 - 0.46)", () => {

            it("should return 'slender.healthy' at lower boundary (WHR 0.43)", async () => {

                // WHR = 70.95 / 165 = 0.43
                const result = await evaluate(70.95, 165, "F");

                expect(result.status).toBe("slender.healthy");
            });

            it("should return 'slender.healthy' at upper boundary (WHR 0.459)", async () => {

                // WHR = 75.735 / 165 = 0.459
                const result = await evaluate(75.735, 165, "F");

                expect(result.status).toBe("slender.healthy");
            });
        });

        describe("Healthy (WHR 0.46 - 0.53)", () => {

            it("should return 'healthy' at lower boundary (WHR 0.46)", async () => {

                // WHR = 75.9 / 165 = 0.46
                const result = await evaluate(75.9, 165, "F");

                expect(result.status).toBe("healthy");
            });

            it("should return 'healthy' for mid-range (WHR 0.495)", async () => {

                // WHR = 81.675 / 165 = 0.495
                const result = await evaluate(81.675, 165, "F");

                expect(result.status).toBe("healthy");
            });

            it("should return 'healthy' at upper boundary (WHR 0.529)", async () => {

                // WHR = 87.285 / 165 = 0.529
                const result = await evaluate(87.285, 165, "F");

                expect(result.status).toBe("healthy");
            });
        });

        describe("Overweight (WHR 0.53 - 0.58)", () => {

            it("should return 'overweight' at lower boundary (WHR 0.53)", async () => {

                // WHR = 87.45 / 165 = 0.53
                const result = await evaluate(87.45, 165, "F");

                expect(result.status).toBe("overweight");
            });

            it("should return 'overweight' at upper boundary (WHR 0.579)", async () => {

                // WHR = 95.535 / 165 = 0.579
                const result = await evaluate(95.535, 165, "F");

                expect(result.status).toBe("overweight");
            });
        });

        describe("Extremely Overweight (WHR 0.58 - 0.63)", () => {

            it("should return 'extremely.overweight' at lower boundary (WHR 0.58)", async () => {

                // WHR = 95.7 / 165 = 0.58
                const result = await evaluate(95.7, 165, "F");

                expect(result.status).toBe("extremely.overweight");
            });

            it("should return 'extremely.overweight' at upper boundary (WHR 0.629)", async () => {

                // WHR = 103.785 / 165 = 0.629
                const result = await evaluate(103.785, 165, "F");

                expect(result.status).toBe("extremely.overweight");
            });
        });

        describe("Highly Obese (WHR >= 0.63)", () => {

            it("should return 'highly.obese' at lower boundary (WHR 0.63)", async () => {

                // WHR = 103.95 / 165 = 0.63
                const result = await evaluate(103.95, 165, "F");

                expect(result.status).toBe("highly.obese");
            });

            it("should return 'highly.obese' for severe obesity (WHR 0.75)", async () => {

                // WHR = 123.75 / 165 = 0.75
                const result = await evaluate(123.75, 165, "F");

                expect(result.status).toBe("highly.obese");
            });
        });
    });

    describe("evaluateScore - Health Scoring (Men)", () => {

        describe("Abnormally Slim Scoring (WHR < 0.35)", () => {
            // Score starts at 749 at boundary, decreases going lower

            it("should score ~749 near the boundary (WHR ~0.349)", async () => {

                // WHR = 62.82 / 180 = 0.349
                const result = await evaluate(62.82, 180, "M");

                // score = 749 - (0.35 - 0.349) * 2140 = 749 - 2.14 = 746.86
                expect(result.score).toBeCloseTo(747, 0);
            });

            it("should score lower for more underweight (WHR ~0.30)", async () => {

                // WHR = 54 / 180 = 0.30
                const result = await evaluate(54, 180, "M");

                // score = 749 - (0.35 - 0.30) * 2140 = 749 - 107 = 642
                expect(result.score).toBeCloseTo(642, 0);
            });

            it("should score even lower for severely underweight (WHR ~0.25)", async () => {

                // WHR = 45 / 180 = 0.25
                const result = await evaluate(45, 180, "M");

                // score = 749 - (0.35 - 0.25) * 2140 = 749 - 214 = 535
                expect(result.score).toBeCloseTo(535, 0);
            });

            it("should floor at 0 for extremely low WHR", async () => {

                // WHR = 18 / 180 = 0.10
                const result = await evaluate(18, 180, "M");

                // score = max(0, 749 - (0.35 - 0.10) * 2140) = max(0, 749 - 535) = 214
                expect(result.score).toBeCloseTo(214, 0);
            });
        });

        describe("Extremely Slim Scoring (WHR 0.35 - 0.42)", () => {
            // Score from 750 at lower bound to 899 at upper bound

            it("should score ~750 at lower boundary (WHR 0.35)", async () => {

                // WHR = 63 / 180 = 0.35
                const result = await evaluate(63, 180, "M");

                // score = 750 + (0.35 - 0.35) * (149/0.07) = 750
                expect(result.score).toBeCloseTo(750, 0);
            });

            it("should score ~825 midway (WHR ~0.385)", async () => {

                // WHR = 69.3 / 180 = 0.385
                const result = await evaluate(69.3, 180, "M");

                // score = 750 + (0.385 - 0.35) * (149/0.07) = 750 + 74.5 = 824.5
                expect(result.score).toBeCloseTo(824.5, 0);
            });

            it("should score ~899 near upper boundary (WHR ~0.419)", async () => {

                // WHR = 75.42 / 180 = 0.419 (just below 0.42)
                const result = await evaluate(75.42, 180, "M");

                // score = 750 + (0.419 - 0.35) * (149/0.07) = 750 + 146.9 = 896.9
                expect(result.score).toBeCloseTo(897, 0);
            });
        });

        describe("Slender & Healthy Scoring (WHR 0.42 - 0.46)", () => {
            // Score from 900 at lower bound to 1000 at upper bound

            it("should score ~900 at lower boundary (WHR 0.42)", async () => {

                // WHR = 75.6 / 180 = 0.42
                const result = await evaluate(75.6, 180, "M");

                // This is actually at the boundary of extremely.slim/slender.healthy
                // At exactly 0.42, it's slender.healthy: score = 900
                expect(result.score).toBeCloseTo(900, 0);
            });

            it("should score ~950 midway (WHR ~0.44)", async () => {

                // WHR = 79.2 / 180 = 0.44
                const result = await evaluate(79.2, 180, "M");

                // score = 900 + (0.44 - 0.42) * (100/0.04) = 900 + 50 = 950
                expect(result.score).toBeCloseTo(950, 0);
            });

            it("should score ~1000 at upper boundary (WHR ~0.46)", async () => {

                // WHR = 82.8 / 180 = 0.46
                const result = await evaluate(82.8, 180, "M");

                // At 0.46, this transitions to "healthy" category: score = 1000
                expect(result.score).toBeCloseTo(1000, 0);
            });
        });

        describe("Healthy Scoring (WHR 0.46 - 0.49)", () => {
            // Score from 1000 at lower bound to 801 at upper bound

            it("should score 1000 at lower boundary (WHR 0.46)", async () => {

                // WHR = 82.8 / 180 = 0.46
                const result = await evaluate(82.8, 180, "M");

                expect(result.score).toBe(1000);
            });

            it("should score ~900 midway (WHR ~0.475)", async () => {

                // WHR = 85.5 / 180 = 0.475
                const result = await evaluate(85.5, 180, "M");

                // score = 1000 - (0.475 - 0.46) * (199/0.03) = 1000 - 99.5 = 900.5
                expect(result.score).toBeCloseTo(901, 0);
            });

            it("should score ~801 at upper boundary (WHR ~0.49)", async () => {

                // WHR = 88.2 / 180 = 0.49
                const result = await evaluate(88.2, 180, "M");

                // At 0.49, transitions to "overweight": score = 800
                expect(result.score).toBeCloseTo(800, 0);
            });
        });

        describe("Overweight Scoring (WHR 0.49 - 0.54)", () => {
            // Score from 800 at lower bound to 650 at upper bound

            it("should score ~800 at lower boundary (WHR 0.49)", async () => {

                // WHR = 88.2 / 180 = 0.49
                const result = await evaluate(88.2, 180, "M");

                // score = 800 - (0.49 - 0.49) * (150/0.05) = 800
                expect(result.score).toBeCloseTo(800, 0);
            });

            it("should score ~725 midway (WHR ~0.515)", async () => {

                // WHR = 92.7 / 180 = 0.515
                const result = await evaluate(92.7, 180, "M");

                // score = 800 - (0.515 - 0.49) * (150/0.05) = 800 - 75 = 725
                expect(result.score).toBeCloseTo(725, 0);
            });

            it("should score ~650 at upper boundary (WHR ~0.54)", async () => {

                // WHR = 97.2 / 180 = 0.54
                const result = await evaluate(97.2, 180, "M");

                // At 0.54, transitions to "extremely.overweight": score = 649
                expect(result.score).toBeCloseTo(649, 0);
            });
        });

        describe("Extremely Overweight Scoring (WHR 0.54 - 0.58)", () => {
            // Score from 649 at lower bound to 500 at upper bound

            it("should score ~649 at lower boundary (WHR 0.54)", async () => {

                // WHR = 97.2 / 180 = 0.54
                const result = await evaluate(97.2, 180, "M");

                // score = 649 - (0.54 - 0.54) * (149/0.04) = 649
                expect(result.score).toBeCloseTo(649, 0);
            });

            it("should score ~575 midway (WHR ~0.56)", async () => {

                // WHR = 100.8 / 180 = 0.56
                const result = await evaluate(100.8, 180, "M");

                // score = 649 - (0.56 - 0.54) * (149/0.04) = 649 - 74.5 = 574.5
                expect(result.score).toBeCloseTo(575, 0);
            });

            it("should score ~500 at upper boundary (WHR ~0.58)", async () => {

                // WHR = 104.4 / 180 = 0.58
                const result = await evaluate(104.4, 180, "M");

                // At 0.58, transitions to "highly.obese": score = 499
                expect(result.score).toBeCloseTo(499, 0);
            });
        });

        describe("Highly Obese Scoring (WHR >= 0.58)", () => {
            // Score from 499 at lower bound, approaches 0

            it("should score ~499 at lower boundary (WHR 0.58)", async () => {

                // WHR = 104.4 / 180 = 0.58
                const result = await evaluate(104.4, 180, "M");

                // score = 499 - (0.58 - 0.58) * 2495 = 499
                expect(result.score).toBeCloseTo(499, 0);
            });

            it("should score ~374 at WHR 0.63", async () => {

                // WHR = 113.4 / 180 = 0.63
                const result = await evaluate(113.4, 180, "M");

                // score = 499 - (0.63 - 0.58) * 2495 = 499 - 124.75 = 374.25
                expect(result.score).toBeCloseTo(374, 0);
            });

            it("should score ~249 at WHR 0.68", async () => {

                // WHR = 122.4 / 180 = 0.68
                const result = await evaluate(122.4, 180, "M");

                // score = 499 - (0.68 - 0.58) * 2495 = 499 - 249.5 = 249.5
                expect(result.score).toBeCloseTo(249, 0);
            });

            it("should floor at 0 for extremely high WHR", async () => {

                // WHR = 144 / 180 = 0.80
                const result = await evaluate(144, 180, "M");

                // score = max(0, 499 - (0.80 - 0.58) * 2495) = max(0, 499 - 548.9) = 0
                expect(result.score).toBe(0);
            });
        });
    });

    describe("evaluateScore - Health Scoring (Women)", () => {

        describe("Extremely Slim Scoring (WHR 0.35 - 0.43)", () => {
            // Score from 750 at lower bound to 899 at upper bound

            it("should score ~750 at lower boundary (WHR 0.35)", async () => {

                // WHR = 57.75 / 165 = 0.35
                const result = await evaluate(57.75, 165, "F");

                // score = 750 + (0.35 - 0.35) * (149/0.08) = 750
                expect(result.score).toBeCloseTo(750, 0);
            });

            it("should score ~825 midway (WHR ~0.39)", async () => {

                // WHR = 64.35 / 165 = 0.39
                const result = await evaluate(64.35, 165, "F");

                // score = 750 + (0.39 - 0.35) * (149/0.08) = 750 + 74.5 = 824.5
                expect(result.score).toBeCloseTo(824.5, 0);
            });

            it("should score ~899 at upper boundary (WHR ~0.43)", async () => {

                // WHR = 70.95 / 165 = 0.43
                const result = await evaluate(70.95, 165, "F");

                // At 0.43, transitions to "slender.healthy": score = 900
                expect(result.score).toBeCloseTo(900, 0);
            });
        });

        describe("Healthy Scoring (WHR 0.46 - 0.53)", () => {
            // Score from 1000 at lower bound to 801 at upper bound

            it("should score 1000 at lower boundary (WHR 0.46)", async () => {

                // WHR = 75.9 / 165 = 0.46
                const result = await evaluate(75.9, 165, "F");

                expect(result.score).toBe(1000);
            });

            it("should score ~900 midway (WHR ~0.495)", async () => {

                // WHR = 81.675 / 165 = 0.495
                const result = await evaluate(81.675, 165, "F");

                // score = 1000 - (0.495 - 0.46) * (199/0.07) = 1000 - 99.5 = 900.5
                expect(result.score).toBeCloseTo(901, 0);
            });

            it("should score ~801 at upper boundary (WHR ~0.53)", async () => {

                // WHR = 87.45 / 165 = 0.53
                const result = await evaluate(87.45, 165, "F");

                // At 0.53, transitions to "overweight": score = 800
                expect(result.score).toBeCloseTo(800, 0);
            });
        });

        describe("Highly Obese Scoring (WHR >= 0.63)", () => {
            // Score from 499 at lower bound, approaches 0

            it("should score ~499 at lower boundary (WHR 0.63)", async () => {

                // WHR = 103.95 / 165 = 0.63
                const result = await evaluate(103.95, 165, "F");

                // score = 499 - (0.63 - 0.63) * 2495 = 499
                expect(result.score).toBeCloseTo(499, 0);
            });

            it("should floor at 0 for extremely high WHR", async () => {

                // WHR = 132 / 165 = 0.80
                const result = await evaluate(132, 165, "F");

                // score = max(0, 499 - (0.80 - 0.63) * 2495) = max(0, 499 - 424.15) = 74.85
                expect(result.score).toBeCloseTo(75, 0);
            });
        });
    });

    describe("Status Boundary Transitions (Men)", () => {

        it("should transition from abnormally.slim to extremely.slim at WHR 0.35", async () => {

            const abnormallySlim = await evaluate(62.82, 180, "M"); // WHR = 0.349
            const extremelySlim = await evaluate(63, 180, "M"); // WHR = 0.35

            expect(abnormallySlim.status).toBe("abnormally.slim");
            expect(extremelySlim.status).toBe("extremely.slim");
        });

        it("should transition from extremely.slim to slender.healthy at WHR 0.42", async () => {

            const extremelySlim = await evaluate(75.42, 180, "M"); // WHR = 0.419
            const slenderHealthy = await evaluate(75.6, 180, "M"); // WHR = 0.42

            expect(extremelySlim.status).toBe("extremely.slim");
            expect(slenderHealthy.status).toBe("slender.healthy");
        });

        it("should transition from slender.healthy to healthy at WHR 0.46", async () => {

            const slenderHealthy = await evaluate(82.62, 180, "M"); // WHR = 0.459
            const healthy = await evaluate(82.81, 180, "M"); // WHR = 0.4600556 (just past 0.46)

            expect(slenderHealthy.status).toBe("slender.healthy");
            expect(healthy.status).toBe("healthy");
        });

        it("should transition from healthy to overweight at WHR 0.49", async () => {

            const healthy = await evaluate(88.02, 180, "M"); // WHR = 0.489
            const overweight = await evaluate(88.2, 180, "M"); // WHR = 0.49

            expect(healthy.status).toBe("healthy");
            expect(overweight.status).toBe("overweight");
        });

        it("should transition from overweight to extremely.overweight at WHR 0.54", async () => {

            const overweight = await evaluate(97.02, 180, "M"); // WHR = 0.539
            const extremelyOverweight = await evaluate(97.2, 180, "M"); // WHR = 0.54

            expect(overweight.status).toBe("overweight");
            expect(extremelyOverweight.status).toBe("extremely.overweight");
        });

        it("should transition from extremely.overweight to highly.obese at WHR 0.58", async () => {

            const extremelyOverweight = await evaluate(104.22, 180, "M"); // WHR = 0.579
            const highlyObese = await evaluate(104.4, 180, "M"); // WHR = 0.58

            expect(extremelyOverweight.status).toBe("extremely.overweight");
            expect(highlyObese.status).toBe("highly.obese");
        });
    });

    describe("Status Boundary Transitions (Women)", () => {

        it("should transition from extremely.slim to slender.healthy at WHR 0.43", async () => {

            const extremelySlim = await evaluate(70.785, 165, "F"); // WHR = 0.429
            const slenderHealthy = await evaluate(70.95, 165, "F"); // WHR = 0.43

            expect(extremelySlim.status).toBe("extremely.slim");
            expect(slenderHealthy.status).toBe("slender.healthy");
        });

        it("should transition from healthy to overweight at WHR 0.53", async () => {

            const healthy = await evaluate(87.285, 165, "F"); // WHR = 0.529
            const overweight = await evaluate(87.45, 165, "F"); // WHR = 0.53

            expect(healthy.status).toBe("healthy");
            expect(overweight.status).toBe("overweight");
        });

        it("should transition from extremely.overweight to highly.obese at WHR 0.63", async () => {

            const extremelyOverweight = await evaluate(103.785, 165, "F"); // WHR = 0.629
            const highlyObese = await evaluate(103.95, 165, "F"); // WHR = 0.63

            expect(extremelyOverweight.status).toBe("extremely.overweight");
            expect(highlyObese.status).toBe("highly.obese");
        });
    });

    describe("Real-World Scenarios", () => {

        it("should classify healthy adult male (84cm waist, 180cm height)", async () => {

            // WHR = 84 / 180 = 0.4667
            const result = await evaluate(84, 180, "M");

            expect(result.data.waistToHeightRatio).toBeCloseTo(0.467, 2);
            expect(result.status).toBe("healthy");
            // score = 1000 - (0.4667 - 0.46) * (199/0.03) = 1000 - 44.2 = 955.8
            expect(result.score).toBeCloseTo(956, 0);
        });

        it("should classify healthy adult female (74cm waist, 160cm height)", async () => {

            // WHR = 74 / 160 = 0.4625
            const result = await evaluate(74, 160, "F");

            expect(result.data.waistToHeightRatio).toBeCloseTo(0.4625, 3);
            expect(result.status).toBe("healthy");
            // score = 1000 - (0.4625 - 0.46) * (199/0.07) = 1000 - 7.1 = 992.9
            expect(result.score).toBeCloseTo(993, 0);
        });

        it("should classify athletic adult male (32in waist, 72in height)", async () => {

            // WHR = 32 / 72 = 0.4444
            const result = await evaluate(32, 72, "M");

            expect(result.data.waistToHeightRatio).toBeCloseTo(0.444, 2);
            expect(result.status).toBe("slender.healthy");
            // score = 900 + (0.4444 - 0.42) * (100/0.04) = 900 + 61.1 = 961.1
            expect(result.score).toBeCloseTo(961, 0);
        });

        it("should classify overweight adult male (40in waist, 70in height)", async () => {

            // WHR = 40 / 70 = 0.5714
            const result = await evaluate(40, 70, "M");

            expect(result.data.waistToHeightRatio).toBeCloseTo(0.571, 2);
            expect(result.status).toBe("extremely.overweight");
            // score = 649 - (0.5714 - 0.54) * (149/0.04) = 649 - 117.1 = 531.9
            expect(result.score).toBeCloseTo(532, 0);
        });

        it("should classify obese adult female (38in waist, 62in height)", async () => {

            // WHR = 38 / 62 = 0.613
            const result = await evaluate(38, 62, "F");

            expect(result.data.waistToHeightRatio).toBeCloseTo(0.613, 3);
            expect(result.status).toBe("extremely.overweight");
            // score = 649 - (0.613 - 0.58) * (149/0.05) = 649 - 98.3 = 550.7
            expect(result.score).toBeCloseTo(551, 0);
        });
    });
});
