import {useState, useMemo, useEffect, useRef} from "react";
import {useOutletContext, useLocation, useNavigate} from "react-router-dom";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import MoreModule from "highcharts/highcharts-more";
import SolidGaugeModule from "highcharts/modules/solid-gauge";
import type {HealthCategory} from "./ScoreInfo";
import type {HealthCategoryViewsContext} from "./HealthCategoryViews";

if (typeof MoreModule === "function") {
    (MoreModule as any)(Highcharts);
}
if (typeof SolidGaugeModule === "function") {
    (SolidGaugeModule as any)(Highcharts);
}

interface SubMenuItem {
    id: string;
    label: string;
    tooltip: string;
    icon: string;
}

const subMenuItems: SubMenuItem[] = [
    {id: "overview", label: "Overview", tooltip: "Overview and recommendations for this health category", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"},
    {id: "markers", label: "Markers", tooltip: "Key metrics used to calculate the score for this area", icon: "M7 2v20h10V2H7zM8 4h3v1H8V4zM8 8h5v1H8V8zM8 12h3v1H8v-1zM8 16h5v1H8v-1zM8 20h3v1H8v-1z"},
    {id: "factors", label: "Factors", tooltip: "Factors that can influence this health category", icon: "M4 6c0-.83.67-1.5 1.5-1.5S7 5.17 7 6s-.67 1.5-1.5 1.5S4 6.83 4 6zm0 6c0-.83.67-1.5 1.5-1.5S7 11.17 7 12s-.67 1.5-1.5 1.5S4 12.83 4 12zm0 6c0-.83.67-1.5 1.5-1.5S7 17.17 7 18s-.67 1.5-1.5 1.5S4 18.83 4 18zM10 5h11v2H10V5zm0 6h11v2H10v-2zm0 6h11v2H10v-2z"},
    {id: "stats", label: "Stats", tooltip: "Statistics for key health markers for this category", icon: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"},
    {id: "troubleshoot", label: "Troubleshoot", tooltip: "Troubleshoot issues with this health category", icon: "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"},
];

function HealthCategoriesTabbedView() {

    const {inactiveColor, inactiveBackgroundColor, healthCategories} = useOutletContext<HealthCategoryViewsContext>();
    const location = useLocation();
    const navigate = useNavigate();

    const hashCategory = location.hash.slice(1);
    const selectedCategory = healthCategories.some((c: HealthCategory) => c.id === hashCategory)
        ? hashCategory
        : healthCategories[0]?.id ?? "cardiovascular";

    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState<string>("overview");
    const [hoveredSubMenu, setHoveredSubMenu] = useState<string | null>(null);
    const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (hoveredSubMenu) {
            if (tooltipTimeoutRef.current) {
                clearTimeout(tooltipTimeoutRef.current);
            }
            tooltipTimeoutRef.current = setTimeout(() => {
                setHoveredSubMenu(null);
            }, 2000);
        }
        return () => {
            if (tooltipTimeoutRef.current) {
                clearTimeout(tooltipTimeoutRef.current);
            }
        };
    }, [hoveredSubMenu]);

    const handleSelectCategory = (categoryId: string) => {
        navigate(`#${categoryId}`, {replace: true});
    };

    const hoverBackgroundColor = "#d8dfe9";
    const selectedCategoryData = healthCategories.find((c: HealthCategory) => c.id === selectedCategory);

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
        <div style={{display: "flex", flex: 1, minHeight: 0, overflow: "hidden"}}>
            <div style={{width: "200px", flexShrink: 0, backgroundColor: inactiveBackgroundColor, borderRight: "1px solid #dee2e6", height: "100%", position: "relative"}}>
                <ul className="list-group list-group-flush">
                    {healthCategories.map((category: HealthCategory, index: number) => {
                        const selectedIndex = healthCategories.findIndex((c: HealthCategory) => c.id === selectedCategory);
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
                                    borderTop: isFirstItem ? "none" : ((isSelected) ? "1px solid #dee2e6" : "none"),
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
                                    onClick={() => handleSelectCategory(category.id)}
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
            <div style={{flex: 1, backgroundColor: "#ffffff", borderRight: "1px solid #dee2e6", display: "flex", flexDirection: "column"}}>
                <div style={{padding: "8px 16px 4px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative"}}>
                    <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                        <h5 style={{margin: 0, fontWeight: "bold"}}>
                            {selectedCategoryData?.label}
                        </h5>
                        <img
                            src={selectedCategoryData?.headerIcon}
                            alt=""
                            width="40"
                            height="40"
                        />
                    </div>
                    <div style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        bottom: "-1px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <ul style={{
                            display: "flex",
                            listStyle: "none",
                            margin: 0,
                            padding: 0,
                            gap: 0
                        }}>
                            {subMenuItems.map((item) => {
                                const isSelected = selectedSubMenu === item.id;
                                const isHovered = hoveredSubMenu === item.id;
                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedSubMenu(item.id)}
                                            onMouseEnter={() => setHoveredSubMenu(item.id)}
                                            onMouseLeave={() => setHoveredSubMenu(null)}
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
                                                transition: "all 0.15s ease"
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                width={item.id === "troubleshoot" ? "12" : "14"}
                                                height={item.id === "troubleshoot" ? "12" : "14"}
                                            >
                                                <path d={item.icon}/>
                                            </svg>
                                            <span style={{fontSize: "13px"}}>{item.label}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div style={{textAlign: "center", marginTop: "0px", marginBottom: "-30px", marginRight: "28px"}}>
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

export default HealthCategoriesTabbedView;
