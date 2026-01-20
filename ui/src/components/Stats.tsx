import {useOutletContext} from "react-router-dom";
import statisticsIcon from "../assets/statistics.svg";

interface HeaderMenuItem {
    id: string;
    label: string;
    icon: string;
    path: string;
}

interface OutletContext {
    inactiveColor: string;
    inactiveBackgroundColor: string;
    headerMenuItems: HeaderMenuItem[];
}

function Stats() {
    const {headerMenuItems} = useOutletContext<OutletContext>();
    const menuItem = headerMenuItems.find(item => item.path === "/stats");

    return (
        <div style={{flex: 1, backgroundColor: "#ffffff", borderLeft: "1px solid #dee2e6", borderRight: "1px solid #dee2e6", borderTop: "1px solid #dee2e6", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", display: "flex", flexDirection: "column"}}>
            <div style={{padding: "16px 16px 12px 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <h5 style={{margin: 0, fontWeight: "bold"}}>
                        {menuItem?.label}
                    </h5>
                    <img src={statisticsIcon} alt="" width="24" height="24"/>
                </div>
            </div>
            <div style={{margin: "0 8px", borderBottom: "1px solid #dee2e6"}}/>
            <div style={{flex: 1, padding: "16px"}}>
            </div>
        </div>
    );
}

export default Stats;
