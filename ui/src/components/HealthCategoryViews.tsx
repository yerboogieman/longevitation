import {Outlet, useOutletContext, useNavigate, useLocation} from "react-router-dom";
import type {HealthCategory} from "./ScoreInfo";

import listIcon from "../assets/list.svg";
import tabbedPageIcon from "../assets/tabbed-page.svg";

interface StylesContext {
    inactiveColor: string;
    inactiveBackgroundColor: string;
    healthCategories: HealthCategory[];
}

export interface HealthCategoryViewsContext extends StylesContext {
    healthCategories: HealthCategory[];
}

function HealthCategoryViews() {

    const {inactiveColor, inactiveBackgroundColor, healthCategories} = useOutletContext<StylesContext>();
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
                        onClick={() => navigate("/categories/tabbed-view")}
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
                        onClick={() => navigate("/categories/list-view")}
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
                <Outlet context={{inactiveColor, inactiveBackgroundColor, healthCategories}} />
            </div>
        </div>
    );
}

export default HealthCategoryViews;
