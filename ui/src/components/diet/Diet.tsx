import {useState} from "react";
import {Outlet, useOutletContext, useLocation, useNavigate} from "react-router-dom";
import dietIcon from "../../assets/category-header/diet.svg";

interface HeaderMenuItem {
    id: string;
    label: string;
    icon: string;
    path: string;
}

interface StylesContext {
    inactiveColor: string;
    inactiveBackgroundColor: string;
}

interface OutletContext extends StylesContext {
    headerMenuItems: HeaderMenuItem[];
}

interface DietMenuItem {
    id: string;
    label: string;
    path: string;
}

const dietMenuItems: DietMenuItem[] = [
    {id: "menu", label: "Menu", path: "menu"},
    {id: "recipes", label: "Recipes", path: "recipes"},
    {id: "shopping-list", label: "Shopping List", path: "shopping-list"},
];

function Diet() {

    const context = useOutletContext<OutletContext>();
    const {inactiveColor} = context;
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname.split("/").pop();
    const selectedItem = dietMenuItems.some(item => item.path === currentPath) ? currentPath : "menu";

    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <div style={{flex: 1, backgroundColor: "#ffffff", borderLeft: "1px solid #dee2e6", borderRight: "1px solid #dee2e6", borderTop: "1px solid #dee2e6", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", display: "flex", flexDirection: "column"}}>
            <div style={{padding: "16px 16px 12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative"}}>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <h5 style={{margin: 0, fontWeight: "bold"}}>
                        Diet
                    </h5>
                    <img src={dietIcon} alt="" width="24" height="24"/>
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
                    {dietMenuItems.map((item) => {
                        const isSelected = selectedItem === item.path;
                        const isHovered = hoveredItem === item.id;
                        return (
                            <li key={item.id}>
                                <button
                                    type="button"
                                    onClick={() => navigate(item.path)}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
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
                                    <span style={{fontSize: "13px"}}>{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div style={{margin: "0 8px", borderBottom: "1px solid #dee2e6"}}/>
            <Outlet context={context}/>
        </div>
    );
}

export default Diet;
