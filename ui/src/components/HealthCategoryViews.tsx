import {Outlet, useOutletContext, useNavigate, useLocation} from "react-router-dom";

import bloodSugarTabIcon from "../assets/blood-sugar-tab.svg";
import heartIcon from "../assets/heart.svg";
import humanBodyIcon from "../assets/human-body.svg";
import flexibilityTabIcon from "../assets/flexibility-tab.svg";
import gutsIcon from "../assets/guts.svg";
import medicalHistoryIcon from "../assets/medical-history.svg";
import skinTabIcon from "../assets/skin-tab.svg";
import toothIcon from "../assets/tooth.svg";

import bloodSugarHeaderIcon from "../assets/blood-sugar-header.svg";
import cardiovascularHeaderIcon from "../assets/category-header/cardiovascular.svg";
import bodyCompositionHeaderIcon from "../assets/category-header/body-composition.svg";
import dentalHeaderIcon from "../assets/dentistry.svg";
import flexibilityHeaderIcon from "../assets/flexibility-header.svg";
import gutHealthHeaderIcon from "../assets/category-header/gut-health.svg";
import existingConditionsHeaderIcon from "../assets/category-header/existing-conditions.svg";
import skinHeaderIcon from "../assets/skin-header.svg";

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
        id: "blood-sugar",
        label: "Blood Sugar",
        icon: bloodSugarTabIcon,
        headerIcon: bloodSugarHeaderIcon,
        score: 78
    },
    {
        id: "body-composition",
        label: "Body Composition",
        icon: humanBodyIcon,
        headerIcon: bodyCompositionHeaderIcon,
        score: 75
    },
    {
        id: "cardiovascular",
        label: "Cardiovascular",
        icon: heartIcon,
        headerIcon: cardiovascularHeaderIcon,
        score: 83
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
    },
    {
        id: "flexibility",
        label: "Flexibility",
        icon: flexibilityTabIcon,
        headerIcon: flexibilityHeaderIcon,
        score: 89
    },
    {
        id: "gut-health",
        label: "Gut Health",
        icon: gutsIcon,
        headerIcon: gutHealthHeaderIcon,
        score: 65
    },
    {
        id: "skin",
        label: "Skin",
        icon: skinTabIcon,
        headerIcon: skinHeaderIcon,
        score: 65
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
