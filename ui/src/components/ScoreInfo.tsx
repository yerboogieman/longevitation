import {useState} from "react";
import {Outlet, NavLink} from "react-router-dom";

interface ScoreInfoProps {
    styles: {
        inactiveColor: string;
        inactiveBackgroundColor: string;
    };
}

interface HeaderMenuItem {
    id: string;
    label: string;
    icon: string;
    path: string;
}

const headerMenuItems: HeaderMenuItem[] = [
    {id: "summary", label: "Summary", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z", path: ""},
    {id: "health-categories", label: "Categories", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z", path: "categories"},
    {id: "trends", label: "Trends", icon: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z", path: "trends"},
    {id: "recommendations", label: "Recommendations", icon: "M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z", path: "recommendations"},
];

function ScoreInfo({styles}: ScoreInfoProps) {

    const [hoveredHeaderTab, setHoveredHeaderTab] = useState<string | null>(null);
    const {inactiveColor, inactiveBackgroundColor} = styles;

    return (
        <div className="h-100 w-100" style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "400px",
            overflow: "hidden"
        }}>
            <div style={{
                backgroundColor: inactiveBackgroundColor,
                padding: "16px 24px 0 13px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                position: "relative"
            }}>
                <h4 className="fw-bold m-0" style={{paddingBottom: "16px"}}>Your Score</h4>
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
                                    end={item.path === ""}
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
                <div style={{width: "100px"}}></div>
            </div>
            <Outlet context={styles}/>
        </div>
    );
}

export default ScoreInfo;
