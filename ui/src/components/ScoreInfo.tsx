import {useState, useMemo} from "react";
import {Outlet, NavLink} from "react-router-dom";
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

import happyManIcon from "../assets/happy-man.svg";
import happyWomanIcon from "../assets/happy-woman.svg";
import happyFaceIcon from "../assets/happy-face.svg";

interface ScoreInfoProps {
    styles: {
        inactiveColor: string;
        inactiveBackgroundColor: string;
    };
    score: number;
    gender?: string;
}

interface HeaderMenuItem {
    id: string;
    label: string;
    icon: string;
    path: string;
}

const headerMenuItems: HeaderMenuItem[] = [
    {id: "overview", label: "Overview", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z", path: "/overview"},
    {id: "health-categories", label: "Categories", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z", path: "/score-info/categories"},
    {id: "stats", label: "Stats", icon: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z", path: "/stats"},
    {id: "shop", label: "Shop", icon: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.49 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z", path: "/shop"},
];

function ScoreInfo({styles, score, gender}: ScoreInfoProps) {

    const [hoveredHeaderTab, setHoveredHeaderTab] = useState<string | null>(null);
    const {inactiveColor, inactiveBackgroundColor} = styles;

    const genderIcon = gender === "male" ? happyManIcon : gender === "female" ? happyWomanIcon : happyFaceIcon;

    const gaugeOptions: Highcharts.Options = useMemo(() => ({
        chart: {
            type: "solidgauge",
            height: 120,
            width: 120,
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
                    y: -15,
                    borderWidth: 0,
                    format: `<span style="font-size:18px;font-weight:bold;color:${inactiveColor}">{y}</span>`
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

    return (
        <div className="w-100" style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "400px",
            height: "calc(100% + 10px)",
            overflow: "hidden",
            marginTop: "-11px"
        }}>
            <div style={{
                backgroundColor: inactiveBackgroundColor,
                padding: "16px 24px 0 13px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                position: "relative"
            }}>
                <div style={{display: "flex", alignItems: "flex-end", gap: "8px", paddingBottom: "16px"}}>
                    <h4 className="fw-bold m-0">My Health</h4>
                    <img src={genderIcon} alt="" width="32" height="32" style={{marginBottom: "2px"}} />
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
                    {headerMenuItems.map((item) => {
                        const isHovered = hoveredHeaderTab === item.id;
                        return (
                            <li key={item.id}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === "/score-info"}
                                    onMouseEnter={() => setHoveredHeaderTab(item.id)}
                                    onMouseLeave={() => setHoveredHeaderTab(null)}
                                    style={({isActive}) => ({
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "6px 10px",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        color: inactiveColor,
                                        textDecoration: "none",
                                        borderBottom: isActive ? "2px solid #0d6efd" : "2px solid transparent",
                                        opacity: isActive ? 1 : (isHovered ? 0.8 : 0.7),
                                        transition: "all 0.15s ease"
                                    })}
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
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
                <div style={{textAlign: "center", alignSelf: "flex-end", marginBottom: "-50px", marginTop: "-10px"}}>
                    <div style={{fontSize: "11px", color: inactiveColor, marginBottom: "2px", opacity: 0.8}}>
                        Overall
                    </div>
                    <HighchartsReact highcharts={Highcharts} options={gaugeOptions} />
                </div>
            </div>
            <Outlet context={{...styles, headerMenuItems}}/>
        </div>
    );
}

export default ScoreInfo;
