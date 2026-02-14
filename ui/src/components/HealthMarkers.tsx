import {useState, useMemo, useRef, useEffect} from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import MoreModule from "highcharts/highcharts-more";
import SolidGaugeModule from "highcharts/modules/solid-gauge";

if (typeof MoreModule === "function") {
    (MoreModule as any)(Highcharts);
}
if (typeof SolidGaugeModule === "function") {
    (SolidGaugeModule as any)(Highcharts);
}

interface HealthMarkersProps {
    categoryId: string;
    categoryLabel: string;
    inactiveColor: string;
}

interface MarkerData {
    id: string;
    name: string;
    value: string | number;
    unit: string;
    score: number;
    status: "optimal" | "good" | "fair" | "needs-attention";
    description: string;
    optimalRange: string;
    lastUpdated: string;
    trend: "improving" | "stable" | "declining";
    recommendations: string[];
}

const mockMarkersByCategory: Record<string, MarkerData[]> = {
    "blood-sugar": [
        {id: "a1c", name: "HbA1c", value: 5.4, unit: "%", score: 85, status: "optimal", description: "Hemoglobin A1c measures your average blood sugar over the past 2-3 months.", optimalRange: "Below 5.7%", lastUpdated: "2025-01-15", trend: "stable", recommendations: ["Maintain current diet", "Continue regular exercise"]},
        {id: "fasting-glucose", name: "Fasting Glucose", value: 92, unit: "mg/dL", score: 78, status: "good", description: "Blood sugar level after fasting for at least 8 hours.", optimalRange: "70-99 mg/dL", lastUpdated: "2025-01-15", trend: "improving", recommendations: ["Consider reducing refined carbohydrates", "Monitor after meals"]},
        {id: "homa-ir", name: "HOMA-IR", value: 1.2, unit: "", score: 80, status: "good", description: "Homeostatic Model Assessment for Insulin Resistance indicates how well your body uses insulin.", optimalRange: "Below 1.0", lastUpdated: "2025-01-15", trend: "stable", recommendations: ["Maintain healthy weight", "Include resistance training"]},
    ],
    "body-composition": [
        {id: "bmi", name: "BMI", value: 23.5, unit: "kg/m²", score: 82, status: "good", description: "Body Mass Index is a measure of body fat based on height and weight.", optimalRange: "18.5-24.9 kg/m²", lastUpdated: "2025-01-20", trend: "stable", recommendations: ["Maintain current activity level", "Focus on muscle preservation"]},
        {id: "body-fat", name: "Body Fat %", value: 18, unit: "%", score: 75, status: "good", description: "Percentage of total body weight that is fat tissue.", optimalRange: "10-20% (men), 18-28% (women)", lastUpdated: "2025-01-20", trend: "improving", recommendations: ["Continue strength training", "Ensure adequate protein intake"]},
        {id: "waist-height", name: "Waist-to-Height Ratio", value: 0.45, unit: "", score: 88, status: "optimal", description: "Ratio of waist circumference to height, indicating central obesity risk.", optimalRange: "Below 0.5", lastUpdated: "2025-01-20", trend: "stable", recommendations: ["Maintain current waist measurement", "Continue core exercises"]},
    ],
    "cardiovascular": [
        {id: "blood-pressure", name: "Blood Pressure", value: "118/76", unit: "mmHg", score: 90, status: "optimal", description: "Measures the force of blood against artery walls.", optimalRange: "Below 120/80 mmHg", lastUpdated: "2025-01-22", trend: "stable", recommendations: ["Continue low sodium diet", "Maintain regular cardio exercise"]},
        {id: "resting-hr", name: "Resting Heart Rate", value: 62, unit: "bpm", score: 85, status: "optimal", description: "Heart rate when fully rested, indicating cardiovascular fitness.", optimalRange: "60-100 bpm (lower is better)", lastUpdated: "2025-01-22", trend: "improving", recommendations: ["Continue aerobic training", "Practice stress management"]},
        {id: "hrv", name: "HRV", value: 45, unit: "ms", score: 72, status: "good", description: "Heart Rate Variability measures variation in time between heartbeats.", optimalRange: "Above 50 ms", lastUpdated: "2025-01-22", trend: "stable", recommendations: ["Prioritize quality sleep", "Consider meditation practice"]},
        {id: "vo2-max", name: "VO2 Max", value: 42, unit: "mL/kg/min", score: 78, status: "good", description: "Maximum oxygen uptake during intense exercise, indicating aerobic capacity.", optimalRange: "Above 45 mL/kg/min", lastUpdated: "2025-01-22", trend: "improving", recommendations: ["Add interval training", "Increase workout intensity gradually"]},
    ],
    "dental": [
        {id: "plaque-index", name: "Plaque Index", value: 0.8, unit: "", score: 88, status: "optimal", description: "Measures the amount of dental plaque on teeth surfaces.", optimalRange: "Below 1.0", lastUpdated: "2025-01-10", trend: "stable", recommendations: ["Continue twice-daily brushing", "Maintain flossing routine"]},
        {id: "gum-health", name: "Gum Health Score", value: 85, unit: "%", score: 85, status: "optimal", description: "Overall assessment of gum tissue health and inflammation.", optimalRange: "Above 80%", lastUpdated: "2025-01-10", trend: "stable", recommendations: ["Continue current oral hygiene", "Schedule regular cleanings"]},
    ],
    "existing-conditions": [
        {id: "condition-management", name: "Condition Management", value: "Well Managed", unit: "", score: 98, status: "optimal", description: "Assessment of how well existing health conditions are being controlled.", optimalRange: "Well Managed", lastUpdated: "2025-01-18", trend: "stable", recommendations: ["Continue current treatment plan", "Maintain regular check-ups"]},
    ],
    "flexibility": [
        {id: "sit-reach", name: "Sit & Reach", value: 8, unit: "cm", score: 82, status: "good", description: "Measures flexibility of lower back and hamstrings.", optimalRange: "Above 10 cm", lastUpdated: "2025-01-19", trend: "improving", recommendations: ["Add daily stretching routine", "Try yoga or pilates"]},
        {id: "shoulder-mobility", name: "Shoulder Mobility", value: 95, unit: "%", score: 90, status: "optimal", description: "Range of motion assessment for shoulder joints.", optimalRange: "Above 90%", lastUpdated: "2025-01-19", trend: "stable", recommendations: ["Maintain stretching routine", "Continue mobility exercises"]},
    ],
    "gut-health": [
        {id: "microbiome-diversity", name: "Microbiome Diversity", value: 72, unit: "%", score: 65, status: "fair", description: "Variety of beneficial bacteria in the digestive system.", optimalRange: "Above 80%", lastUpdated: "2025-01-17", trend: "improving", recommendations: ["Increase fiber intake", "Add fermented foods to diet", "Consider probiotic supplement"]},
        {id: "inflammation-markers", name: "Inflammation Markers", value: "Low", unit: "", score: 70, status: "good", description: "Indicators of gut inflammation and digestive health.", optimalRange: "Low", lastUpdated: "2025-01-17", trend: "stable", recommendations: ["Avoid inflammatory foods", "Maintain anti-inflammatory diet"]},
    ],
    "skin": [
        {id: "hydration", name: "Skin Hydration", value: 68, unit: "%", score: 65, status: "fair", description: "Moisture level in skin tissue.", optimalRange: "Above 75%", lastUpdated: "2025-01-21", trend: "stable", recommendations: ["Increase water intake", "Use hydrating moisturizer", "Consider humidifier"]},
        {id: "elasticity", name: "Skin Elasticity", value: 72, unit: "%", score: 70, status: "good", description: "Ability of skin to return to original shape after stretching.", optimalRange: "Above 75%", lastUpdated: "2025-01-21", trend: "stable", recommendations: ["Use sunscreen daily", "Consider collagen supplement", "Maintain hydration"]},
    ],
};

