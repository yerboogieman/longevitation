import {useState, useMemo} from "react";
import {useOutletContext} from "react-router-dom";
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

import heartIcon from "../assets/heart.svg";
import humanBodyIcon from "../assets/human-body.svg";
import gutsIcon from "../assets/guts.svg";
import healthyFoodIcon from "../assets/healthy-food.svg";
import exerciseIcon from "../assets/exercise.svg";
import sleepIcon from "../assets/sleep.svg";
import cigaretteIcon from "../assets/cigarette.svg";
import toothIcon from "../assets/tooth.svg";
import medicalHistoryIcon from "../assets/medical-history.svg";

import cardiovascularHeaderIcon from "../assets/category-header/cardiovascular.svg";
import bodyCompositionHeaderIcon from "../assets/category-header/body-composition.svg";
import gutHealthHeaderIcon from "../assets/category-header/gut-health.svg";
import dietHeaderIcon from "../assets/category-header/diet.svg";
import exerciseHeaderIcon from "../assets/category-header/exercise.svg";
import sleepHeaderIcon from "../assets/category-header/sleep.svg";
import vicesHeaderIcon from "../assets/category-header/vices.svg";
import dentalHeaderIcon from "../assets/category-header/dental-health.svg";
import existingConditionsHeaderIcon from "../assets/category-header/existing-conditions.svg";

interface HealthCategory {
    id: string;
    label: string;
    icon: string;
    headerIcon: string;
    score: number;
}

interface StylesContext {
    inactiveColor: string;
    inactiveBackgroundColor: string;
}

const healthCategories: HealthCategory[] = [
    {
        id: "cardiovascular",
        label: "Cardiovascular",
        icon: heartIcon,
        headerIcon: cardiovascularHeaderIcon,
        score: 83
    },
    {
        id: "body-composition",
        label: "Body Composition",
        icon: humanBodyIcon,
        headerIcon: bodyCompositionHeaderIcon,
        score: 75
    },
    {
        id: "gut-health",
        label: "Gut Health",
        icon: gutsIcon,
        headerIcon: gutHealthHeaderIcon,
        score: 65
    },
    {
        id: "diet",
        label: "Diet",
        icon: healthyFoodIcon,
        headerIcon: dietHeaderIcon,
        score: 45
    },
    {
        id: "exercise",
        label: "Exercise",
        icon: exerciseIcon,
        headerIcon: exerciseHeaderIcon,
        score: 78
    },
    {
        id: "sleep",
        label: "Sleep",
        icon: sleepIcon,
        headerIcon: sleepHeaderIcon,
        score: 72
    },
    {
        id: "vices",
        label: "Vices",
        icon: cigaretteIcon,
        headerIcon: vicesHeaderIcon,
        score: 70
    },
    {
        id: "dental",
        label: "Dental",
        icon: toothIcon,
        headerIcon: dentalHeaderIcon,
        score: 89
    },
    {
        id: "existing-conditions",
        label: "Existing Conditions",
        icon: medicalHistoryIcon,
        headerIcon: existingConditionsHeaderIcon,
        score: 98
    }
];

function HealthCategories() {

    const styles = useOutletContext<StylesContext>();
    const {inactiveColor, inactiveBackgroundColor} = styles;

    const [selectedCategory, setSelectedCategory] = useState<string>("cardiovascular");
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const hoverBackgroundColor = "#d8dfe9";
    const isFirstItemSelected = selectedCategory === healthCategories[0].id;
    const selectedCategoryData = healthCategories.find(c => c.id === selectedCategory);

    const gaugeOptions: Highcharts.Options = useMemo(() => ({
        chart: {
            type: "solidgauge",
            height: 80,
            width: 80,
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
                    y: -10,
                    borderWidth: 0,
                    format: `<span style="font-size:14px;font-weight:bold;color:${inactiveColor}">{y}</span>`
                }
            }
        },
        series: [{
            type: "solidgauge",
            name: "Score",
            data: [selectedCategoryData?.score ?? 0],
            innerRadius: "60%"
        }]
    }), [selectedCategoryData?.score, inactiveColor]);

    return (
        <div style={{display: "flex", flex: 1, overflow: "hidden"}}>
            <div style={{width: "200px", flexShrink: 0, backgroundColor: inactiveBackgroundColor, borderRight: "1px solid #dee2e6", height: "100%", position: "relative"}}>
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: isFirstItemSelected ? "5px" : 0,
                    right: 0,
                    height: "1px",
                    backgroundColor: "#dee2e6",
                    zIndex: 10
                }}/>
                <ul className="list-group list-group-flush">
                    {healthCategories.map((category, index) => {
                        const selectedIndex = healthCategories.findIndex(c => c.id === selectedCategory);
                        const isSelected = selectedCategory === category.id;
                        const isAboveSelected = index === selectedIndex - 1;
                        const isFirstItem = index === 0;
                        return (
                            <li
                                key={category.id}
                                className="list-group-item"
                                onMouseEnter={() => !isSelected && setHoveredCategory(category.id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                                style={{
                                    backgroundColor: isSelected ? "#ffffff" : (hoveredCategory === category.id ? hoverBackgroundColor : inactiveBackgroundColor),
                                    padding: 0,
                                    borderTop: (isSelected && !isFirstItem) ? "1px solid #dee2e6" : "none",
                                    borderLeft: isSelected ? "1px solid #dee2e6" : "none",
                                    borderRight: "none",
                                    borderBottom: isSelected ? "1px solid #dee2e6" : (isAboveSelected ? "none" : "1px solid #dee2e6"),
                                    borderTopLeftRadius: (isSelected || hoveredCategory === category.id) ? "8px" : 0,
                                    borderBottomLeftRadius: (isSelected || hoveredCategory === category.id) ? "8px" : 0,
                                    marginRight: isSelected ? "-1px" : 0,
                                    position: "relative",
                                    zIndex: isSelected ? 1 : 0
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory(category.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                        padding: "12px 16px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: inactiveColor,
                                        textAlign: "left"
                                    }}
                                >
                                    <img
                                        src={category.icon}
                                        alt={category.label}
                                        width="20"
                                        height="20"
                                        style={{
                                            marginRight: "12px",
                                            flexShrink: 0,
                                            filter: isSelected ? "none" : "grayscale(100%)"
                                        }}
                                    />
                                    <span>{category.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div style={{flex: 1, backgroundColor: "#ffffff", borderRight: "1px solid #dee2e6", borderTop: "1px solid #dee2e6", borderTopRightRadius: "8px", display: "flex", flexDirection: "column"}}>
                <div style={{padding: "16px 16px 12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                    <div style={{display: "flex", alignItems: "flex-end", gap: "12px", alignSelf: "flex-end"}}>
                        <img
                            src={selectedCategoryData?.headerIcon}
                            alt=""
                            width="40"
                            height="40"
                        />
                        <h5 style={{margin: "0 0 0 5px", fontWeight: "bold"}}>
                            {selectedCategoryData?.label}
                        </h5>
                    </div>
                    <div style={{textAlign: "center", marginTop: "-10px", marginBottom: "-35px", marginRight: "28px"}}>
                        <div style={{fontSize: "11px", color: inactiveColor, marginBottom: "2px", opacity: 0.8}}>
                            Category
                        </div>
                        <HighchartsReact highcharts={Highcharts} options={gaugeOptions} />
                    </div>
                </div>
                <div style={{margin: "0 8px", borderBottom: "1px solid #dee2e6"}}/>
                <div style={{flex: 1, padding: "16px"}}>
                </div>
            </div>
        </div>
    );
}

export default HealthCategories;
