import {useState} from "react";
import {useOutletContext, useLocation, useNavigate} from "react-router-dom";
import type {Habit} from "../ScoreInfo";

interface OutletContext {
    inactiveColor: string;
    inactiveBackgroundColor: string;
    habits: Habit[];
}

function Categories() {

    const {inactiveColor, inactiveBackgroundColor, habits} = useOutletContext<OutletContext>();
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
                            height={selectedHabitData?.headerIconHeight ?? 40}
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
    );
}

export default Categories;
