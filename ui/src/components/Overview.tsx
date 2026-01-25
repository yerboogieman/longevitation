import {useMemo, useState} from "react";
import {useOutletContext, useNavigate} from "react-router-dom";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import MoreModule from "highcharts/highcharts-more";
import SolidGaugeModule from "highcharts/modules/solid-gauge";
import type {HealthCategory, Habit} from "./ScoreInfo";

if (typeof MoreModule === "function") {
    (MoreModule as any)(Highcharts);
}
if (typeof SolidGaugeModule === "function") {
    (SolidGaugeModule as any)(Highcharts);
}

interface OutletContext {
    inactiveColor: string;
    healthCategories: HealthCategory[];
    habits: Habit[];
}

interface OverviewMenuItem {
    id: string;
    label: string;
    icon: string;
}

const overviewMenuItems: OverviewMenuItem[] = [
    {id: "categories", label: "Categories", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"},
    {id: "lifestyle", label: "Lifestyle", icon: "M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"}
];

const leftMenuItems: OverviewMenuItem[] = [
    {id: "guidance", label: "Guidance", icon: "m17 0h-14.8c-1.21 0-2.2 .99-2.2 2.2v10.8c0 1.21.99 2.2 2.2 2.2h1v3.4c0 .24.15.46.37.55.07.03.15.05.23.05.16 0 .31-.06.42-.18l3.82-3.82h8.95c1.21 0 2.2-.99 2.2-2.2v-10.8c0-1.21-.99-2.2-2.2-2.2zm-5.77 11.11c0 .49-.4.89-.9.89h-1.47c-.43 0-.9-.32-.9-1.03v-.43h3.26zm.65-2.37c-.34.27-.55.62-.62.99h-3.3c-.06-.36-.26-.7-.58-.95-.89-.7-1.39-1.74-1.37-2.88.04-1.9 1.63-3.48 3.54-3.5.97-.02 1.9.35 2.59 1.04.69.67 1.06 1.58 1.06 2.54 0 1.08-.48 2.09-1.32 2.77z"},
    {id: "influences", label: "Influences", icon: "M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"},
    {id: "routine", label: "Routine", icon: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"}
];

function CategoryGauge({score, inactiveColor}: {score: number; inactiveColor: string}) {
    const gaugeOptions: Highcharts.Options = useMemo(() => ({
        chart: {
            type: "solidgauge",
            height: 50,
            width: 50,
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
                    format: `<span style="font-size:10px;font-weight:bold;color:${inactiveColor}">{y}</span>`
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

const getStatusColor = (status: string) => {
    switch (status) {
        case "Excellent": return "#28a745";
        case "Good": return "#7cb342";
        case "Fair": return "#fbc02d";
        case "Needs Improvement": return "#e65100";
        default: return "#6c757d";
    }
};

function Overview() {
    const {inactiveColor, healthCategories, habits} = useOutletContext<OutletContext>();
    const navigate = useNavigate();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<string>("categories");
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const [selectedLeftTab, setSelectedLeftTab] = useState<string>("guidance");
    const [hoveredLeftTab, setHoveredLeftTab] = useState<string | null>(null);

    const handleCategoryClick = (categoryId: string) => {
        navigate(`/categories/tabbed-view#${categoryId}`);
    };

    const handleHabitClick = (habitId: string) => {
        navigate(`/lifestyle#${habitId}`);
    };

    return (
        <div style={{flex: 1, backgroundColor: "#ffffff", borderLeft: "1px solid #dee2e6", borderRight: "1px solid #dee2e6", borderTop: "1px solid #dee2e6", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", display: "flex", flexDirection: "column"}}>
            <div style={{flex: 1, padding: "4 16px", display: "flex", justifyContent: "space-between"}}>
                <div style={{width: "fit-content", marginLeft: "20px"}}>
                    <ul style={{
                        display: "flex",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        gap: 0,
                        justifyContent: "flex-start"
                    }}>
                        {leftMenuItems.map((item) => {
                            const isSelected = selectedLeftTab === item.id;
                            const isHovered = hoveredLeftTab === item.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedLeftTab(item.id)}
                                        onMouseEnter={() => setHoveredLeftTab(item.id)}
                                        onMouseLeave={() => setHoveredLeftTab(null)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            gap: "4px",
                                            padding: "6px 11px 6px 0",
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
                                            style={item.id === "guidance" ? {marginTop: "2px"} : undefined}
                                        >
                                            <path d={item.icon}/>
                                        </svg>
                                        <span style={{fontSize: "13px"}}>{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <div style={{margin: "0", borderBottom: "1px solid #dee2e6"}}/>
                </div>
                <div style={{width: "255px", marginRight: "20px"}}>
                    <ul style={{
                        display: "flex",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        gap: 0,
                        justifyContent: "flex-start"
                    }}>
                        {overviewMenuItems.map((item) => {
                            const isSelected = selectedTab === item.id;
                            const isHovered = hoveredTab === item.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTab(item.id)}
                                        onMouseEnter={() => setHoveredTab(item.id)}
                                        onMouseLeave={() => setHoveredTab(null)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            gap: "4px",
                                            padding: "6px 14px 6px 0",
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
                    <div style={{margin: "0", borderBottom: "1px solid #dee2e6"}}/>
                    <ul className="list-group list-group-flush">
                        {selectedTab === "categories" ? (
                            healthCategories.map((category: HealthCategory) => (
                                <li
                                    key={category.id}
                                    className="list-group-item"
                                    onClick={() => handleCategoryClick(category.id)}
                                    onMouseEnter={() => setHoveredItem(category.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "44px",
                                        padding: "6px 4px",
                                        paddingRight: "39px",
                                        borderLeft: "none",
                                        borderRight: "none",
                                        cursor: "pointer",
                                        backgroundColor: hoveredItem === category.id ? "#f0f0f0" : "transparent",
                                        position: "relative"
                                    }}
                                >
                                    <img
                                        src={category.headerIcon}
                                        alt=""
                                        width="24"
                                        height="24"
                                        style={{marginRight: "8px", flexShrink: 0}}
                                    />
                                    <span style={{flex: 1, color: inactiveColor, fontSize: "13px"}}>{category.label}</span>
                                    <div style={{marginBottom: "-18px"}}>
                                        <CategoryGauge score={category.score} inactiveColor={inactiveColor} />
                                    </div>
                                </li>
                            ))
                        ) : (
                            habits.map((habit: Habit) => (
                                <li
                                    key={habit.id}
                                    className="list-group-item"
                                    onClick={() => handleHabitClick(habit.id)}
                                    onMouseEnter={() => setHoveredItem(habit.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "44px",
                                        padding: "6px 4px",
                                        paddingRight: "39px",
                                        borderLeft: "none",
                                        borderRight: "none",
                                        cursor: "pointer",
                                        backgroundColor: hoveredItem === habit.id ? "#f0f0f0" : "transparent",
                                        position: "relative"
                                    }}
                                >
                                    <img
                                        src={habit.headerIcon}
                                        alt=""
                                        width="24"
                                        height="24"
                                        style={{marginRight: "8px", flexShrink: 0}}
                                    />
                                    <span style={{flex: 1, color: inactiveColor, fontSize: "13px"}}>{habit.label}</span>
                                    <span style={{
                                        fontWeight: "bold",
                                        fontSize: "11px",
                                        color: getStatusColor(habit.status),
                                        textAlign: "right",
                                        minWidth: "50px"
                                    }}>
                                        {habit.status}
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                    <div style={{margin: "0", borderBottom: "1px solid #dee2e6"}}/>
                </div>
            </div>
        </div>
    );
}

export default Overview;
