import {useState} from "react";
import {Outlet, useOutletContext, useLocation, useNavigate} from "react-router-dom";
import cartIcon from "../assets/cart.svg";

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

interface ShopMenuItem {
    id: string;
    label: string;
    path: string;
}

const shopMenuItems: ShopMenuItem[] = [
    {id: "devices", label: "Devices", path: "devices"},
    {id: "healthy-food", label: "Healthy Food", path: "healthy-food"},
    {id: "services", label: "Services", path: "services"},
    {id: "supplements", label: "Supplements", path: "supplements"},
    {id: "tests", label: "Tests", path: "tests"},
];

function Shop() {

    const context = useOutletContext<OutletContext>();
    const {inactiveColor, headerMenuItems} = context;
    const menuItem = headerMenuItems.find(item => item.path === "/shop");
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname.split("/").pop();
    const selectedItem = shopMenuItems.some(item => item.path === currentPath) ? currentPath : "devices";

    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <div style={{flex: 1, backgroundColor: "#ffffff", borderLeft: "1px solid #dee2e6", borderRight: "1px solid #dee2e6", borderTop: "1px solid #dee2e6", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", display: "flex", flexDirection: "column"}}>
            <div style={{padding: "16px 16px 12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative"}}>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <h5 style={{margin: 0, fontWeight: "bold"}}>
                        {menuItem?.label}
                    </h5>
                    <img src={cartIcon} alt="" width="24" height="24"/>
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
                    {shopMenuItems.map((item) => {
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

export default Shop;
