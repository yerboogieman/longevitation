import {Outlet, useOutletContext, useNavigate, useLocation} from "react-router-dom";

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

import listIcon from "../assets/list.svg";
import tabbedPageIcon from "../assets/tabbed-page.svg";

export interface HealthCategory {
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

export interface HealthCategoryViewsContext extends StylesContext {
    healthCategories: HealthCategory[];
}

export const healthCategories: HealthCategory[] = [
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

function HealthCategoryViews() {

    const styles = useOutletContext<StylesContext>();
    const navigate = useNavigate();
    const location = useLocation();

    const isTabbedView = location.pathname.endsWith("/tabbed-view") || location.pathname.endsWith("/categories");

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
                <h5 style={{margin: 0, fontWeight: "bold"}}>Health Categories</h5>
                <div style={{display: "flex", borderRadius: "4px", overflow: "hidden", border: "1px solid #dee2e6", marginRight: "33px"}}>
                    <button
                        onClick={() => navigate("tabbed-view")}
                        title="Tabbed View"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px 8px",
                            border: "none",
                            backgroundColor: isTabbedView ? "#e9ecef" : "#ffffff",
                            cursor: "pointer",
                            borderRight: "1px solid #dee2e6"
                        }}
                    >
                        <img src={tabbedPageIcon} alt="Tabbed view" width="16" height="16" style={{filter: "invert(46%) sepia(5%) saturate(630%) hue-rotate(169deg) brightness(92%) contrast(90%)"}} />
                    </button>
                    <button
                        onClick={() => navigate("list-view")}
                        title="List View"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px 8px",
                            border: "none",
                            backgroundColor: !isTabbedView ? "#e9ecef" : "#ffffff",
                            cursor: "pointer"
                        }}
                    >
                        <img src={listIcon} alt="List view" width="16" height="16" style={{filter: "invert(46%) sepia(5%) saturate(630%) hue-rotate(169deg) brightness(92%) contrast(90%)"}} />
                    </button>
                </div>
            </div>
            <div style={{display: "flex", flex: 1, minHeight: 0}}>
                <Outlet context={{...styles, healthCategories}} />
            </div>
        </div>
    );
}

export default HealthCategoryViews;
