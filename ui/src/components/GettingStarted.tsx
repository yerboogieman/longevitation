import startButtonIcon from "../assets/start-button.svg";

function GettingStarted() {
    return (
        <div style={{flex: 1, backgroundColor: "#ffffff", borderLeft: "1px solid #dee2e6", borderRight: "1px solid #dee2e6", borderTop: "1px solid #dee2e6", borderTopLeftRadius: "8px", borderTopRightRadius: "8px", display: "flex", flexDirection: "column"}}>
            <div style={{padding: "16px 16px 12px 24px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <img
                        src={startButtonIcon}
                        alt=""
                        width="28"
                        height="28"
                    />
                    <h5 style={{margin: 0, fontWeight: "bold"}}>
                        Getting Started
                    </h5>
                </div>
            </div>
            <div style={{margin: "0 8px", borderBottom: "1px solid #dee2e6"}}/>
            <div style={{flex: 1, padding: "16px"}}>
            </div>
        </div>
    );
}

export default GettingStarted;
