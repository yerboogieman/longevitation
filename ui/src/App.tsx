import CaseList from "./components/CaseList.tsx";
import Clients from "./components/Clients.tsx";
import Users from "./components/Users.tsx";
import ScoreInfo from "./components/ScoreInfo.tsx";
import Summary from "./components/Summary.tsx";
import HealthCategories from "./components/HealthCategories.tsx";
import {AppContainer} from '@customation/ui';
import '@customation/ui/dist/ui.css';
import {accountMenuItems} from "./menu-data/account-menu-items.ts";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

function App() {

    const styles = {
        backgroundColor: "#f8f9fa",
        maxWidth: '1200px',
        topNav: {
            backgroundColor: "#000080",
            color: "#ffffff",
            hoverBackgroundColor: "#0000c0",
            logoImage: "longevitation-logo.png",
            menu: {
                offset: "-80px",
                selectedItemColor: "#d3d3d3"
            }
        },
        footer: {
            backgroundColor: "#f8f9fa"
        }
    };

    return (
        <BrowserRouter>
            <div className="App">
                <AppContainer accountMenuItems={accountMenuItems}
                              styles={styles}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/score-info" replace/>}/>
                        <Route path="/score-info" element={<ScoreInfo
                            styles={{
                                inactiveColor: "#6c757d",
                                inactiveBackgroundColor: "#f8f9fa"
                            }}/>}>
                            <Route index element={<Summary/>}/>
                            <Route path="categories" element={<HealthCategories/>}/>
                        </Route>
                        <Route path="/case-list" element={<CaseList/>}/>
                        <Route path="/clients" element={<Clients/>}/>
                        <Route path="/users" element={<Users/>}/>
                    </Routes>
                </AppContainer>
            </div>
        </BrowserRouter>
    );
}

export default App;
