import {useState} from "react";

interface WorkflowCategory {
    id: string;
    label: string;
    icon: string;
    viewBox?: string;
    activeColor: string;
}

interface WorkflowManagerProps {
    styles: {
        inactiveColor: string;
        inactiveBackgroundColor: string;
    };
}

const workflowCategories: WorkflowCategory[] = [
    {
        id: "cardiovascular",
        label: "Cardiovascular Health",
        icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
        activeColor: "#dc3545"
    },
    {
        id: "body-composition",
        label: "Body Composition",
        icon: "M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z",
        activeColor: "#b78765"
    },
    {
        id: "gut-health",
        label: "Gut Health",
        icon: "M189.037,74.668c-7.97-32.176-34.188-32.853-48.274-33.216c-2.92-0.075-5.442-0.14-7.13-0.438c-8.423-1.487-13.116-7.29-14.345-17.741l-1.306-11.096c-0.23-1.956-1.849-3.453-3.816-3.53L97.522,7.994c-1.102-0.05-2.163,0.366-2.949,1.133c-0.786,0.766-1.223,1.822-1.208,2.919c0.014,1.013,0.457,25.028,10.605,43.634c5.42,9.936,15.738,34.799-5.449,51.042c-9.796,7.51-18.104,10.859-26.936,10.86c-5.97,0-12.088-1.415-20.025-3.697c-3.727-1.072-7.666-1.615-11.705-1.615c-15.869,0-29.768,8.159-34.586,20.302c-5.796,14.609-5.345,20.325-5.196,21.322c0.293,1.958,1.976,3.408,3.956,3.408H21c2.209,0,4-1.791,4-4c0-0.41,0.17-10.033,14.928-10.033c6.74,0,8.533,3.229,11.946,10.532c3.37,7.212,7.564,16.188,20.119,21.465c10.001,4.204,22.022,8.5,35.35,8.501c0.001,0,0.001,0,0.002,0c15.681,0,30.543-5.967,45.435-18.24C186.073,138.086,197.594,109.215,189.037,74.668z",
        viewBox: "0 0 191.756 191.756",
        activeColor: "#BD4F70"
    },
    {
        id: "diet",
        label: "Diet",
        icon: "M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z",
        activeColor: "#969404"
    },
    {
        id: "exercise",
        label: "Exercise",
        icon: "m24 9.53857h-1v-1.53857a.99974.99974 0 0 0 -1-1h-3a.99974.99974 0 0 0 -1 1v4.5h-9v-4.5a.99974.99974 0 0 0 -1-1h-3a.99974.99974 0 0 0 -1 1v1.53857h-1a.99974.99974 0 0 0 -1 1v5.92286a.99974.99974 0 0 0 1 1h1v1.53857a.99974.99974 0 0 0 1 1h3a.99974.99974 0 0 0 1-1v-4.5h9v4.5a.99974.99974 0 0 0 1 1h3a.99974.99974 0 0 0 1-1v-1.53857h1a.99974.99974 0 0 0 1-1v-5.92286a.99974.99974 0 0 0 -1-1z",
        viewBox: "0 0 27 27",
        activeColor: "#2B3233"
    },
    {
        id: "sleep",
        label: "Sleep",
        icon: "M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V7H1v10h22v-6c0-2.21-1.79-4-4-4z",
        activeColor: "#191970"
    },
    {
        id: "vices",
        label: "Vices",
        icon: "M127.36,206.827h32.64v0.107c21.76,0,39.467-20.907,39.467-42.667c0-21.76-17.707-37.333-39.467-37.333v-32c39.36,0,71.467,32,71.467,71.467s-32,71.467-71.467,71.467v-0.107h-32.64c-22.293,0-42.027,15.787-42.027,43.84v27.733h-32V274.24C53.334,235.84,87.467,206.827,127.36,206.827zM53.334,330.667h32v64h-32zM106.667,330.667h320v64h-320zM67.2,154.24c-13.12-12.907-21.333-30.933-21.333-50.773C45.867,64,77.974,32,117.334,32v32c-21.76,0-39.467,17.707-39.467,39.467c0,21.76,17.707,39.467,39.467,39.467v32c-47.893,0-85.333,38.933-85.333,86.827v47.573h-32v-47.68C0,214.187,27.307,173.227,67.2,154.24zM0,330.667h32v64h-32z",
        viewBox: "0 100 426.667 326.667",
        activeColor: "#CC7D0D"
    },
    {
        id: "dental",
        label: "Dental",
        icon: "M511.988,137.894c-0.551-36.742-15.344-71.295-41.652-97.294c-26.304-25.995-61.029-40.383-97.847-40.514c-42.354,0-74.611,22.12-102.753,45.399c-0.032,0-0.064,0-0.096,0c-12.997,0-26.743-7.835-42.596-16.871C204.747,15.903,177,0.086,139.512,0.086c-75.781,0-138.36,61.821-139.5,137.809c-0.491,32.66,13.894,104.722,34.98,175.24c15.023,50.242,45.831,140.218,83.361,178.315c13.376,13.579,27.371,20.465,41.591,20.465c10.491,0,19.984-4.361,27.453-12.609c5.083-5.615,9.27-13.081,12.798-22.824c5.499-15.186,8.936-34.496,12.575-54.942c9.337-52.458,18.456-92.609,43.279-92.756c24.824,0.147,33.943,40.297,43.279,92.756c3.64,20.444,7.077,39.755,12.576,54.942c3.528,9.744,7.714,17.209,12.798,22.824c7.383,8.153,16.742,12.507,27.091,12.607c0.106,0,0.211,0.001,0.319,0.001c0.013,0,0.028,0,0.043,0c0.068,0,0.137-0.001,0.204-0.002c14.117-0.096,28.008-6.98,41.291-20.464c37.528-38.096,68.335-128.072,83.358-178.314C498.095,242.615,512.479,170.554,511.988,137.894zM438.697,301.676c-23.755,79.443-50.557,138.383-73.534,161.708c-4.968,5.044-8.931,7.487-11.476,8.26c-1.254-1.759-3.696-6.127-6.501-16.067c-3.207-11.359-5.773-25.78-8.491-41.048c-4.595-25.815-9.804-55.076-19.946-78.213c-17.034-38.855-43.109-47.341-62.22-47.519c-0.113-0.002-0.227-0.003-0.342-0.003h-0.277c-0.114,0-0.228,0.001-0.342,0.003c-19.11,0.178-45.186,8.664-62.22,47.52c-10.143,23.136-15.351,52.396-19.946,78.213c-2.717,15.268-5.284,29.689-8.49,41.048c-2.818,9.985-5.269,14.346-6.518,16.091c-2.542-0.746-6.535-3.187-11.555-8.283c-22.978-23.325-49.78-82.265-73.535-161.708c-22.116-73.961-33.668-139.277-33.309-163.183c0.815-54.271,45.459-98.423,99.519-98.423c26.891,0,47.652,11.835,67.728,23.277c8.229,4.691,16.576,9.45,25.295,13.345c-19.703,15.489-38.775,26.665-61.056,26.665v39.987c45.343,0,77.946-27.945,109.476-54.969c28.984-24.842,56.361-48.307,91.46-48.307c54.102,0.193,98.778,44.345,99.59,98.423C472.365,162.399,460.812,227.715,438.697,301.676z",
        viewBox: "0 0 512 512",
        activeColor: "#16417C"
    },
    {
        id: "existing-conditions",
        label: "Existing Conditions",
        icon: "M449.771,470.475L416.382,325.79c-3.722-14.89-17.047-25.287-32.394-25.287h-64.876c-9.178-15.069-21.144-28.282-35.291-38.91v-94.647c0-25.164-26.951-40.553-48.323-29.868l-66.778,33.389c-11.385,5.69-18.344,17.135-18.344,29.868v42.705c-0.207,0.071-0.417,0.094-0.622,0.174c-53.773,21.003-88.521,71.886-88.521,129.632c0,76.713,62.409,139.122,139.122,139.122c77.23,0,142.093-63.95,138.875-144.687h18.691l27.063,119.4c4.459,17.802,22.381,28.848,40.498,24.292C443.332,506.511,454.228,488.344,449.771,470.475zM200.353,478.579c-58.301,0-105.732-47.432-105.732-105.732c0-39.568,21.583-74.727,55.754-92.997v42.913c0,18.412,14.866,33.389,33.278,33.389s33.389-14.977,33.389-33.389v-54.647c0.826,0.292,1.658,0.574,2.549,0.738c50.116,9.205,86.495,52.942,86.495,103.994C306.085,431.147,258.654,478.579,200.353,478.579zM256.002,0c-27.617,0-50.084,22.466-50.084,50.084s22.466,50.084,50.084,50.084s50.084-22.466,50.084-50.084S283.619,0,256.002,0z",
        viewBox: "0 0 512 512",
        activeColor: "#3580BB"
    }
];

