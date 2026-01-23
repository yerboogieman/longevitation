import nools from "nools";
import * as path from "path";

const flow = nools.compile(path.join(__dirname, "blood-pressure.nools"));
const MarkerData = flow.getDefined("BloodPressure");
const ScoreResult = flow.getDefined("ScoreResult");

async function evaluateMarkerData(markerData: any): Promise<{ score: string }> {

    const markerDataWrapper = new MarkerData(markerData);
    const result = new ScoreResult();
    const session = flow.getSession(markerDataWrapper, result);

    await session.match();
    session.dispose();

    return result;
}

// Example usage with different credit scores
async function main() {

    const markerData = {
        systolic: 118,
        diastolic: 76,
        hasHypertensionSymptoms: false
    };

    const result = await evaluateMarkerData(markerData);
    console.log(`Marker evaluation result: ${JSON.stringify(result)}`);
}

main();
