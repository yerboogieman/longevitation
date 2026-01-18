import {useOutletContext} from "react-router-dom";

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

function Summary() {
    const {headerMenuItems} = useOutletContext<OutletContext>();
    const menuItem = headerMenuItems.find(item => item.path === "");

    return (
        <div style={{flex: 1, backgroundColor: "#ffffff", borderLeft: "1px solid #dee2e6", borderRight: "1px solid #dee2e6", borderTop: "1px solid #dee2e6", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", display: "flex", flexDirection: "column"}}>
            <div style={{padding: "16px 16px 12px 24px"}}>
                <h5 style={{margin: 0, fontWeight: "bold"}}>
                    {menuItem?.label}
                </h5>
            </div>
            <div style={{margin: "0 8px", borderBottom: "1px solid #dee2e6"}}/>
            <div style={{flex: 1, padding: "16px"}}>
            </div>
        </div>
    );
}

export default Summary;
