import {useState} from "react";
import {useOutletContext, useLocation, useNavigate} from "react-router-dom";

import lifestyleHeaderIcon from "../assets/running-man.svg";
import dentalCareTabIcon from "../assets/dental-care-tab.svg";
import healthyFoodIcon from "../assets/healthy-food.svg";
import exerciseIcon from "../assets/exercise.svg";
import postureTabIcon from "../assets/posture-tab.svg";
import sleepIcon from "../assets/sleep.svg";
import skincareTabIcon from "../assets/skincare-tab.svg";
import vitaminBottleIcon from "../assets/vitamin-bottle.svg";
import cigaretteIcon from "../assets/cigarette.svg";

import dentalCareHeaderIcon from "../assets/dental-care-header.svg";
import dietHeaderIcon from "../assets/category-header/diet.svg";
import exerciseHeaderIcon from "../assets/category-header/exercise.svg";
import postureHeaderIcon from "../assets/posture-header.svg";
import sleepHeaderIcon from "../assets/category-header/sleep.svg";
import skincareHeaderIcon from "../assets/skincare-header.svg";
import supplementsHeaderIcon from "../assets/supplements.svg";
import vicesHeaderIcon from "../assets/category-header/vices.svg";


interface Habit {
    id: string;
    label: string;
    icon: string;
    headerIcon: string;
    status: string;
}

interface OutletContext {
    inactiveColor: string;
    inactiveBackgroundColor: string;
}

const habits: Habit[] = [
    {
        id: "dental-care",
        label: "Dental Care",
        icon: dentalCareHeaderIcon,
        headerIcon: dentalCareTabIcon,
        status: "Good"
    },
    {
        id: "diet",
        label: "Diet",
        icon: healthyFoodIcon,
        headerIcon: dietHeaderIcon,
        status: "Needs Improvement"
    },
    {
        id: "exercise",
        label: "Exercise",
        icon: exerciseIcon,
        headerIcon: exerciseHeaderIcon,
        status: "Excellent"
    },
    {
        id: "posture",
        label: "Posture",
        icon: postureTabIcon,
        headerIcon: postureHeaderIcon,
        status: "Good"
    },
    {
        id: "sleep",
        label: "Sleep",
        icon: sleepIcon,
        headerIcon: sleepHeaderIcon,
        status: "Needs Improvement"
    },
    {
        id: "skin-care",
        label: "Skin Care",
        icon: skincareTabIcon,
        headerIcon: skincareHeaderIcon,
        status: "Good"
    },
    {
        id: "supplementation",
        label: "Supplementation",
        icon: vitaminBottleIcon,
        headerIcon: supplementsHeaderIcon,
        status: "Fair"
    },
    {
        id: "vices",
        label: "Vices",
        icon: cigaretteIcon,
        headerIcon: vicesHeaderIcon,
        status: "Good"
    }
];

function Lifestyle() {
    const {inactiveColor, inactiveBackgroundColor} = useOutletContext<OutletContext>();
    const location = useLocation();
    const navigate = useNavigate();

    const hashHabit = location.hash.slice(1);
    const selectedHabit = habits.some((h: Habit) => h.id === hashHabit)
        ? hashHabit
        : habits[0]?.id ?? "diet";

    const [hoveredHabit, setHoveredHabit] = useState<string | null>(null);

    const handleSelectHabit = (habitId: string) => {
        navigate(`#${habitId}`, {replace: true});
    };

    const hoverBackgroundColor = "#d8dfe9";
    const selectedHabitData = habits.find((h: Habit) => h.id === selectedHabit);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Excellent": return "#28a745";
            case "Good": return "#7cb342";
            case "Fair": return "#fbc02d";
            case "Needs Improvement": return "#e65100";
            default: return "#6c757d";
        }
    };

    return (
        <div style={{display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden"}}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 16px",
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #dee2e6",
                borderLeft: "1px solid #dee2e6",
                borderRight: "1px solid #dee2e6",
                borderTop: "1px solid #dee2e6",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px"
            }}>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <h5 style={{margin: 0, fontWeight: "bold"}}>Lifestyle</h5>
                    <img src={lifestyleHeaderIcon} alt="" width="24" height="24"/>
                </div>
            </div>
            <div style={{display: "flex", flex: 1, minHeight: 0}}>
                <div style={{width: "200px", flexShrink: 0, backgroundColor: inactiveBackgroundColor, borderRight: "1px solid #dee2e6", height: "100%", position: "relative"}}>
                    <ul className="list-group list-group-flush">
                        {habits.map((habit: Habit, index: number) => {
                            const selectedIndex = habits.findIndex((h: Habit) => h.id === selectedHabit);
                            const isSelected = selectedHabit === habit.id;
                            const isAboveSelected = index === selectedIndex - 1;
                            const isFirstItem = index === 0;
                            return (
                                <li
                                    key={habit.id}
                                    className="list-group-item"
                                    onMouseEnter={() => !isSelected && setHoveredHabit(habit.id)}
                                    onMouseLeave={() => setHoveredHabit(null)}
                                    style={{
                                        backgroundColor: isSelected ? "#ffffff" : (hoveredHabit === habit.id ? hoverBackgroundColor : inactiveBackgroundColor),
                                        padding: 0,
                                        borderTop: isFirstItem ? "none" : ((isSelected) ? "1px solid #dee2e6" : "none"),
                                        borderLeft: isSelected ? "1px solid #dee2e6" : "none",
                                        borderRight: "none",
                                        borderBottom: isSelected ? "1px solid #dee2e6" : (isAboveSelected ? "none" : "1px solid #dee2e6"),
                                        borderTopLeftRadius: (isSelected || hoveredHabit === habit.id) ? "8px" : 0,
                                        borderBottomLeftRadius: (isSelected || hoveredHabit === habit.id) ? "8px" : 0,
                                        marginRight: isSelected ? "-1px" : 0,
                                        position: "relative",
                                        zIndex: isSelected ? 1 : 0
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleSelectHabit(habit.id)}
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
                                            src={habit.icon}
                                            alt={habit.label}
                                            width="20"
                                            height="20"
                                            style={{
                                                marginRight: "12px",
                                                flexShrink: 0,
                                                filter: isSelected ? "none" : "grayscale(100%)"
                                            }}
                                        />
                                        <span>{habit.label}</span>
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
                                {selectedHabitData?.label}
                            </h5>
                            <img
                                src={selectedHabitData?.headerIcon}
                                alt=""
                                width="40"
                                height="40"
                            />
                        </div>
                        <span style={{margin: 0, fontWeight: "bold", fontSize: "14px", lineHeight: "1.2", color: getStatusColor(selectedHabitData?.status ?? ""), textAlign: "center", width: "120px", marginRight: "7px", display: "inline-block"}}>
                            {selectedHabitData?.status}
                        </span>
                    </div>
                    <div style={{margin: "0 8px", borderBottom: "1px solid #dee2e6"}}/>
                    <div style={{flex: 1, padding: "16px"}}>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lifestyle;
