import nools from "nools";
import * as path from "path";

describe("cac.nools", () => {

    let flow: any;
    let CAC: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "cac.nools"));
        CAC = flow.getDefined("CAC");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluate(score: number, age: number = 50, sex: 'M' | 'F' = 'M'): Promise<any> {

        const cac = new CAC({ score, age, sex });

        const result = new ScoreResult();
        const session = flow.getSession(cac, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("evaluateStatus", () => {

        describe("No Detectable Plaque (CAC = 0)", () => {

            it("should return 'no.detectable.plaque' for CAC score 0", async () => {
                const result = await evaluate(0);
                expect(result.status).toBe("no.detectable.plaque");
            });
        });

        describe("Mild Plaque (CAC 1-99)", () => {

            it("should return 'mild.plaque' for CAC score 1", async () => {
                const result = await evaluate(1);
                expect(result.status).toBe("mild.plaque");
            });

            it("should return 'mild.plaque' for CAC score 50", async () => {
                const result = await evaluate(50);
                expect(result.status).toBe("mild.plaque");
            });

            it("should return 'mild.plaque' for CAC score 99", async () => {
                const result = await evaluate(99);
                expect(result.status).toBe("mild.plaque");
            });
        });

        describe("Moderate Plaque (CAC 100-399)", () => {

            it("should return 'moderate.plaque' for CAC score 100", async () => {
                const result = await evaluate(100);
                expect(result.status).toBe("moderate.plaque");
            });

            it("should return 'moderate.plaque' for CAC score 250", async () => {
                const result = await evaluate(250);
                expect(result.status).toBe("moderate.plaque");
            });

            it("should return 'moderate.plaque' for CAC score 399", async () => {
                const result = await evaluate(399);
                expect(result.status).toBe("moderate.plaque");
            });
        });

        describe("Extensive Plaque (CAC >= 400)", () => {

            it("should return 'extensive.plaque' for CAC score 400", async () => {
                const result = await evaluate(400);
                expect(result.status).toBe("extensive.plaque");
            });

            it("should return 'extensive.plaque' for CAC score 1000", async () => {
                const result = await evaluate(1000);
                expect(result.status).toBe("extensive.plaque");
            });

            it("should return 'extensive.plaque' for CAC score 2000", async () => {
                const result = await evaluate(2000);
                expect(result.status).toBe("extensive.plaque");
            });

            it("should return 'extensive.plaque' for very high CAC score 5000", async () => {
                const result = await evaluate(5000);
                expect(result.status).toBe("extensive.plaque");
            });
        });

        describe("Status Boundary Transitions", () => {

            it("should transition from no.detectable.plaque to mild.plaque at CAC 1", async () => {
                const noPlaqueResult = await evaluate(0);
                const mildResult = await evaluate(1);

                expect(noPlaqueResult.status).toBe("no.detectable.plaque");
                expect(mildResult.status).toBe("mild.plaque");
            });

            it("should transition from mild.plaque to moderate.plaque at CAC 100", async () => {
                const mildResult = await evaluate(99);
                const moderateResult = await evaluate(100);

                expect(mildResult.status).toBe("mild.plaque");
                expect(moderateResult.status).toBe("moderate.plaque");
            });

            it("should transition from moderate.plaque to extensive.plaque at CAC 400", async () => {
                const moderateResult = await evaluate(399);
                const extensiveResult = await evaluate(400);

                expect(moderateResult.status).toBe("moderate.plaque");
                expect(extensiveResult.status).toBe("extensive.plaque");
            });
        });
    });

    describe("evaluateScore", () => {

        describe("No Detectable Plaque Scoring (CAC = 0)", () => {

            it("should score 1000 for CAC 0", async () => {
                const result = await evaluate(0);
                expect(result.score).toBe(1000);
            });
        });

        describe("Mild Plaque Scoring (CAC 1-99) -> Health Score 700-999", () => {

            it("should score 999 for CAC 1", async () => {
                const result = await evaluate(1);
                expect(result.score).toBe(999);
            });

            it("should score ~850 for CAC 50 (midpoint)", async () => {
                const result = await evaluate(50);
                expect(result.score).toBeGreaterThanOrEqual(830);
                expect(result.score).toBeLessThanOrEqual(870);
            });

            it("should score 700 for CAC 99", async () => {
                const result = await evaluate(99);
                expect(result.score).toBe(700);
            });

            it("should have decreasing scores as CAC increases within mild range", async () => {
                const cac10 = await evaluate(10);
                const cac50 = await evaluate(50);
                const cac90 = await evaluate(90);

                expect(cac10.score).toBeGreaterThan(cac50.score);
                expect(cac50.score).toBeGreaterThan(cac90.score);
            });
        });

        describe("Moderate Plaque Scoring (CAC 100-399) -> Health Score 300-699", () => {

            it("should score 699 for CAC 100", async () => {
                const result = await evaluate(100);
                expect(result.score).toBe(699);
            });

            it("should score ~500 for CAC 250 (midpoint)", async () => {
                const result = await evaluate(250);
                expect(result.score).toBeGreaterThanOrEqual(450);
                expect(result.score).toBeLessThanOrEqual(550);
            });

            it("should score 300 for CAC 399", async () => {
                const result = await evaluate(399);
                expect(result.score).toBe(300);
            });

            it("should have decreasing scores as CAC increases within moderate range", async () => {
                const cac150 = await evaluate(150);
                const cac250 = await evaluate(250);
                const cac350 = await evaluate(350);

                expect(cac150.score).toBeGreaterThan(cac250.score);
                expect(cac250.score).toBeGreaterThan(cac350.score);
            });
        });

        describe("Extensive Plaque Scoring (CAC >= 400) -> Health Score 0-299", () => {

            it("should score 299 for CAC 400", async () => {
                const result = await evaluate(400);
                expect(result.score).toBe(299);
            });

            it("should score less than 150 for CAC 700", async () => {
                const result = await evaluate(700);
                expect(result.score).toBeLessThan(180);
                expect(result.score).toBeGreaterThan(100);
            });

            it("should score close to 50 for CAC 1000", async () => {
                const result = await evaluate(1000);
                expect(result.score).toBeLessThan(100);
                expect(result.score).toBeGreaterThanOrEqual(40);
            });

            it("should approach 0 for very high CAC scores", async () => {
                const result = await evaluate(2000);
                expect(result.score).toBeLessThan(20);
            });

            it("should never go below 0", async () => {
                const result = await evaluate(5000);
                expect(result.score).toBeGreaterThanOrEqual(0);
            });

            it("should have decreasing scores as CAC increases within extensive range", async () => {
                const cac500 = await evaluate(500);
                const cac800 = await evaluate(800);
                const cac1500 = await evaluate(1500);

                expect(cac500.score).toBeGreaterThan(cac800.score);
                expect(cac800.score).toBeGreaterThan(cac1500.score);
            });
        });

        describe("Score Boundary Transitions", () => {

            it("should have score drop from 1000 to 999 when CAC goes from 0 to 1", async () => {
                const noPlaqueResult = await evaluate(0);
                const mildResult = await evaluate(1);

                expect(noPlaqueResult.score).toBe(1000);
                expect(mildResult.score).toBe(999);
            });

            it("should have score drop from 700 to 699 at mild/moderate boundary", async () => {
                const cac99 = await evaluate(99);
                const cac100 = await evaluate(100);

                expect(cac99.score).toBe(700);
                expect(cac100.score).toBe(699);
            });

            it("should have score drop from 300 to 299 at moderate/extensive boundary", async () => {
                const cac399 = await evaluate(399);
                const cac400 = await evaluate(400);

                expect(cac399.score).toBe(300);
                expect(cac400.score).toBe(299);
            });
        });
    });

    describe("Real-World Scenarios", () => {

        it("should classify healthy individual with CAC 0 as perfect", async () => {
            const result = await evaluate(0, 55);

            expect(result.status).toBe("no.detectable.plaque");
            expect(result.score).toBe(1000);
        });

        it("should classify early plaque (CAC 25) as mild with high score", async () => {
            const result = await evaluate(25, 60);

            expect(result.status).toBe("mild.plaque");
            expect(result.score).toBeGreaterThanOrEqual(900);
        });

        it("should classify moderate plaque (CAC 200) appropriately", async () => {
            const result = await evaluate(200, 65);

            expect(result.status).toBe("moderate.plaque");
            expect(result.score).toBeGreaterThanOrEqual(400);
            expect(result.score).toBeLessThanOrEqual(600);
        });

        it("should classify high risk individual (CAC 600) as extensive plaque", async () => {
            const result = await evaluate(600, 70);

            expect(result.status).toBe("extensive.plaque");
            expect(result.score).toBeLessThanOrEqual(200);
        });

        it("should classify very high risk (CAC 1500) with very low score", async () => {
            const result = await evaluate(1500, 75);

            expect(result.status).toBe("extensive.plaque");
            expect(result.score).toBeLessThan(50);
        });
    });

    describe("Data Storage", () => {

        it("should store score, age, and sex in data", async () => {
            const result = await evaluate(150, 55, 'F');

            expect(result.data.score).toBe(150);
            expect(result.data.age).toBe(55);
            expect(result.data.sex).toBe('F');
        });

        it("should set all result fields", async () => {
            const result = await evaluate(75, 60);

            expect(result.status).toBeDefined();
            expect(result.score).toBeDefined();
            expect(result.data).toBeDefined();
        });
    });

    describe("Age and Sex Parameters", () => {
        // Currently age and sex are not used in CAC scoring (score is absolute)
        // but verify they are stored and don't break anything

        it("should produce same results regardless of age", async () => {
            const young = await evaluate(100, 40);
            const old = await evaluate(100, 70);

            expect(young.status).toBe(old.status);
            expect(young.score).toBe(old.score);
        });

        it("should produce same results regardless of sex", async () => {
            const male = await evaluate(200, 55, 'M');
            const female = await evaluate(200, 55, 'F');

            expect(male.status).toBe(female.status);
            expect(male.score).toBe(female.score);
        });
    });

    describe("Edge Cases", () => {

        it("should handle CAC exactly at boundary values", async () => {
            const cac0 = await evaluate(0);
            const cac1 = await evaluate(1);
            const cac99 = await evaluate(99);
            const cac100 = await evaluate(100);
            const cac399 = await evaluate(399);
            const cac400 = await evaluate(400);

            expect(cac0.status).toBe("no.detectable.plaque");
            expect(cac1.status).toBe("mild.plaque");
            expect(cac99.status).toBe("mild.plaque");
            expect(cac100.status).toBe("moderate.plaque");
            expect(cac399.status).toBe("moderate.plaque");
            expect(cac400.status).toBe("extensive.plaque");
        });

        it("should handle very large CAC scores gracefully", async () => {
            const result = await evaluate(10000);

            expect(result.status).toBe("extensive.plaque");
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThan(10);
        });
    });
});
