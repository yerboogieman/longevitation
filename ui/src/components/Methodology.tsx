function Methodology() {

    return (
        <div className="w-100" style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "400px",
            height: "calc(100% + 10px)",
            overflow: "hidden",
            marginTop: "-11px"
        }}>
            <div style={{
                backgroundColor: "#f8f9fa",
                padding: "40px 24px 16px 13px",
                display: "flex",
                alignItems: "flex-end"
            }}>
                <h4 className="fw-bold m-0">Longevitation Methodology</h4>
            </div>
            <div style={{
                flex: 1,
                backgroundColor: "#ffffff",
                borderLeft: "1px solid #dee2e6",
                borderRight: "1px solid #dee2e6",
                borderTop: "1px solid #dee2e6",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{padding: "24px 24px 24px 0"}}>

                    <ol>
                        <li>
                            <span style={{fontWeight: "bold"}}>Score</span>:
                            Discover how you currently measure up to perfect/ideal for each health area
                            (a perfect score for any given area is 1000 and a score of 0 is the worst
                            possible score). We do this by:
                            <ul>
                                <li>
                                    Getting you to answer questions about yourself. (i.e. - your height, weight, age,
                                    etc.)
                                </li>
                                <li>Doing simple at-home tests.</li>
                                <li>Doing lab tests.</li>
                            </ul>
                        </li>
                        <li>
                            <span style={{fontWeight: "bold"}}>Find Root Causes</span>:
                            If you're not perfect in any given health area, troubleshoot
                            to determine possible factors that may be contributing to
                            non-optimum health conditions.
                        </li>
                        <li>
                            <span style={{fontWeight: "bold"}}>Strategize</span>:
                            Based upon what we've learned in the previous troubleshooting
                            step, make a plan to improve your score in each area.
                        </li>
                        <li>
                            <span style={{fontWeight: "bold"}}>Execute</span>:
                            Execute the plan, giving it enough time to see noticeable
                            improvement and give you some wins.
                        </li>
                        <li>
                            <span style={{fontWeight: "bold"}}>Repeat</span>:
                            Keep repeating the above steps, hopefully approaching a perfect 1000
                            score for each health area on each consecutive iteration.
                        </li>
                    </ol>

                </div>
            </div>
        </div>
    );
}

export default Methodology;
