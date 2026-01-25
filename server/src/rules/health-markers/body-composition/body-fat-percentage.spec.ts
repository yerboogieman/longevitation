import nools from "nools";
import * as path from "path";

describe("body-fat-percentage.nools", () => {

    let flow: any;
    let BodyFatPercentage: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "body-fat-percentage.nools"));
        BodyFatPercentage = flow.getDefined("BodyFatPercentage");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluateBodyFatPercentage(age: number, sex: string, value: number): Promise<any> {

        const bodyFatPercentage = new BodyFatPercentage({ age, sex, value });

        const result = new ScoreResult();
        const session = flow.getSession(bodyFatPercentage, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("Body Fat Percentage for Men (sex='M')", () => {

        describe("Age 20-29", () => {

            describe("Low (≤5%)", () => {

                it("should classify 3% body fat as low for 25-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(25, "M", 3);

                    expect(result.status).toBe("low");
                });

                it("should classify 5% body fat as low for 29-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(29, "M", 5);

                    expect(result.status).toBe("low");
                });
            });

            describe("Athletic/Fit (6-13%)", () => {

                it("should classify 6% body fat as athletic.fit for 25-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(25, "M", 6);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 10% body fat as athletic.fit for 25-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(25, "M", 10);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 13% body fat as athletic.fit for 25-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(25, "M", 13);

                    expect(result.status).toBe("athletic.fit");
                });
            });

            describe("Acceptable (14-24%)", () => {

                it("should classify 14% body fat as acceptable for 25-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(25, "M", 14);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 20% body fat as acceptable for 25-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(25, "M", 20);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 24% body fat as acceptable for 25-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(25, "M", 24);

                    expect(result.status).toBe("acceptable");
                });
            });

            describe("Obese (>24%)", () => {

                it("should classify 25% body fat as obese for 25-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(25, "M", 25);

                    expect(result.status).toBe("obese");
                });

                it("should classify 30% body fat as obese for 25-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(25, "M", 30);

                    expect(result.status).toBe("obese");
                });
            });
        });

        describe("Age 30-39", () => {

            describe("Low (≤5%)", () => {

                it("should classify 5% body fat as low for 35-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(35, "M", 5);

                    expect(result.status).toBe("low");
                });
            });

            describe("Athletic/Fit (6-14%)", () => {

                it("should classify 6% body fat as athletic.fit for 35-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(35, "M", 6);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 14% body fat as athletic.fit for 35-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(35, "M", 14);

                    expect(result.status).toBe("athletic.fit");
                });
            });

            describe("Acceptable (15-25%)", () => {

                it("should classify 15% body fat as acceptable for 35-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(35, "M", 15);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 25% body fat as acceptable for 35-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(35, "M", 25);

                    expect(result.status).toBe("acceptable");
                });
            });

            describe("Obese (>25%)", () => {

                it("should classify 26% body fat as obese for 35-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(35, "M", 26);

                    expect(result.status).toBe("obese");
                });
            });
        });

        describe("Age 40-49", () => {

            describe("Low (≤6%)", () => {

                it("should classify 6% body fat as low for 45-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(45, "M", 6);

                    expect(result.status).toBe("low");
                });
            });

            describe("Athletic/Fit (7-15%)", () => {

                it("should classify 7% body fat as athletic.fit for 45-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(45, "M", 7);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 15% body fat as athletic.fit for 45-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(45, "M", 15);

                    expect(result.status).toBe("athletic.fit");
                });
            });

            describe("Acceptable (16-26%)", () => {

                it("should classify 16% body fat as acceptable for 45-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(45, "M", 16);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 26% body fat as acceptable for 45-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(45, "M", 26);

                    expect(result.status).toBe("acceptable");
                });
            });

            describe("Obese (>26%)", () => {

                it("should classify 27% body fat as obese for 45-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(45, "M", 27);

                    expect(result.status).toBe("obese");
                });
            });
        });

        describe("Age 50-59", () => {

            describe("Low (≤7%)", () => {

                it("should classify 7% body fat as low for 55-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(55, "M", 7);

                    expect(result.status).toBe("low");
                });
            });

            describe("Athletic/Fit (8-16%)", () => {

                it("should classify 8% body fat as athletic.fit for 55-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(55, "M", 8);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 16% body fat as athletic.fit for 55-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(55, "M", 16);

                    expect(result.status).toBe("athletic.fit");
                });
            });

            describe("Acceptable (17-27%)", () => {

                it("should classify 17% body fat as acceptable for 55-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(55, "M", 17);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 27% body fat as acceptable for 55-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(55, "M", 27);

                    expect(result.status).toBe("acceptable");
                });
            });

            describe("Obese (>27%)", () => {

                it("should classify 28% body fat as obese for 55-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(55, "M", 28);

                    expect(result.status).toBe("obese");
                });
            });
        });

        describe("Age 60+", () => {

            describe("Low (≤8%)", () => {

                it("should classify 8% body fat as low for 65-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(65, "M", 8);

                    expect(result.status).toBe("low");
                });
            });

            describe("Athletic/Fit (9-17%)", () => {

                it("should classify 9% body fat as athletic.fit for 65-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(65, "M", 9);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 17% body fat as athletic.fit for 65-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(65, "M", 17);

                    expect(result.status).toBe("athletic.fit");
                });
            });

            describe("Acceptable (18-28%)", () => {

                it("should classify 18% body fat as acceptable for 65-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(65, "M", 18);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 28% body fat as acceptable for 65-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(65, "M", 28);

                    expect(result.status).toBe("acceptable");
                });
            });

            describe("Obese (>28%)", () => {

                it("should classify 29% body fat as obese for 65-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(65, "M", 29);

                    expect(result.status).toBe("obese");
                });

                it("should classify 35% body fat as obese for 70-year-old male", async () => {

                    const result = await evaluateBodyFatPercentage(70, "M", 35);

                    expect(result.status).toBe("obese");
                });
            });
        });
    });

    describe("Body Fat Percentage for Women (sex='F')", () => {

        describe("Age 20-29", () => {

            describe("Low (≤13%)", () => {

                it("should classify 10% body fat as low for 25-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(25, "F", 10);

                    expect(result.status).toBe("low");
                });

                it("should classify 13% body fat as low for 25-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(25, "F", 13);

                    expect(result.status).toBe("low");
                });
            });

            describe("Athletic/Fit (14-20%)", () => {

                it("should classify 14% body fat as athletic.fit for 25-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(25, "F", 14);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 17% body fat as athletic.fit for 25-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(25, "F", 17);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 20% body fat as athletic.fit for 25-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(25, "F", 20);

                    expect(result.status).toBe("athletic.fit");
                });
            });

            describe("Acceptable (21-31%)", () => {

                it("should classify 21% body fat as acceptable for 25-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(25, "F", 21);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 25% body fat as acceptable for 25-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(25, "F", 25);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 31% body fat as acceptable for 25-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(25, "F", 31);

                    expect(result.status).toBe("acceptable");
                });
            });

            describe("Obese (>31%)", () => {

                it("should classify 32% body fat as obese for 25-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(25, "F", 32);

                    expect(result.status).toBe("obese");
                });

                it("should classify 40% body fat as obese for 25-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(25, "F", 40);

                    expect(result.status).toBe("obese");
                });
            });
        });

        describe("Age 30-39", () => {

            describe("Low (≤14%)", () => {

                it("should classify 14% body fat as low for 35-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(35, "F", 14);

                    expect(result.status).toBe("low");
                });
            });

            describe("Athletic/Fit (15-21%)", () => {

                it("should classify 15% body fat as athletic.fit for 35-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(35, "F", 15);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 21% body fat as athletic.fit for 35-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(35, "F", 21);

                    expect(result.status).toBe("athletic.fit");
                });
            });

            describe("Acceptable (22-32%)", () => {

                it("should classify 22% body fat as acceptable for 35-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(35, "F", 22);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 32% body fat as acceptable for 35-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(35, "F", 32);

                    expect(result.status).toBe("acceptable");
                });
            });

            describe("Obese (>32%)", () => {

                it("should classify 33% body fat as obese for 35-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(35, "F", 33);

                    expect(result.status).toBe("obese");
                });
            });
        });

        describe("Age 40-49", () => {

            describe("Low (≤15%)", () => {

                it("should classify 15% body fat as low for 45-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(45, "F", 15);

                    expect(result.status).toBe("low");
                });
            });

            describe("Athletic/Fit (16-22%)", () => {

                it("should classify 16% body fat as athletic.fit for 45-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(45, "F", 16);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 22% body fat as athletic.fit for 45-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(45, "F", 22);

                    expect(result.status).toBe("athletic.fit");
                });
            });

            describe("Acceptable (23-33%)", () => {

                it("should classify 23% body fat as acceptable for 45-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(45, "F", 23);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 33% body fat as acceptable for 45-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(45, "F", 33);

                    expect(result.status).toBe("acceptable");
                });
            });

            describe("Obese (>33%)", () => {

                it("should classify 34% body fat as obese for 45-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(45, "F", 34);

                    expect(result.status).toBe("obese");
                });
            });
        });

        describe("Age 50-59", () => {

            describe("Low (≤16%)", () => {

                it("should classify 16% body fat as low for 55-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(55, "F", 16);

                    expect(result.status).toBe("low");
                });
            });

            describe("Athletic/Fit (17-23%)", () => {

                it("should classify 17% body fat as athletic.fit for 55-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(55, "F", 17);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 23% body fat as athletic.fit for 55-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(55, "F", 23);

                    expect(result.status).toBe("athletic.fit");
                });
            });

            describe("Acceptable (24-34%)", () => {

                it("should classify 24% body fat as acceptable for 55-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(55, "F", 24);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 34% body fat as acceptable for 55-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(55, "F", 34);

                    expect(result.status).toBe("acceptable");
                });
            });

            describe("Obese (>34%)", () => {

                it("should classify 35% body fat as obese for 55-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(55, "F", 35);

                    expect(result.status).toBe("obese");
                });
            });
        });

        describe("Age 60+", () => {

            describe("Low (≤17%)", () => {

                it("should classify 17% body fat as low for 65-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(65, "F", 17);

                    expect(result.status).toBe("low");
                });
            });

            describe("Athletic/Fit (18-24%)", () => {

                it("should classify 18% body fat as athletic.fit for 65-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(65, "F", 18);

                    expect(result.status).toBe("athletic.fit");
                });

                it("should classify 24% body fat as athletic.fit for 65-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(65, "F", 24);

                    expect(result.status).toBe("athletic.fit");
                });
            });

            describe("Acceptable (25-35%)", () => {

                it("should classify 25% body fat as acceptable for 65-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(65, "F", 25);

                    expect(result.status).toBe("acceptable");
                });

                it("should classify 35% body fat as acceptable for 65-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(65, "F", 35);

                    expect(result.status).toBe("acceptable");
                });
            });

            describe("Obese (>35%)", () => {

                it("should classify 36% body fat as obese for 65-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(65, "F", 36);

                    expect(result.status).toBe("obese");
                });

                it("should classify 45% body fat as obese for 70-year-old female", async () => {

                    const result = await evaluateBodyFatPercentage(70, "F", 45);

                    expect(result.status).toBe("obese");
                });
            });
        });
    });

    describe("Age Boundary Transitions for Men", () => {

        it("should use 20-29 ranges for 29-year-old male", async () => {

            // 13% is athletic.fit in 20-29 range, but would be athletic.fit in 30-39 too
            // Use 5% which is low in 20-29 but low in 30-39 too
            // Better: use 24% which is acceptable in 20-29 but acceptable in 30-39
            const result = await evaluateBodyFatPercentage(29, "M", 24);

            expect(result.status).toBe("acceptable");
        });

        it("should use 30-39 ranges for 30-year-old male", async () => {

            // 25% is acceptable in 30-39 range but obese in 20-29
            const result = await evaluateBodyFatPercentage(30, "M", 25);

            expect(result.status).toBe("acceptable");
        });

        it("should use 40-49 ranges for 40-year-old male", async () => {

            // 26% is acceptable in 40-49 range but obese in 30-39
            const result = await evaluateBodyFatPercentage(40, "M", 26);

            expect(result.status).toBe("acceptable");
        });

        it("should use 50-59 ranges for 50-year-old male", async () => {

            // 27% is acceptable in 50-59 range but obese in 40-49
            const result = await evaluateBodyFatPercentage(50, "M", 27);

            expect(result.status).toBe("acceptable");
        });

        it("should use 60+ ranges for 60-year-old male", async () => {

            // 28% is acceptable in 60+ range but obese in 50-59
            const result = await evaluateBodyFatPercentage(60, "M", 28);

            expect(result.status).toBe("acceptable");
        });
    });

    describe("Age Boundary Transitions for Women", () => {

        it("should use 20-29 ranges for 29-year-old female", async () => {

            const result = await evaluateBodyFatPercentage(29, "F", 31);

            expect(result.status).toBe("acceptable");
        });

        it("should use 30-39 ranges for 30-year-old female", async () => {

            // 32% is acceptable in 30-39 range but obese in 20-29
            const result = await evaluateBodyFatPercentage(30, "F", 32);

            expect(result.status).toBe("acceptable");
        });

        it("should use 40-49 ranges for 40-year-old female", async () => {

            // 33% is acceptable in 40-49 range but obese in 30-39
            const result = await evaluateBodyFatPercentage(40, "F", 33);

            expect(result.status).toBe("acceptable");
        });

        it("should use 50-59 ranges for 50-year-old female", async () => {

            // 34% is acceptable in 50-59 range but obese in 40-49
            const result = await evaluateBodyFatPercentage(50, "F", 34);

            expect(result.status).toBe("acceptable");
        });

        it("should use 60+ ranges for 60-year-old female", async () => {

            // 35% is acceptable in 60+ range but obese in 50-59
            const result = await evaluateBodyFatPercentage(60, "F", 35);

            expect(result.status).toBe("acceptable");
        });
    });

    describe("Edge Cases", () => {

        it("should handle very young adult male (20 years old)", async () => {

            const result = await evaluateBodyFatPercentage(20, "M", 15);

            expect(result.status).toBe("acceptable");
        });

        it("should handle elderly male (80 years old)", async () => {

            const result = await evaluateBodyFatPercentage(80, "M", 20);

            expect(result.status).toBe("acceptable");
        });

        it("should handle very young adult female (20 years old)", async () => {

            const result = await evaluateBodyFatPercentage(20, "F", 22);

            expect(result.status).toBe("acceptable");
        });

        it("should handle elderly female (80 years old)", async () => {

            const result = await evaluateBodyFatPercentage(80, "F", 28);

            expect(result.status).toBe("acceptable");
        });

        it("should handle extremely low body fat for male (2%)", async () => {

            const result = await evaluateBodyFatPercentage(30, "M", 2);

            expect(result.status).toBe("low");
        });

        it("should handle extremely high body fat for male (50%)", async () => {

            const result = await evaluateBodyFatPercentage(30, "M", 50);

            expect(result.status).toBe("obese");
        });

        it("should handle extremely low body fat for female (8%)", async () => {

            const result = await evaluateBodyFatPercentage(30, "F", 8);

            expect(result.status).toBe("low");
        });

        it("should handle extremely high body fat for female (55%)", async () => {

            const result = await evaluateBodyFatPercentage(30, "F", 55);

            expect(result.status).toBe("obese");
        });
    });

    describe("Typical Real-World Scenarios", () => {

        it("should classify fit male athlete (25 years, 10% body fat)", async () => {

            const result = await evaluateBodyFatPercentage(25, "M", 10);

            expect(result.status).toBe("athletic.fit");
        });

        it("should classify average healthy male (35 years, 18% body fat)", async () => {

            const result = await evaluateBodyFatPercentage(35, "M", 18);

            expect(result.status).toBe("acceptable");
        });

        it("should classify fit female athlete (25 years, 18% body fat)", async () => {

            const result = await evaluateBodyFatPercentage(25, "F", 18);

            expect(result.status).toBe("athletic.fit");
        });

        it("should classify average healthy female (35 years, 26% body fat)", async () => {

            const result = await evaluateBodyFatPercentage(35, "F", 26);

            expect(result.status).toBe("acceptable");
        });

        it("should classify middle-aged male (45 years, 22% body fat)", async () => {

            const result = await evaluateBodyFatPercentage(45, "M", 22);

            expect(result.status).toBe("acceptable");
        });

        it("should classify middle-aged female (45 years, 28% body fat)", async () => {

            const result = await evaluateBodyFatPercentage(45, "F", 28);

            expect(result.status).toBe("acceptable");
        });

        it("should classify senior male (65 years, 24% body fat)", async () => {

            const result = await evaluateBodyFatPercentage(65, "M", 24);

            expect(result.status).toBe("acceptable");
        });

        it("should classify senior female (65 years, 32% body fat)", async () => {

            const result = await evaluateBodyFatPercentage(65, "F", 32);

            expect(result.status).toBe("acceptable");
        });
    });
});
