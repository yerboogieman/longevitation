import CaseList from "./components/CaseList.tsx";
import Clients from "./components/Clients.tsx";
import Users from "./components/Users.tsx";
import ScoreInfo from "./components/ScoreInfo.tsx";
import Summary from "./components/Summary.tsx";
import HealthCategoryViews from "./components/HealthCategoryViews.tsx";
import HealthCategoriesListView from "./components/HealthCategoriesListView.tsx";
import HealthCategoriesTabbedView from "./components/HealthCategoriesTabbedView.tsx";
import GettingStarted from "./components/GettingStarted.tsx";
import {AppContainer} from '@customation/ui';
import '@customation/ui/dist/ui.css';
import {accountMenuItems} from "./menu-data/account-menu-items.ts";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

function App() {

    const data = {
        gender: "female",
        score: 88,
        setupComplete: true,
    };

    const styles = {
        backgroundColor: "#f8f9fa",
        maxWidth: '1200px',
        topNav: {
            backgroundColor: "#000080",
            color: "#ffffff",
            height: "50px",
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
                        <Route path="/" element={<Navigate to={data.setupComplete ? "/score-info" : "/getting-started"} replace/>}/>
                        <Route path="/score-info/*" element={data.setupComplete ? (
                            <ScoreInfo score={data.score}
                                gender={data.gender}
                                styles={{
                                    inactiveColor: "#6c757d",
                                    inactiveBackgroundColor: "#f8f9fa"
                                }}/>
                        ) : (
                            <Navigate to="/getting-started" replace/>
                        )}>
                            <Route index element={<Summary/>}/>
                            <Route path="categories" element={<HealthCategoryViews/>}>
                                <Route index element={<Navigate to="tabbed-view" replace/>}/>
                                <Route path="list-view" element={<HealthCategoriesListView/>}/>
                                <Route path="tabbed-view" element={<HealthCategoriesTabbedView/>}/>
                            </Route>
                        </Route>
                        <Route path="/getting-started" element={<GettingStarted/>}/>
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
