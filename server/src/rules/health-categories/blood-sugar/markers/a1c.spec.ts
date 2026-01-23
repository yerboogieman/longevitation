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
});
