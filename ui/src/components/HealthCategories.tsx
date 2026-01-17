import {useState} from "react";
import {useOutletContext} from "react-router-dom";

import heartIcon from "../assets/heart.svg";
import humanBodyIcon from "../assets/human-body.svg";
import gutsIcon from "../assets/guts.svg";
import nutritionalPyramidIcon from "../assets/nutritional-pyramid.svg";
import exerciseIcon from "../assets/exercise.svg";
import sleepIcon from "../assets/sleep.svg";
import cigaretteIcon from "../assets/cigarette.svg";
import toothIcon from "../assets/tooth.svg";
import medicalHistoryIcon from "../assets/medical-history.svg";

interface WorkflowCategory {
    id: string;
    label: string;
    icon: string;
}

interface StylesContext {
    inactiveColor: string;
    inactiveBackgroundColor: string;
}

const workflowCategories: WorkflowCategory[] = [
    {
        id: "cardiovascular",
        label: "Cardiovascular Health",
        icon: heartIcon
    },
    {
        id: "body-composition",
        label: "Body Composition",
        icon: humanBodyIcon
    },
    {
        id: "gut-health",
        label: "Gut Health",
        icon: gutsIcon
    },
    {
        id: "diet",
        label: "Diet",
        icon: nutritionalPyramidIcon
    },
    {
        id: "exercise",
        label: "Exercise",
        icon: exerciseIcon
    },
    {
        id: "sleep",
        label: "Sleep",
        icon: sleepIcon
    },
    {
        id: "vices",
        label: "Vices",
        icon: cigaretteIcon
    },
    {
        id: "dental",
        label: "Dental",
        icon: toothIcon
    },
    {
        id: "existing-conditions",
        label: "Existing Conditions",
        icon: medicalHistoryIcon
    }
];

function HealthCategories() {
    const styles = useOutletContext<StylesContext>();
    const {inactiveColor, inactiveBackgroundColor} = styles;

    const [selectedCategory, setSelectedCategory] = useState<string>("cardiovascular");
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const hoverBackgroundColor = "#d8dfe9";
    const isFirstItemSelected = selectedCategory === workflowCategories[0].id;

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
                    {workflowCategories.map((category, index) => {
                        const selectedIndex = workflowCategories.findIndex(c => c.id === selectedCategory);
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
                <div style={{padding: "16px 16px 12px 16px"}}>
                    <h5 style={{margin: 0, fontWeight: "bold"}}>
                        {workflowCategories.find(c => c.id === selectedCategory)?.label}
                    </h5>
                </div>
                <div style={{margin: "0 8px", borderBottom: "1px solid #dee2e6"}}/>
                <div style={{flex: 1, padding: "16px"}}>
                </div>
            </div>
        </div>
    );
}

export default HealthCategories;
