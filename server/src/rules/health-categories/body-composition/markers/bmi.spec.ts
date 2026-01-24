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

    async function evaluateBMI(heightInMetersOrInches: number, weightInKgOrLbs: number, isMetric: boolean): Promise<any> {

        const bmi = new BMI({ heightInMetersOrInches, weightInKgOrLbs, isMetric });

        const result = new ScoreResult();
        const session = flow.getSession(bmi, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("BMI Calculation - Metric (kg/m)", () => {
        // Formula: BMI = weight (kg) / (height (m))²

        describe("Underweight (BMI < 18.5)", () => {

            it("should calculate BMI correctly for underweight person (50kg, 1.70m)", async () => {

                // BMI = 50 / (1.70)² = 50 / 2.89 = 17.30
                const result = await evaluateBMI(1.70, 50, true);

                expect(result.bmi).toBeCloseTo(17.30, 1);
                expect(result.status).toBe("underweight");
            });

            it("should calculate BMI correctly at boundary (55kg, 1.75m)", async () => {

                // BMI = 55 / (1.75)² = 55 / 3.0625 = 17.96
                const result = await evaluateBMI(1.75, 55, true);

                expect(result.bmi).toBeCloseTo(17.96, 1);
                expect(result.status).toBe("underweight");
            });
        });

        describe("Normal Weight (BMI 18.5 - 24.9)", () => {

            it("should calculate BMI correctly for normal weight person (70kg, 1.75m)", async () => {

                // BMI = 70 / (1.75)² = 70 / 3.0625 = 22.86
                const result = await evaluateBMI(1.75, 70, true);

                expect(result.bmi).toBeCloseTo(22.86, 1);
                expect(result.status).toBe("normal");
            });

            it("should calculate BMI correctly at lower boundary (60kg, 1.80m)", async () => {

                // BMI = 60 / (1.80)² = 60 / 3.24 = 18.52
                const result = await evaluateBMI(1.80, 60, true);

                expect(result.bmi).toBeCloseTo(18.52, 1);
                expect(result.status).toBe("normal");
            });

            it("should calculate BMI correctly at upper boundary (81kg, 1.80m)", async () => {

                // BMI = 81 / (1.80)² = 81 / 3.24 = 25.0 -> but <= 24.9 is normal
                // Use 80kg instead: BMI = 80 / 3.24 = 24.69
                const result = await evaluateBMI(1.80, 80, true);

                expect(result.bmi).toBeCloseTo(24.69, 1);
                expect(result.status).toBe("normal");
            });
        });

        describe("Overweight (BMI 25.0 - 29.9)", () => {

            it("should calculate BMI correctly for overweight person (80kg, 1.70m)", async () => {

                // BMI = 80 / (1.70)² = 80 / 2.89 = 27.68
                const result = await evaluateBMI(1.70, 80, true);

                expect(result.bmi).toBeCloseTo(27.68, 1);
                expect(result.status).toBe("overweight");
            });

            it("should calculate BMI correctly at lower boundary (77kg, 1.75m)", async () => {

                // BMI = 77 / (1.75)² = 77 / 3.0625 = 25.14
                const result = await evaluateBMI(1.75, 77, true);

                expect(result.bmi).toBeCloseTo(25.14, 1);
                expect(result.status).toBe("overweight");
            });

            it("should calculate BMI correctly at upper boundary (91kg, 1.75m)", async () => {

                // BMI = 91 / (1.75)² = 91 / 3.0625 = 29.71
                const result = await evaluateBMI(1.75, 91, true);

                expect(result.bmi).toBeCloseTo(29.71, 1);
                expect(result.status).toBe("overweight");
            });
        });

        describe("Obese (BMI >= 30)", () => {

            it("should calculate BMI correctly for obese person (100kg, 1.70m)", async () => {

                // BMI = 100 / (1.70)² = 100 / 2.89 = 34.60
                const result = await evaluateBMI(1.70, 100, true);

                expect(result.bmi).toBeCloseTo(34.60, 1);
                expect(result.status).toBe("obese");
            });

            it("should calculate BMI correctly at lower boundary (92kg, 1.75m)", async () => {

                // BMI = 92 / (1.75)² = 92 / 3.0625 = 30.04
                const result = await evaluateBMI(1.75, 92, true);

                expect(result.bmi).toBeCloseTo(30.04, 1);
                expect(result.status).toBe("obese");
            });

            it("should calculate BMI correctly for severely obese person (120kg, 1.70m)", async () => {

                // BMI = 120 / (1.70)² = 120 / 2.89 = 41.52
                const result = await evaluateBMI(1.70, 120, true);

                expect(result.bmi).toBeCloseTo(41.52, 1);
                expect(result.status).toBe("obese");
            });
        });
    });

    describe("BMI Calculation - Imperial (lbs/inches)", () => {
        // Formula: BMI = (weight (lb) × 703) / (height (in))²

        describe("Underweight (BMI < 18.5)", () => {

            it("should calculate BMI correctly for underweight person (110lbs, 67in)", async () => {

                // BMI = (110 * 703) / (67)² = 77330 / 4489 = 17.23
                const result = await evaluateBMI(67, 110, false);

                expect(result.bmi).toBeCloseTo(17.23, 1);
                expect(result.status).toBe("underweight");
            });

            it("should calculate BMI correctly for underweight person (100lbs, 65in)", async () => {

                // BMI = (100 * 703) / (65)² = 70300 / 4225 = 16.64
                const result = await evaluateBMI(65, 100, false);

                expect(result.bmi).toBeCloseTo(16.64, 1);
                expect(result.status).toBe("underweight");
            });
        });

        describe("Normal Weight (BMI 18.5 - 24.9)", () => {

            it("should calculate BMI correctly for normal weight person (154lbs, 69in)", async () => {

                // BMI = (154 * 703) / (69)² = 108262 / 4761 = 22.74
                const result = await evaluateBMI(69, 154, false);

                expect(result.bmi).toBeCloseTo(22.74, 1);
                expect(result.status).toBe("normal");
            });

            it("should calculate BMI correctly for normal weight person (140lbs, 66in)", async () => {

                // BMI = (140 * 703) / (66)² = 98420 / 4356 = 22.60
                const result = await evaluateBMI(66, 140, false);

                expect(result.bmi).toBeCloseTo(22.60, 1);
                expect(result.status).toBe("normal");
            });

            it("should calculate BMI correctly at lower boundary (125lbs, 65in)", async () => {

                // BMI = (125 * 703) / (65)² = 87875 / 4225 = 20.80
                const result = await evaluateBMI(65, 125, false);

                expect(result.bmi).toBeCloseTo(20.80, 1);
                expect(result.status).toBe("normal");
            });
        });

        describe("Overweight (BMI 25.0 - 29.9)", () => {

            it("should calculate BMI correctly for overweight person (190lbs, 68in)", async () => {

                // BMI = (190 * 703) / (68)² = 133570 / 4624 = 28.89
                const result = await evaluateBMI(68, 190, false);

                expect(result.bmi).toBeCloseTo(28.89, 1);
                expect(result.status).toBe("overweight");
            });

            it("should calculate BMI correctly at lower boundary (170lbs, 68in)", async () => {

                // BMI = (170 * 703) / (68)² = 119510 / 4624 = 25.85
                const result = await evaluateBMI(68, 170, false);

                expect(result.bmi).toBeCloseTo(25.85, 1);
                expect(result.status).toBe("overweight");
            });

            it("should calculate BMI correctly at upper boundary (196lbs, 68in)", async () => {

                // BMI = (196 * 703) / (68)² = 137788 / 4624 = 29.80
                const result = await evaluateBMI(68, 196, false);

                expect(result.bmi).toBeCloseTo(29.80, 1);
                expect(result.status).toBe("overweight");
            });
        });

        describe("Obese (BMI >= 30)", () => {

            it("should calculate BMI correctly for obese person (230lbs, 68in)", async () => {

                // BMI = (230 * 703) / (68)² = 161690 / 4624 = 34.97
                const result = await evaluateBMI(68, 230, false);

                expect(result.bmi).toBeCloseTo(34.97, 1);
                expect(result.status).toBe("obese");
            });

            it("should calculate BMI correctly at lower boundary (200lbs, 68in)", async () => {

                // BMI = (200 * 703) / (68)² = 140600 / 4624 = 30.41
                const result = await evaluateBMI(68, 200, false);

                expect(result.bmi).toBeCloseTo(30.41, 1);
                expect(result.status).toBe("obese");
            });

            it("should calculate BMI correctly for severely obese person (280lbs, 68in)", async () => {

                // BMI = (280 * 703) / (68)² = 196840 / 4624 = 42.57
                const result = await evaluateBMI(68, 280, false);

                expect(result.bmi).toBeCloseTo(42.57, 1);
                expect(result.status).toBe("obese");
            });
        });
    });

    describe("BMI Status Boundary Transitions", () => {

        describe("Metric boundaries", () => {

            it("should transition from underweight to normal at BMI 18.5", async () => {

                // 56.7kg at 1.75m = 18.5 BMI (boundary)
                const underweight = await evaluateBMI(1.75, 56, true); // 18.29
                const normal = await evaluateBMI(1.75, 57, true); // 18.61

                expect(underweight.status).toBe("underweight");
                expect(normal.status).toBe("normal");
            });

            it("should transition from normal to overweight at BMI 25", async () => {

                // At 1.75m: 76kg = 24.82, 77kg = 25.14
                const normal = await evaluateBMI(1.75, 76, true);
                const overweight = await evaluateBMI(1.75, 77, true);

                expect(normal.status).toBe("normal");
                expect(overweight.status).toBe("overweight");
            });

            it("should transition from overweight to obese at BMI 30", async () => {

                // At 1.75m: 91kg = 29.71, 92kg = 30.04
                const overweight = await evaluateBMI(1.75, 91, true);
                const obese = await evaluateBMI(1.75, 92, true);

                expect(overweight.status).toBe("overweight");
                expect(obese.status).toBe("obese");
            });
        });

        describe("Imperial boundaries", () => {

            it("should transition from underweight to normal at BMI 18.5", async () => {

                // At 68in: 121lbs = 18.40, 122lbs = 18.55
                const underweight = await evaluateBMI(68, 121, false);
                const normal = await evaluateBMI(68, 122, false);

                expect(underweight.status).toBe("underweight");
                expect(normal.status).toBe("normal");
            });

            it("should transition from normal to overweight at BMI 25", async () => {

                // At 68in: 163lbs = 24.79, 164lbs = 24.94 (but 24.94 > 24.9 so overweight)
                const normal = await evaluateBMI(68, 163, false);
                const overweight = await evaluateBMI(68, 164, false);

                expect(normal.status).toBe("normal");
                expect(overweight.status).toBe("overweight");
            });

            it("should transition from overweight to obese at BMI 30", async () => {

                // At 68in: 196lbs = 29.80, 198lbs = 30.10
                const overweight = await evaluateBMI(68, 196, false);
                const obese = await evaluateBMI(68, 198, false);

                expect(overweight.status).toBe("overweight");
                expect(obese.status).toBe("obese");
            });
        });
    });

    describe("Edge Cases", () => {

        it("should handle very short height metric (1.50m)", async () => {

            // BMI = 60 / (1.50)² = 60 / 2.25 = 26.67
            const result = await evaluateBMI(1.50, 60, true);

            expect(result.bmi).toBeCloseTo(26.67, 1);
            expect(result.status).toBe("overweight");
        });

        it("should handle very tall height metric (2.00m)", async () => {

            // BMI = 80 / (2.00)² = 80 / 4.00 = 20.00
            const result = await evaluateBMI(2.00, 80, true);

            expect(result.bmi).toBeCloseTo(20.00, 1);
            expect(result.status).toBe("normal");
        });

        it("should handle very short height imperial (60in)", async () => {

            // BMI = (130 * 703) / (60)² = 91390 / 3600 = 25.39
            const result = await evaluateBMI(60, 130, false);

            expect(result.bmi).toBeCloseTo(25.39, 1);
            expect(result.status).toBe("overweight");
        });

        it("should handle very tall height imperial (76in)", async () => {

            // BMI = (200 * 703) / (76)² = 140600 / 5776 = 24.34
            const result = await evaluateBMI(76, 200, false);

            expect(result.bmi).toBeCloseTo(24.34, 1);
            expect(result.status).toBe("normal");
        });
    });

    describe("Typical Real-World Scenarios", () => {

        it("should classify typical athletic adult male metric (75kg, 1.80m)", async () => {

            // BMI = 75 / (1.80)² = 75 / 3.24 = 23.15
            const result = await evaluateBMI(1.80, 75, true);

            expect(result.bmi).toBeCloseTo(23.15, 1);
            expect(result.status).toBe("normal");
        });

        it("should classify typical adult female metric (58kg, 1.65m)", async () => {

            // BMI = 58 / (1.65)² = 58 / 2.7225 = 21.30
            const result = await evaluateBMI(1.65, 58, true);

            expect(result.bmi).toBeCloseTo(21.30, 1);
            expect(result.status).toBe("normal");
        });

        it("should classify typical athletic adult male imperial (180lbs, 72in)", async () => {

            // BMI = (180 * 703) / (72)² = 126540 / 5184 = 24.41
            const result = await evaluateBMI(72, 180, false);

            expect(result.bmi).toBeCloseTo(24.41, 1);
            expect(result.status).toBe("normal");
        });

        it("should classify typical adult female imperial (130lbs, 64in)", async () => {

            // BMI = (130 * 703) / (64)² = 91390 / 4096 = 22.32
            const result = await evaluateBMI(64, 130, false);

            expect(result.bmi).toBeCloseTo(22.32, 1);
            expect(result.status).toBe("normal");
        });
    });
});
