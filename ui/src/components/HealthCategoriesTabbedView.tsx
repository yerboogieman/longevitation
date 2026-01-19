import {useState, useMemo} from "react";
import {useOutletContext, useLocation, useNavigate} from "react-router-dom";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import MoreModule from "highcharts/highcharts-more";
import SolidGaugeModule from "highcharts/modules/solid-gauge";
import type {HealthCategory, HealthCategoryViewsContext} from "./HealthCategoryViews";

if (typeof MoreModule === "function") {
    (MoreModule as any)(Highcharts);
}
if (typeof SolidGaugeModule === "function") {
    (SolidGaugeModule as any)(Highcharts);
}

interface SubMenuItem {
    id: string;
    label: string;
    icon: string;
}

const subMenuItems: SubMenuItem[] = [
    {id: "overview", label: "Overview", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"},
    {id: "factors", label: "Factors", icon: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9h-2v2H9v-2H7v-2h2V7h2v2h2v2zm0-4V3.5L17.5 8H13z"},
    {id: "recommendations", label: "Strategy", icon: "M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"},
    {id: "trends", label: "Trends", icon: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"},
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
                    <ul style={{
                        display: "flex",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        gap: 0,
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        bottom: "-1px"
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
                                            width="14"
                                            height="14"
                                        >
                                            <path d={item.icon}/>
                                        </svg>
                                        <span style={{fontSize: "13px"}}>{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
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