function getStatusColor(status: MarkerData["status"]): string {
    switch (status) {
        case "optimal":
            return "#55BF3B";
        case "good":
            return "#7cb342";
        case "fair":
            return "#DDDF0D";
        case "needs-attention":
            return "#DF5353";
        default:
            return "#6c757d";
    }
}

function getStatusLabel(status: MarkerData["status"]): string {
    switch (status) {
        case "optimal":
            return "Optimal";
        case "good":
            return "Good";
        case "fair":
            return "Fair";
        case "needs-attention":
            return "Needs Attention";
        default:
            return "Unknown";
    }
}

interface MarkerGaugeProps {
    score: number;
    inactiveColor: string;
}

function MarkerGauge({score, inactiveColor}: MarkerGaugeProps) {
    const gaugeOptions: Highcharts.Options = useMemo(() => ({
        chart: {
            type: "solidgauge",
            height: 56,
            width: 56,
            backgroundColor: "transparent",
            margin: [0, 0, 0, 0],
            spacing: [0, 0, 0, 0]
        },
        title: undefined,
        pane: {
            center: ["50%", "50%"],
            size: "100%",
            startAngle: -90,
            endAngle: 90,
            background: [{
                backgroundColor: Highcharts.color(inactiveColor).setOpacity(0.2).get(),
                innerRadius: "60%",
                outerRadius: "100%",
                shape: "arc",
                borderWidth: 0
            }]
        },
        exporting: {enabled: false},
        tooltip: {enabled: false},
        credits: {enabled: false},
        yAxis: {
            min: 0,
            max: 100,
            stops: [
                [0.3, "#DF5353"],
                [0.6, "#DDDF0D"],
                [0.9, "#55BF3B"]
            ],
            lineWidth: 0,
            tickWidth: 0,
            minorTickInterval: undefined,
            tickAmount: 0,
            labels: {enabled: false}
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: true,
                    y: -8,
                    borderWidth: 0,
                    format: `<span style="font-size:11px;font-weight:bold;color:${inactiveColor}">{y}</span>`
                }
            }
        },
        series: [{
            type: "solidgauge",
            name: "Score",
            data: [score],
            innerRadius: "60%"
        }]
    }), [score, inactiveColor]);

    return <HighchartsReact highcharts={Highcharts} options={gaugeOptions} />;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function getTrendIcon(trend: MarkerData["trend"]): string {
    switch (trend) {
        case "improving":
            return "M7 14l5-5 5 5H7z";
        case "declining":
            return "M7 10l5 5 5-5H7z";
        default:
            return "M4 11h16v2H4z";
    }
}

