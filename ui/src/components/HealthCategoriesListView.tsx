import {useMemo} from "react";
import {useOutletContext} from "react-router-dom";
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

    return (
        <div style={{flex: 1, minHeight: 0, backgroundColor: "#ffffff", borderLeft: "1px solid #dee2e6", borderRight: "1px solid #dee2e6", overflow: "auto"}}>
            <ul className="list-group list-group-flush">
                {healthCategories.map((category: HealthCategory) => (
                    <li
                        key={category.id}
                        className="list-group-item"
                        style={{
                            padding: "8px 16px 4px 16px",
                            borderBottom: "1px solid #dee2e6"
                        }}
                    >
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                                <img
                                    src={category.headerIcon}
                                    alt=""
                                    width="40"
                                    height="40"
                                />
                                <h6 style={{margin: 0, fontWeight: "bold", color: inactiveColor}}>
                                    {category.label}
                                </h6>
                            </div>
                            <div style={{marginTop: "0px", marginBottom: "-30px", marginRight: "28px"}}>
                                <CategoryGauge score={category.score} inactiveColor={inactiveColor} />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HealthCategoriesListView;