function HealthCategories({styles}: WorkflowManagerProps) {

    const [selectedCategory, setSelectedCategory] = useState<string>("cardiovascular");
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const {inactiveColor, inactiveBackgroundColor} = styles;
    const hoverBackgroundColor = "#d8dfe9";

    return (
        <div className="pt-3 pe-3 pb-3 ps-2 h-100 w-100">
            <div className="card h-100 w-100">
                <div className="card-header">
                    <span className="h4 fw-bold">Health Categories</span>
                </div>
                <div className="card-body">
                    <div style={{
                        display: "flex",
                        height: "calc(100% + 32px)",
                        minHeight: "400px",
                        margin: "-16px",
                        borderBottomLeftRadius: "8px",
                        borderBottomRightRadius: "8px",
                        overflow: "hidden"
                    }}>
                        <div style={{width: "200px", flexShrink: 0, backgroundColor: inactiveBackgroundColor, borderRight: "1px solid #dee2e6", height: "100%"}}>
                            <ul className="list-group list-group-flush">
                                {workflowCategories.map((category, index) => {
                                    const selectedIndex = workflowCategories.findIndex(c => c.id === selectedCategory);
                                    const isSelected = selectedCategory === category.id;
                                    const isAboveSelected = index === selectedIndex - 1;
                                    const isFirstItem = index === 0;
                                    return (
                                        <li
                                            key={category.id}
                                            className="list-group-item"
                                            onMouseEnter={() => !isSelected && setHoveredCategory(category.id)}
                                            onMouseLeave={() => setHoveredCategory(null)}
                                            style={{
                                                backgroundColor: isSelected ? "#ffffff" : (hoveredCategory === category.id ? hoverBackgroundColor : inactiveBackgroundColor),
                                                padding: 0,
                                                borderTop: (isSelected && !isFirstItem) ? "1px solid #dee2e6" : "none",
                                                borderLeft: isSelected ? "1px solid #dee2e6" : "none",
                                                borderRight: "none",
                                                borderBottom: isSelected ? "1px solid #dee2e6" : (isAboveSelected ? "none" : "1px solid #dee2e6"),
                                                borderTopLeftRadius: isSelected ? "8px" : 0,
                                                borderBottomLeftRadius: isSelected ? "8px" : 0,
                                                marginRight: isSelected ? "-1px" : 0,
                                                position: "relative",
                                                zIndex: isSelected ? 1 : 0
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setSelectedCategory(category.id)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    padding: "12px 16px",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    color: inactiveColor,
                                                    textAlign: "left"
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox={category.viewBox || "0 0 24 24"}
                                                    width="20"
                                                    height="20"
                                                    style={{
                                                        fill: isSelected ? category.activeColor : inactiveColor,
                                                        marginRight: "12px",
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <path d={category.icon}/>
                                                </svg>
                                                <span>{category.label}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div style={{flex: 1, backgroundColor: "#ffffff", padding: "16px"}}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HealthCategories;