function getTrendColor(trend: MarkerData["trend"]): string {
    switch (trend) {
        case "improving":
            return "#55BF3B";
        case "declining":
            return "#DF5353";
        default:
            return "#6c757d";
    }
}

type MarkerTab = "overview" | "chart" | "stats";

interface MarkerTabItem {
    id: MarkerTab;
    label: string;
    icon: string;
}

const markerTabItems: MarkerTabItem[] = [
    {id: "overview", label: "Overview", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"},
    {id: "chart", label: "Chart", icon: "M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z"},
    {id: "stats", label: "Stats", icon: "M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"},
];

function HealthMarkers({categoryId, categoryLabel, inactiveColor}: HealthMarkersProps) {
    const markers = mockMarkersByCategory[categoryId] || [];
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [explicitClose, setExplicitClose] = useState<string | null>(null);
    const [selectedTabs, setSelectedTabs] = useState<Record<string, MarkerTab>>({});
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [heights, setHeights] = useState<Record<string, number>>({});

    useEffect(() => {
        const newHeights: Record<string, number> = {};
        Object.entries(contentRefs.current).forEach(([id, ref]) => {
            if (ref) {
                newHeights[id] = ref.scrollHeight;
            }
        });
        setHeights(newHeights);
    }, [openAccordion, selectedTabs]);

    const toggleAccordion = (markerId: string) => {
        if (openAccordion === markerId) {
            setExplicitClose(markerId);
            setOpenAccordion(null);
        } else {
            setExplicitClose(null);
            setOpenAccordion(markerId);
        }
    };

    const getSelectedTab = (markerId: string): MarkerTab => {
        return selectedTabs[markerId] || "overview";
    };

    const setSelectedTab = (markerId: string, tab: MarkerTab) => {
        setSelectedTabs(prev => ({...prev, [markerId]: tab}));
    };

    if (markers.length === 0) {
        return (
            <div style={{color: inactiveColor, textAlign: "center", padding: "32px"}}>
                <p>No markers available for {categoryLabel}.</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{marginBottom: "16px"}}>
                <h6 style={{color: inactiveColor, margin: 0, fontWeight: 600}}>
                    Key Markers for {categoryLabel}
                </h6>
                <p style={{color: inactiveColor, opacity: 0.7, fontSize: "13px", margin: "4px 0 0 0"}}>
                    These metrics are used to calculate your {categoryLabel.toLowerCase()} score.
                </p>
            </div>
            <div className="accordion" style={{marginRight: "16px"}}>
                {markers.map((marker) => {
                    const isOpen = openAccordion === marker.id;
                    return (
                        <div className="accordion-item" key={marker.id} style={{border: "1px solid #dee2e6", borderRadius: "8px", marginBottom: "12px", overflow: "hidden"}}>
                            <div className="accordion-header" style={{position: "relative", backgroundColor: "#f8f9fa", borderRadius: isOpen ? "8px 8px 0 0" : "8px"}}>
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(marker.id)}
                                    style={{
                                        backgroundColor: "transparent",
                                        padding: "12px 16px",
                                        paddingRight: "16px",
                                        paddingBottom: isOpen ? "0" : "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                        boxShadow: "none",
                                        position: "relative",
                                        width: "100%",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        textAlign: "left",
                                    }}
                                >
                                    <div style={{flex: "0 0 140px"}}>
                                        <div style={{fontWeight: 600, color: inactiveColor, marginBottom: "2px", fontSize: "14px"}}>
                                            {marker.name}
                                        </div>
                                        <div style={{fontSize: "18px", fontWeight: 700, color: "#333"}}>
                                            {marker.value}
                                            {marker.unit && (
                                                <span style={{fontSize: "12px", fontWeight: 400, color: inactiveColor, marginLeft: "4px"}}>
                                                    {marker.unit}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{
                                        backgroundColor: getStatusColor(marker.status),
                                        color: "#fff",
                                        padding: "4px 12px",
                                        borderRadius: "12px",
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        minWidth: "70px",
                                        textAlign: "center",
                                    }}>
                                        {getStatusLabel(marker.status)}
                                    </div>
                                    <div style={{
                                        marginLeft: "auto",
                                        marginRight: "24px",
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "-20px",
                                    }}>
                                        <MarkerGauge score={marker.score} inactiveColor={inactiveColor} />
                                    </div>
                                </button>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={inactiveColor}
                                    width="16"
                                    height="16"
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "12px",
                                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.2s ease",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <path d="M7 10l5 5 5-5H7z" />
                                </svg>
                                {isOpen && (
                                    <div style={{
                                        position: "absolute",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        bottom: "0",
                                        display: "flex",
                                        alignItems: "flex-end",
                                    }}>
                                        <ul style={{
                                            display: "flex",
                                            listStyle: "none",
                                            margin: 0,
                                            padding: 0,
                                            gap: 0,
                                        }}>
                                            {markerTabItems.map((tab) => {
                                                const isSelected = getSelectedTab(marker.id) === tab.id;
                                                const isHovered = hoveredTab === `${marker.id}-${tab.id}`;
                                                return (
                                                    <li key={tab.id}>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedTab(marker.id, tab.id);
                                                            }}
                                                            onMouseEnter={() => setHoveredTab(`${marker.id}-${tab.id}`)}
                                                            onMouseLeave={() => setHoveredTab(null)}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                padding: "6px 10px",
                                                                border: "none",
                                                                background: "none",
                                                                cursor: "pointer",
                                                                color: inactiveColor,
                                                                borderBottom: isSelected ? "2px solid #0d6efd" : "2px solid transparent",
                                                                opacity: isSelected ? 1 : (isHovered ? 0.8 : 0.7),
                                                                transition: "all 0.15s ease",
                                                                fontSize: "13px",
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                width="14"
                                                                height="14"
                                                            >
                                                                <path d={tab.icon} />
                                                            </svg>
                                                            {tab.label}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div
                                ref={(el) => { contentRefs.current[marker.id] = el; }}
                                style={{
                                    overflow: "hidden",
                                    height: isOpen ? (heights[marker.id] || "auto") : 0,
                                    transition: (!isOpen && explicitClose !== marker.id) ? "none" : "height 0.3s ease",
                                }}
                            >
                                <div className="accordion-body" style={{padding: "16px", backgroundColor: "#fff", borderTop: "1px solid #dee2e6"}}>
                                    {getSelectedTab(marker.id) === "overview" && (
                                        <>
                                            <p style={{color: inactiveColor, fontSize: "13px", marginBottom: "16px"}}>
                                                {marker.description}
                                            </p>
                                            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px"}}>
                                                <div>
                                                    <div style={{fontSize: "11px", color: inactiveColor, opacity: 0.7, marginBottom: "4px"}}>Optimal Range</div>
                                                    <div style={{fontSize: "13px", fontWeight: 600, color: "#333"}}>{marker.optimalRange}</div>
                                                </div>
                                                <div>
                                                    <div style={{fontSize: "11px", color: inactiveColor, opacity: 0.7, marginBottom: "4px"}}>Last Updated</div>
                                                    <div style={{fontSize: "13px", fontWeight: 600, color: "#333"}}>{formatDate(marker.lastUpdated)}</div>
                                                </div>
                                                <div>
                                                    <div style={{fontSize: "11px", color: inactiveColor, opacity: 0.7, marginBottom: "4px"}}>Trend</div>
                                                    <div style={{display: "flex", alignItems: "center", gap: "4px"}}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={getTrendColor(marker.trend)} width="16" height="16">
                                                            <path d={getTrendIcon(marker.trend)} />
                                                        </svg>
                                                        <span style={{fontSize: "13px", fontWeight: 600, color: getTrendColor(marker.trend), textTransform: "capitalize"}}>
                                                            {marker.trend}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {marker.recommendations.length > 0 && (
                                                <div>
                                                    <div style={{fontSize: "11px", color: inactiveColor, opacity: 0.7, marginBottom: "8px"}}>Recommendations</div>
                                                    <ul style={{margin: 0, paddingLeft: "20px"}}>
                                                        {marker.recommendations.map((rec, index) => (
                                                            <li key={index} style={{fontSize: "13px", color: "#333", marginBottom: "4px"}}>{rec}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {getSelectedTab(marker.id) === "chart" && (
                                        <div style={{color: inactiveColor, fontSize: "13px", padding: "24px", textAlign: "center"}}>
                                            TODO: create chart component for this marker.
                                        </div>
                                    )}
                                    {getSelectedTab(marker.id) === "stats" && (
                                        <div style={{color: inactiveColor, fontSize: "13px", padding: "24px", textAlign: "center"}}>
                                            TODO: create stat component for this marker.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default HealthMarkers;
