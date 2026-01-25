import nools from "nools";
import * as path from "path";

describe("bmi.nools", () => {

    let flow: any;
    let BMI: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "bmi.nools"));
        BMI = flow.getDefined("BMI");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluate(heightInMetersOrInches: number, weightInKgOrLbs: number, isMetric: boolean): Promise<any> {

        const bmi = new BMI({ heightInMetersOrInches, weightInKgOrLbs, isMetric });

        const result = new ScoreResult();
        const session = flow.getSession(bmi, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("evaluateBMI - BMI Calculation", () => {

        describe("Metric (kg/m)", () => {
            // Formula: BMI = weight (kg) / (height (m))²

            it("should calculate BMI correctly (70kg, 1.75m)", async () => {

                // BMI = 70 / (1.75)² = 70 / 3.0625 = 22.86
                const result = await evaluate(1.75, 70, true);

                expect(result.data.bmi).toBeCloseTo(22.86, 1);
            });

            it("should calculate BMI correctly for underweight (50kg, 1.70m)", async () => {

                // BMI = 50 / (1.70)² = 50 / 2.89 = 17.30
                const result = await evaluate(1.70, 50, true);

                expect(result.data.bmi).toBeCloseTo(17.30, 1);
            });

            it("should calculate BMI correctly for overweight (80kg, 1.70m)", async () => {

                // BMI = 80 / (1.70)² = 80 / 2.89 = 27.68
                const result = await evaluate(1.70, 80, true);

                expect(result.data.bmi).toBeCloseTo(27.68, 1);
            });

            it("should calculate BMI correctly for obese (100kg, 1.70m)", async () => {

                // BMI = 100 / (1.70)² = 100 / 2.89 = 34.60
                const result = await evaluate(1.70, 100, true);

                expect(result.data.bmi).toBeCloseTo(34.60, 1);
            });
        });

        describe("Imperial (lbs/inches)", () => {
            // Formula: BMI = (weight (lb) × 703) / (height (in))²

            it("should calculate BMI correctly (154lbs, 69in)", async () => {

                // BMI = (154 * 703) / (69)² = 108262 / 4761 = 22.74
                const result = await evaluate(69, 154, false);

                expect(result.data.bmi).toBeCloseTo(22.74, 1);
            });

            it("should calculate BMI correctly for underweight (110lbs, 67in)", async () => {

                // BMI = (110 * 703) / (67)² = 77330 / 4489 = 17.23
                const result = await evaluate(67, 110, false);

                expect(result.data.bmi).toBeCloseTo(17.23, 1);
            });

            it("should calculate BMI correctly for overweight (190lbs, 68in)", async () => {

                // BMI = (190 * 703) / (68)² = 133570 / 4624 = 28.89
                const result = await evaluate(68, 190, false);

                expect(result.data.bmi).toBeCloseTo(28.89, 1);
            });

            it("should calculate BMI correctly for obese (230lbs, 68in)", async () => {

                // BMI = (230 * 703) / (68)² = 161690 / 4624 = 34.97
                const result = await evaluate(68, 230, false);

                expect(result.data.bmi).toBeCloseTo(34.97, 1);
            });
        });
    });

    describe("evaluateStatus - Status Categories", () => {

        describe("Underweight (BMI < 18.5)", () => {

            it("should return 'underweight' for BMI 17.30", async () => {

                const result = await evaluate(1.70, 50, true); // BMI ≈ 17.30

                expect(result.status).toBe("underweight");
            });

            it("should return 'underweight' at upper boundary (BMI 18.29)", async () => {

                const result = await evaluate(1.75, 56, true); // BMI ≈ 18.29

                expect(result.status).toBe("underweight");
            });
        });

        describe("Normal (BMI 18.5 - 24.9)", () => {

            it("should return 'normal' at lower boundary (BMI 18.61)", async () => {

                const result = await evaluate(1.75, 57, true); // BMI ≈ 18.61

                expect(result.status).toBe("normal");
            });

            it("should return 'normal' for ideal BMI (BMI 22.86)", async () => {

                const result = await evaluate(1.75, 70, true); // BMI ≈ 22.86

                expect(result.status).toBe("normal");
            });

            it("should return 'normal' at upper boundary (BMI 24.82)", async () => {

                const result = await evaluate(1.75, 76, true); // BMI ≈ 24.82

                expect(result.status).toBe("normal");
            });
        });

        describe("Overweight (BMI 25.0 - 29.9)", () => {

            it("should return 'overweight' at lower boundary (BMI 25.14)", async () => {

                const result = await evaluate(1.75, 77, true); // BMI ≈ 25.14

                expect(result.status).toBe("overweight");
            });

            it("should return 'overweight' for BMI 27.68", async () => {

                const result = await evaluate(1.70, 80, true); // BMI ≈ 27.68

                expect(result.status).toBe("overweight");
            });

            it("should return 'overweight' at upper boundary (BMI 29.71)", async () => {

                const result = await evaluate(1.75, 91, true); // BMI ≈ 29.71

                expect(result.status).toBe("overweight");
            });
        });

        describe("Class 1 Obesity (BMI 30.0 - 34.9)", () => {

            it("should return 'class1.obesity' at lower boundary (BMI 30.04)", async () => {

                const result = await evaluate(1.75, 92, true); // BMI ≈ 30.04

                expect(result.status).toBe("class1.obesity");
            });

            it("should return 'class1.obesity' for BMI 34.60", async () => {

                const result = await evaluate(1.70, 100, true); // BMI ≈ 34.60

                expect(result.status).toBe("class1.obesity");
            });
        });

        describe("Class 2 Obesity (BMI 35.0 - 39.9)", () => {

            it("should return 'class2.obesity' at lower boundary (BMI 35.29)", async () => {

                const result = await evaluate(1.70, 102, true); // BMI ≈ 35.29

                expect(result.status).toBe("class2.obesity");
            });

            it("should return 'class2.obesity' for BMI 38.06", async () => {

                const result = await evaluate(1.70, 110, true); // BMI ≈ 38.06

                expect(result.status).toBe("class2.obesity");
            });
        });

        describe("Class 3 Obesity (BMI >= 40)", () => {

            it("should return 'class3.obesity' at lower boundary (BMI 41.52)", async () => {

                const result = await evaluate(1.70, 120, true); // BMI ≈ 41.52

                expect(result.status).toBe("class3.obesity");
            });

            it("should return 'class3.obesity' for severe obesity (BMI 48.44)", async () => {

                const result = await evaluate(1.70, 140, true); // BMI ≈ 48.44

                expect(result.status).toBe("class3.obesity");
            });
        });
    });

    describe("evaluateScore - Health Scoring", () => {

        describe("Underweight Scoring (BMI < 18.5)", () => {
            // Score starts at 849 at BMI 18.5, decreases at 50 pts/unit

            it("should score ~849 near the boundary (BMI ~18.4)", async () => {

                // BMI = 56 / (1.75)² = 18.29
                const result = await evaluate(1.75, 56, true);

                // score = 849 - (18.5 - 18.29) * 50 = 849 - 10.5 = 838.5
                expect(result.score).toBeCloseTo(839, 0);
            });

            it("should score lower for more underweight (BMI ~17.30)", async () => {

                // BMI = 50 / (1.70)² = 17.30
                const result = await evaluate(1.70, 50, true);

                // score = 849 - (18.5 - 17.30) * 50 = 849 - 60 = 789
                expect(result.score).toBeCloseTo(789, 0);
            });

            it("should score even lower for severely underweight (BMI ~15)", async () => {

                // BMI = 43.3 / (1.70)² = 15.0
                const result = await evaluate(1.70, 43.3, true);

                // score = 849 - (18.5 - 15) * 50 = 849 - 175 = 674
                expect(result.score).toBeCloseTo(674, 0);
            });

            it("should floor at 0 for extremely low BMI", async () => {

                // BMI = 20 / (1.70)² = 6.92
                const result = await evaluate(1.70, 20, true);

                // score = max(0, 849 - (18.5 - 6.92) * 50) = max(0, 849 - 579) = 270
                expect(result.score).toBeCloseTo(270, 0);
            });
        });

        describe("Normal Scoring (BMI 18.5 - 24.9)", () => {
            // BMI 22 = 1000, score approaches 850 at both boundaries

            it("should score 1000 at ideal BMI (22)", async () => {

                // BMI = 67.34 / (1.75)² = 22.0
                const result = await evaluate(1.75, 67.375, true);

                expect(result.score).toBe(1000);
            });

            it("should score ~850 at lower boundary (BMI ~18.5)", async () => {

                // BMI = 56.66 / (1.75)² = 18.5
                const result = await evaluate(1.75, 56.66, true);

                expect(result.score).toBeCloseTo(850, 0);
            });

            it("should score ~850 at upper boundary (BMI ~25)", async () => {

                // BMI = 76.56 / (1.75)² = 25.0
                // But 25 is actually overweight, so use just below
                // BMI = 76.5 / (1.75)² = 24.98
                const result = await evaluate(1.75, 76.5, true);

                // score = 1000 - (24.98 - 22) * 50 = 1000 - 149 = 851
                expect(result.score).toBeCloseTo(851, 0);
            });

            it("should score ~925 midway between 18.5 and 22 (BMI ~20.25)", async () => {

                // BMI = 62 / (1.75)² = 20.24
                const result = await evaluate(1.75, 62, true);

                // score = 850 + (20.24 - 18.5) * (150/3.5) = 850 + 74.6 = 924.6
                expect(result.score).toBeCloseTo(925, 0);
            });

            it("should score ~925 midway between 22 and 25 (BMI ~23.5)", async () => {

                // BMI = 72 / (1.75)² = 23.51
                const result = await evaluate(1.75, 72, true);

                // score = 1000 - (23.51 - 22) * 50 = 1000 - 75.5 = 924.5
                expect(result.score).toBeCloseTo(925, 0);
            });
        });

        describe("Overweight Scoring (BMI 25.0 - 29.9)", () => {
            // Score starts at 849 at BMI 25, approaches 700 at BMI 30

            it("should score ~849 at lower boundary (BMI 25)", async () => {

                // BMI = 77 / (1.75)² = 25.14
                const result = await evaluate(1.75, 77, true);

                // score = 849 - (25.14 - 25) * 29.8 = 849 - 4.2 = 845
                expect(result.score).toBeCloseTo(845, 0);
            });

            it("should score ~775 midway (BMI ~27.5)", async () => {

                // BMI = 84.2 / (1.75)² = 27.5
                const result = await evaluate(1.75, 84.2, true);

                // score = 849 - (27.5 - 25) * 29.8 = 849 - 74.5 = 774.5
                expect(result.score).toBeCloseTo(775, 0);
            });

            it("should score ~700 at upper boundary (BMI ~30)", async () => {

                // BMI = 91.5 / (1.75)² = 29.88
                const result = await evaluate(1.75, 91.5, true);

                // score = 849 - (29.88 - 25) * 29.8 = 849 - 145.4 = 703.6
                expect(result.score).toBeCloseTo(704, 0);
            });
        });

        describe("Class 1 Obesity Scoring (BMI 30.0 - 34.9)", () => {
            // Score starts at 699 at BMI 30, approaches 600 at BMI 35

            it("should score ~699 at lower boundary (BMI 30)", async () => {

                // BMI = 92 / (1.75)² = 30.04
                const result = await evaluate(1.75, 92, true);

                // score = 699 - (30.04 - 30) * 19.8 = 699 - 0.8 = 698.2
                expect(result.score).toBeCloseTo(698, 0);
            });

            it("should score ~650 midway (BMI ~32.5)", async () => {

                // BMI = 99.5 / (1.75)² = 32.49
                const result = await evaluate(1.75, 99.5, true);

                // score = 699 - (32.49 - 30) * 19.8 = 699 - 49.3 = 649.7
                expect(result.score).toBeCloseTo(650, 0);
            });

            it("should score ~600 at upper boundary (BMI ~35)", async () => {

                // BMI = 107 / (1.75)² = 34.94
                const result = await evaluate(1.75, 107, true);

                // score = 699 - (34.94 - 30) * 19.8 = 699 - 97.8 = 601.2
                expect(result.score).toBeCloseTo(601, 0);
            });
        });

        describe("Class 2 Obesity Scoring (BMI 35.0 - 39.9)", () => {
            // Score starts at 599 at BMI 35, approaches 500 at BMI 40

            it("should score ~599 at lower boundary (BMI 35)", async () => {

                // BMI = 107.2 / (1.75)² = 35.0
                const result = await evaluate(1.75, 107.2, true);

                // score = 599 - (35.0 - 35) * 19.8 = 599
                expect(result.score).toBeCloseTo(599, 0);
            });

            it("should score ~550 midway (BMI ~37.5)", async () => {

                // BMI = 114.8 / (1.75)² = 37.49
                const result = await evaluate(1.75, 114.8, true);

                // score = 599 - (37.49 - 35) * 19.8 = 599 - 49.3 = 549.7
                expect(result.score).toBeCloseTo(550, 0);
            });

            it("should score ~500 at upper boundary (BMI ~40)", async () => {

                // BMI = 122.5 / (1.75)² = 40.0
                const result = await evaluate(1.75, 122.4, true);

                // score = 599 - (39.97 - 35) * 19.8 = 599 - 98.4 = 500.6
                expect(result.score).toBeCloseTo(501, 0);
            });
        });

        describe("Class 3 Obesity Scoring (BMI >= 40)", () => {
            // Score starts at 499 at BMI 40, approaches 0

            it("should score ~499 at lower boundary (BMI 40)", async () => {

                // BMI = 122.5 / (1.75)² = 40.0
                const result = await evaluate(1.75, 122.5, true);

                // score = 499 - (40.0 - 40) * 24.95 = 499
                expect(result.score).toBeCloseTo(499, 0);
            });

            it("should score ~374 at BMI 45", async () => {

                // BMI = 137.8 / (1.75)² = 45.0
                const result = await evaluate(1.75, 137.8, true);

                // score = 499 - (45.0 - 40) * 24.95 = 499 - 124.75 = 374.25
                expect(result.score).toBeCloseTo(374, 0);
            });

            it("should score ~249 at BMI 50", async () => {

                // BMI = 153.1 / (1.75)² = 50.0
                const result = await evaluate(1.75, 153.1, true);

                // score = 499 - (50.0 - 40) * 24.95 = 499 - 249.5 = 249.5
                expect(result.score).toBeCloseTo(250, 0);
            });

            it("should floor at 0 for extremely high BMI (BMI 60+)", async () => {

                // BMI = 183.8 / (1.75)² = 60.0
                const result = await evaluate(1.75, 183.8, true);

                // score = max(0, 499 - (60.0 - 40) * 24.95) = max(0, 499 - 499) = 0
                expect(result.score).toBe(0);
            });
        });
    });

    describe("Status Boundary Transitions", () => {

        it("should transition from underweight to normal at BMI 18.5", async () => {

            const underweight = await evaluate(1.75, 56, true); // BMI ≈ 18.29
            const normal = await evaluate(1.75, 57, true); // BMI ≈ 18.61

            expect(underweight.status).toBe("underweight");
            expect(normal.status).toBe("normal");
        });

        it("should transition from normal to overweight at BMI 25", async () => {

            const normal = await evaluate(1.75, 76, true); // BMI ≈ 24.82
            const overweight = await evaluate(1.75, 77, true); // BMI ≈ 25.14

            expect(normal.status).toBe("normal");
            expect(overweight.status).toBe("overweight");
        });

        it("should transition from overweight to class1.obesity at BMI 30", async () => {

            const overweight = await evaluate(1.75, 91, true); // BMI ≈ 29.71
            const obese = await evaluate(1.75, 92, true); // BMI ≈ 30.04

            expect(overweight.status).toBe("overweight");
            expect(obese.status).toBe("class1.obesity");
        });

        it("should transition from class1.obesity to class2.obesity at BMI 35", async () => {

            const class1 = await evaluate(1.75, 107, true); // BMI ≈ 34.94
            const class2 = await evaluate(1.75, 108, true); // BMI ≈ 35.27

            expect(class1.status).toBe("class1.obesity");
            expect(class2.status).toBe("class2.obesity");
        });

        it("should transition from class2.obesity to class3.obesity at BMI 40", async () => {

            const class2 = await evaluate(1.75, 122, true); // BMI ≈ 39.84
            const class3 = await evaluate(1.75, 123, true); // BMI ≈ 40.16

            expect(class2.status).toBe("class2.obesity");
            expect(class3.status).toBe("class3.obesity");
        });
    });

    describe("Real-World Scenarios", () => {

        it("should classify athletic adult male metric (75kg, 1.80m)", async () => {

            // BMI = 75 / (1.80)² = 75 / 3.24 = 23.15
            const result = await evaluate(1.80, 75, true);

            expect(result.data.bmi).toBeCloseTo(23.15, 1);
            expect(result.status).toBe("normal");
            // score = 1000 - (23.15 - 22) * 50 = 1000 - 57.5 = 942.5
            expect(result.score).toBeCloseTo(943, 0);
        });

        it("should classify typical adult female metric (58kg, 1.65m)", async () => {

            // BMI = 58 / (1.65)² = 58 / 2.7225 = 21.30
            const result = await evaluate(1.65, 58, true);

            expect(result.data.bmi).toBeCloseTo(21.30, 1);
            expect(result.status).toBe("normal");
            // score = 850 + (21.30 - 18.5) * (150/3.5) = 850 + 120 = 970
            expect(result.score).toBeCloseTo(970, 0);
        });

        it("should classify athletic adult male imperial (180lbs, 72in)", async () => {

            // BMI = (180 * 703) / (72)² = 126540 / 5184 = 24.41
            const result = await evaluate(72, 180, false);

            expect(result.data.bmi).toBeCloseTo(24.41, 1);
            expect(result.status).toBe("normal");
            // score = 1000 - (24.41 - 22) * 50 = 1000 - 120.5 = 879.5
            expect(result.score).toBeCloseTo(880, 0);
        });

        it("should classify typical adult female imperial (130lbs, 64in)", async () => {

            // BMI = (130 * 703) / (64)² = 91390 / 4096 = 22.32
            const result = await evaluate(64, 130, false);

            expect(result.data.bmi).toBeCloseTo(22.32, 1);
            expect(result.status).toBe("normal");
            // score = 1000 - (22.32 - 22) * 50 = 1000 - 16 = 984
            expect(result.score).toBeCloseTo(984, 0);
        });
    });
});
