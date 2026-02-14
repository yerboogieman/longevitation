import {useState, useMemo, useRef, useEffect} from "react";
import {useOutletContext} from "react-router-dom";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import MoreModule from "highcharts/highcharts-more";
import SolidGaugeModule from "highcharts/modules/solid-gauge";
import type {HealthCategory} from "./ScoreInfo";
import type {HealthCategoryViewsContext} from "./HealthCategoryViews";
import HealthMarkers from "./HealthMarkers";

if (typeof MoreModule === "function") {
    (MoreModule as any)(Highcharts);
}
if (typeof SolidGaugeModule === "function") {
    (SolidGaugeModule as any)(Highcharts);
}

type CategoryTab = "overview" | "markers" | "factors" | "stats" | "troubleshoot";

interface CategoryTabItem {
    id: CategoryTab;
    label: string;
    icon: string;
}

const categoryTabItems: CategoryTabItem[] = [
    {id: "overview", label: "Overview", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"},
    {id: "markers", label: "Markers", icon: "M7 2v20h10V2H7zM8 4h3v1H8V4zM8 8h5v1H8V8zM8 12h3v1H8v-1zM8 16h5v1H8v-1zM8 20h3v1H8v-1z"},
    {id: "factors", label: "Factors", icon: "M4 6c0-.83.67-1.5 1.5-1.5S7 5.17 7 6s-.67 1.5-1.5 1.5S4 6.83 4 6zm0 6c0-.83.67-1.5 1.5-1.5S7 11.17 7 12s-.67 1.5-1.5 1.5S4 12.83 4 12zm0 6c0-.83.67-1.5 1.5-1.5S7 17.17 7 18s-.67 1.5-1.5 1.5S4 18.83 4 18zM10 5h11v2H10V5zm0 6h11v2H10v-2zm0 6h11v2H10v-2z"},
    {id: "stats", label: "Stats", icon: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"},
    {id: "troubleshoot", label: "Troubleshoot", icon: "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"},
];

function CategoryGauge({score, inactiveColor}: {score: number; inactiveColor: string}) {
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
            data: [score],
            innerRadius: "60%"
        }]
    }), [score, inactiveColor]);

    return <HighchartsReact highcharts={Highcharts} options={gaugeOptions} />;
}

function HealthCategoriesListView() {
    const {healthCategories, inactiveColor} = useOutletContext<HealthCategoryViewsContext>();
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [explicitClose, setExplicitClose] = useState<string | null>(null);
    const [selectedTabs, setSelectedTabs] = useState<Record<string, CategoryTab>>({});
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [_heights, setHeights] = useState<Record<string, number>>({});

    useEffect(() => {
        // Measure all content heights
        const newHeights: Record<string, number> = {};
        Object.entries(contentRefs.current).forEach(([id, ref]) => {
            if (ref) {
                newHeights[id] = ref.scrollHeight;
            }
        });
        setHeights(newHeights);
    }, [openAccordion, selectedTabs]);

    const toggleAccordion = (categoryId: string) => {
        if (openAccordion === categoryId) {
            // Explicitly closing the current panel
            setExplicitClose(categoryId);
            setOpenAccordion(null);
        } else {
            // Opening a different panel (instant close for previous)
            setExplicitClose(null);
            setOpenAccordion(categoryId);
        }
    };

    const getSelectedTab = (categoryId: string): CategoryTab => {
        return selectedTabs[categoryId] || "overview";
    };

    const setSelectedTab = (categoryId: string, tab: CategoryTab) => {
        setSelectedTabs(prev => ({...prev, [categoryId]: tab}));
    };

    return (
        <div className="thin-scrollbar" style={{flex: 1, minHeight: 0, backgroundColor: "#ffffff", borderLeft: "1px solid #dee2e6", borderRight: "1px solid #dee2e6", overflow: "auto", padding: "8px 6px 8px 8px"}}>
            <div className="accordion">
                {healthCategories.map((category: HealthCategory) => {
                    const isOpen = openAccordion === category.id;
                    return (
                        <div className="accordion-item" key={category.id} style={{border: "1px solid #dee2e6", borderRadius: "8px", marginBottom: "6px", overflow: "visible"}}>
                            <div className="accordion-header" style={{position: "relative", backgroundColor: "#f8f9fa", borderRadius: isOpen ? "8px 8px 0 0" : "8px"}}>
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(category.id)}
                                    style={{
                                        backgroundColor: "transparent",
                                        padding: "12px 16px",
                                        paddingBottom: "0",
                                        paddingRight: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        boxShadow: "none",
                                        position: "relative",
                                        width: "100%",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        textAlign: "left",
                                    }}
                                >
                                    <img
                                        src={category.headerIcon}
                                        alt=""
                                        width="40"
                                        height="40"
                                    />
                                    <h6 style={{margin: 0, fontWeight: "bold", color: inactiveColor, flex: 1}}>
                                        {category.label}
                                    </h6>
                                    <div style={{
                                        marginRight: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "-20px",
                                    }}>
                                        <CategoryGauge score={category.score} inactiveColor={inactiveColor} />
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
                                            {categoryTabItems.map((tab) => {
                                                const isSelected = getSelectedTab(category.id) === tab.id;
                                                const isHovered = hoveredTab === `${category.id}-${tab.id}`;
                                                return (
                                                    <li key={tab.id}>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedTab(category.id, tab.id);
                                                            }}
                                                            onMouseEnter={() => setHoveredTab(`${category.id}-${tab.id}`)}
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
                                                                width={tab.id === "troubleshoot" ? "12" : "14"}
                                                                height={tab.id === "troubleshoot" ? "12" : "14"}
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
                                ref={(el) => { contentRefs.current[category.id] = el; }}
                                style={{
                                    overflow: isOpen ? "visible" : "hidden",
                                    height: isOpen ? "auto" : 0,
                                    transition: (!isOpen && explicitClose !== category.id) ? "none" : "height 0.3s ease",
                                }}
                            >
                                <div className="accordion-body" style={{padding: "16px", backgroundColor: "#fff", borderTop: "1px solid #dee2e6"}}>
                                    {getSelectedTab(category.id) === "overview" && (
                                        <div style={{color: inactiveColor, fontSize: "13px"}}>
                                            <p>Overview and recommendations for {category.label}.</p>
                                            <p style={{marginBottom: 0}}>Your current score is <strong>{category.score}</strong> out of 100.</p>
                                        </div>
                                    )}
                                    {getSelectedTab(category.id) === "markers" && (
                                        <HealthMarkers
                                            categoryId={category.id}
                                            categoryLabel={category.label}
                                            inactiveColor={inactiveColor}
                                        />
                                    )}
                                    {getSelectedTab(category.id) === "factors" && (
                                        <div style={{color: inactiveColor, fontSize: "13px", padding: "24px", textAlign: "center"}}>
                                            TODO: create factors component for this category.
                                        </div>
                                    )}
                                    {getSelectedTab(category.id) === "stats" && (
                                        <div style={{color: inactiveColor, fontSize: "13px", padding: "24px", textAlign: "center"}}>
                                            TODO: create stats component for this category.
                                        </div>
                                    )}
                                    {getSelectedTab(category.id) === "troubleshoot" && (
                                        <div style={{color: inactiveColor, fontSize: "13px", padding: "24px", textAlign: "center"}}>
                                            TODO: create troubleshoot component for this category.
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

export default HealthCategoriesListView;
