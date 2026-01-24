import nools from "nools";
import * as path from "path";

describe("resting-heart-rate.nools", () => {

    let flow: any;
    let RestingHeartRate: any;
    let ScoreResult: any;

    beforeAll(() => {
        flow = nools.compile(path.join(__dirname, "resting-heart-rate.nools"));
        RestingHeartRate = flow.getDefined("RestingHeartRate");
        ScoreResult = flow.getDefined("ScoreResult");
    });

    async function evaluateRestingHeartRate(value: number, hasLowRHRSymptoms: boolean = false): Promise<any> {

        const restingHeartRate = new RestingHeartRate({ value, hasLowRHRSymptoms });

        const result = new ScoreResult();
        const session = flow.getSession(restingHeartRate, result);

        await session.match();
        session.dispose();

        return result;
    }

    describe("Resting Heart Rate Categories", () => {

        describe("Low RHR (< 40 bpm or < 45 bpm with symptoms)", () => {

            it("should classify as low.rhr below 40 bpm (35 bpm)", async () => {

                const result = await evaluateRestingHeartRate(35);

                expect(result.status).toBe("low.rhr");
            });

            it("should classify as low.rhr at 39 bpm", async () => {

                const result = await evaluateRestingHeartRate(39);

                expect(result.status).toBe("low.rhr");
            });

            it("should classify as low.rhr at 30 bpm", async () => {

                const result = await evaluateRestingHeartRate(30);

                expect(result.status).toBe("low.rhr");
            });

            it("should classify as low.rhr at 42 bpm with low RHR symptoms", async () => {

                const result = await evaluateRestingHeartRate(42, true);

                expect(result.status).toBe("low.rhr");
            });

            it("should classify as low.rhr at 44 bpm with low RHR symptoms", async () => {

                const result = await evaluateRestingHeartRate(44, true);

                expect(result.status).toBe("low.rhr");
            });

            it("should classify as excellent.athletic at 42 bpm without symptoms", async () => {

                const result = await evaluateRestingHeartRate(42, false);

                expect(result.status).toBe("excellent.athletic");
            });

            it("should classify as excellent.athletic at 45 bpm even with symptoms", async () => {

                const result = await evaluateRestingHeartRate(45, true);

                expect(result.status).toBe("excellent.athletic");
            });
        });

        describe("Excellent/Athletic (40-50 bpm)", () => {

            it("should classify as excellent.athletic at lower boundary (40 bpm)", async () => {

                const result = await evaluateRestingHeartRate(40);

                expect(result.status).toBe("excellent.athletic");
            });

            it("should classify as excellent.athletic at mid-range (45 bpm)", async () => {

                const result = await evaluateRestingHeartRate(45);

                expect(result.status).toBe("excellent.athletic");
            });

            it("should classify as excellent.athletic at upper boundary (50 bpm)", async () => {

                const result = await evaluateRestingHeartRate(50);

                expect(result.status).toBe("excellent.athletic");
            });

            it("should classify as excellent.athletic for very low athletic heart rate (42 bpm)", async () => {

                const result = await evaluateRestingHeartRate(42);

                expect(result.status).toBe("excellent.athletic");
            });
        });

        describe("Very Good (51-60 bpm)", () => {

            it("should classify as very.good at lower boundary (51 bpm)", async () => {

                const result = await evaluateRestingHeartRate(51);

                expect(result.status).toBe("very.good");
            });

            it("should classify as very.good at mid-range (55 bpm)", async () => {

                const result = await evaluateRestingHeartRate(55);

                expect(result.status).toBe("very.good");
            });

            it("should classify as very.good at upper boundary (60 bpm)", async () => {

                const result = await evaluateRestingHeartRate(60);

                expect(result.status).toBe("very.good");
            });

            it("should classify as very.good for typical fit person (58 bpm)", async () => {

                const result = await evaluateRestingHeartRate(58);

                expect(result.status).toBe("very.good");
            });
        });

        describe("Normal/Healthy (61-70 bpm)", () => {

            it("should classify as normal.healthy at lower boundary (61 bpm)", async () => {

                const result = await evaluateRestingHeartRate(61);

                expect(result.status).toBe("normal.healthy");
            });

            it("should classify as normal.healthy at mid-range (65 bpm)", async () => {

                const result = await evaluateRestingHeartRate(65);

                expect(result.status).toBe("normal.healthy");
            });

            it("should classify as normal.healthy at upper boundary (70 bpm)", async () => {

                const result = await evaluateRestingHeartRate(70);

                expect(result.status).toBe("normal.healthy");
            });

            it("should classify as normal.healthy for typical adult (68 bpm)", async () => {

                const result = await evaluateRestingHeartRate(68);

                expect(result.status).toBe("normal.healthy");
            });
        });

        describe("Fair (71-80 bpm)", () => {

            it("should classify as fair at lower boundary (71 bpm)", async () => {

                const result = await evaluateRestingHeartRate(71);

                expect(result.status).toBe("fair");
            });

            it("should classify as fair at mid-range (75 bpm)", async () => {

                const result = await evaluateRestingHeartRate(75);

                expect(result.status).toBe("fair");
            });

            it("should classify as fair at upper boundary (80 bpm)", async () => {

                const result = await evaluateRestingHeartRate(80);

                expect(result.status).toBe("fair");
            });

            it("should classify as fair for sedentary adult (78 bpm)", async () => {

                const result = await evaluateRestingHeartRate(78);

                expect(result.status).toBe("fair");
            });
        });

        describe("Elevated (81-90 bpm)", () => {

            it("should classify as elevated at lower boundary (81 bpm)", async () => {

                const result = await evaluateRestingHeartRate(81);

                expect(result.status).toBe("elevated");
            });

            it("should classify as elevated at mid-range (85 bpm)", async () => {

                const result = await evaluateRestingHeartRate(85);

                expect(result.status).toBe("elevated");
            });

            it("should classify as elevated at upper boundary (90 bpm)", async () => {

                const result = await evaluateRestingHeartRate(90);

                expect(result.status).toBe("elevated");
            });

            it("should classify as elevated for stressed individual (88 bpm)", async () => {

                const result = await evaluateRestingHeartRate(88);

                expect(result.status).toBe("elevated");
            });
        });

        describe("High/Concerning if Persistent (91+ bpm)", () => {

            it("should classify as high.concerning.if.persistent at lower boundary (91 bpm)", async () => {

                const result = await evaluateRestingHeartRate(91);

                expect(result.status).toBe("high.concerning.if.persistent");
            });

            it("should classify as high.concerning.if.persistent at 95 bpm", async () => {

                const result = await evaluateRestingHeartRate(95);

                expect(result.status).toBe("high.concerning.if.persistent");
            });

            it("should classify as high.concerning.if.persistent at 100 bpm", async () => {

                const result = await evaluateRestingHeartRate(100);

                expect(result.status).toBe("high.concerning.if.persistent");
            });

            it("should classify as high.concerning.if.persistent for very high heart rate (110 bpm)", async () => {

                const result = await evaluateRestingHeartRate(110);

                expect(result.status).toBe("high.concerning.if.persistent");
            });

            it("should classify as high.concerning.if.persistent for tachycardia range (120 bpm)", async () => {

                const result = await evaluateRestingHeartRate(120);

                expect(result.status).toBe("high.concerning.if.persistent");
            });
        });
    });

    describe("Boundary Transitions", () => {

        it("should transition from low.rhr to excellent.athletic at 39/40 boundary", async () => {

            const at39 = await evaluateRestingHeartRate(39);
            const at40 = await evaluateRestingHeartRate(40);

            expect(at39.status).toBe("low.rhr");
            expect(at40.status).toBe("excellent.athletic");
        });

        it("should transition from excellent.athletic to very.good at 50/51 boundary", async () => {

            const at50 = await evaluateRestingHeartRate(50);
            const at51 = await evaluateRestingHeartRate(51);

            expect(at50.status).toBe("excellent.athletic");
            expect(at51.status).toBe("very.good");
        });

        it("should transition from very.good to normal.healthy at 60/61 boundary", async () => {

            const at60 = await evaluateRestingHeartRate(60);
            const at61 = await evaluateRestingHeartRate(61);

            expect(at60.status).toBe("very.good");
            expect(at61.status).toBe("normal.healthy");
        });

        it("should transition from normal.healthy to fair at 70/71 boundary", async () => {

            const at70 = await evaluateRestingHeartRate(70);
            const at71 = await evaluateRestingHeartRate(71);

            expect(at70.status).toBe("normal.healthy");
            expect(at71.status).toBe("fair");
        });

        it("should transition from fair to elevated at 80/81 boundary", async () => {

            const at80 = await evaluateRestingHeartRate(80);
            const at81 = await evaluateRestingHeartRate(81);

            expect(at80.status).toBe("fair");
            expect(at81.status).toBe("elevated");
        });

        it("should transition from elevated to high.concerning.if.persistent at 90/91 boundary", async () => {

            const at90 = await evaluateRestingHeartRate(90);
            const at91 = await evaluateRestingHeartRate(91);

            expect(at90.status).toBe("elevated");
            expect(at91.status).toBe("high.concerning.if.persistent");
        });
    });

    describe("Edge Cases", () => {

        it("should handle extremely low heart rate (35 bpm) as low.rhr", async () => {

            const result = await evaluateRestingHeartRate(35);

            expect(result.status).toBe("low.rhr");
        });

        it("should handle borderline bradycardia (39 bpm) as low.rhr", async () => {

            const result = await evaluateRestingHeartRate(39);

            expect(result.status).toBe("low.rhr");
        });

        it("should handle extremely high heart rate (150 bpm)", async () => {

            const result = await evaluateRestingHeartRate(150);

            expect(result.status).toBe("high.concerning.if.persistent");
        });
    });

    describe("Typical Real-World Scenarios", () => {

        it("should classify elite endurance athlete (48 bpm)", async () => {

            const result = await evaluateRestingHeartRate(48);

            expect(result.status).toBe("excellent.athletic");
        });

        it("should classify regular exerciser (57 bpm)", async () => {

            const result = await evaluateRestingHeartRate(57);

            expect(result.status).toBe("very.good");
        });

        it("should classify average healthy adult (66 bpm)", async () => {

            const result = await evaluateRestingHeartRate(66);

            expect(result.status).toBe("normal.healthy");
        });

        it("should classify deconditioned adult (76 bpm)", async () => {

            const result = await evaluateRestingHeartRate(76);

            expect(result.status).toBe("fair");
        });

        it("should classify chronically stressed individual (86 bpm)", async () => {

            const result = await evaluateRestingHeartRate(86);

            expect(result.status).toBe("elevated");
        });

        it("should classify person with potential health concern (98 bpm)", async () => {

            const result = await evaluateRestingHeartRate(98);

            expect(result.status).toBe("high.concerning.if.persistent");
        });
    });
});
