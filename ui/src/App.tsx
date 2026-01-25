import CaseList from "./components/CaseList.tsx";
import Clients from "./components/Clients.tsx";
import Users from "./components/Users.tsx";
import ScoreInfo from "./components/ScoreInfo.tsx";
import Overview from "./components/Overview.tsx";
import Routine from "./components/Routine.tsx";
import Lifestyle from "./components/Lifestyle.tsx";
import Stats from "./components/Stats.tsx";
import Shop from "./components/Shop.tsx";
import HealthyFood from "./components/shop/HealthyFood.tsx";
import Devices from "./components/shop/Devices.tsx";
import Services from "./components/shop/Services.tsx";
import Supplements from "./components/shop/Supplements.tsx";
import Tests from "./components/shop/Tests.tsx";
import HealthCategoryViews from "./components/HealthCategoryViews.tsx";
import HealthCategoriesListView from "./components/HealthCategoriesListView.tsx";
import HealthCategoriesTabbedView from "./components/HealthCategoriesTabbedView.tsx";
import GettingStarted from "./components/GettingStarted.tsx";
import {AppContainer} from '@customation/ui';
import '@customation/ui/dist/ui.css';
import {accountMenuItems} from "./menu-data/account-menu-items.ts";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {leftNavMenuItems} from "./menu-data/left-nav-menu-items.ts";

function App() {

    const data = {
        gender: "female",
        score: 88,
        setupComplete: true,
    };

    const styles = {
        backgroundColor: "#f8f9fa",
        leftNav: {
            collapsed: true,
            verticalOffset: "-84px"
        },
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
                              leftNavMenuItems={leftNavMenuItems}
                              styles={styles}>
                    <div style={{paddingLeft: '10px', width: '100%'}}>
                    <Routes>
                        <Route path="/" element={<Navigate to={data.setupComplete ? "/overview" : "/getting-started"} replace/>}/>
                        <Route path="/overview" element={data.setupComplete ? (
                            <ScoreInfo score={data.score}
                                gender={data.gender}
                                styles={{
                                    inactiveColor: "#6c757d",
                                    inactiveBackgroundColor: "#f8f9fa"
                                }}/>
                        ) : (
                            <Navigate to="/getting-started" replace/>
                        )}>
                            <Route index element={<Overview/>}/>
                        </Route>
                        <Route path="/routine" element={data.setupComplete ? (
                            <ScoreInfo score={data.score}
                                gender={data.gender}
                                styles={{
                                    inactiveColor: "#6c757d",
                                    inactiveBackgroundColor: "#f8f9fa"
                                }}/>
                        ) : (
                            <Navigate to="/getting-started" replace/>
                        )}>
                            <Route index element={<Routine/>}/>
                        </Route>
                        <Route path="/stats" element={data.setupComplete ? (
                            <ScoreInfo score={data.score}
                                gender={data.gender}
                                styles={{
                                    inactiveColor: "#6c757d",
                                    inactiveBackgroundColor: "#f8f9fa"
                                }}/>
                        ) : (
                            <Navigate to="/getting-started" replace/>
                        )}>
                            <Route index element={<Stats/>}/>
                        </Route>
                        <Route path="/shop" element={data.setupComplete ? (
                            <ScoreInfo score={data.score}
                                gender={data.gender}
                                styles={{
                                    inactiveColor: "#6c757d",
                                    inactiveBackgroundColor: "#f8f9fa"
                                }}/>
                        ) : (
                            <Navigate to="/getting-started" replace/>
                        )}>
                            <Route element={<Shop/>}>
                                <Route index element={<Navigate to="devices" replace/>}/>
                                <Route path="healthy-food" element={<HealthyFood/>}/>
                                <Route path="devices" element={<Devices/>}/>
                                <Route path="services" element={<Services/>}/>
                                <Route path="supplements" element={<Supplements/>}/>
                                <Route path="tests" element={<Tests/>}/>
                            </Route>
                        </Route>
                        <Route path="/lifestyle" element={data.setupComplete ? (
                            <ScoreInfo score={data.score}
                                gender={data.gender}
                                styles={{
                                    inactiveColor: "#6c757d",
                                    inactiveBackgroundColor: "#f8f9fa"
                                }}/>
                        ) : (
                            <Navigate to="/getting-started" replace/>
                        )}>
                            <Route index element={<Lifestyle/>}/>
                        </Route>
                        <Route path="/categories/*" element={data.setupComplete ? (
                            <ScoreInfo score={data.score}
                                gender={data.gender}
                                styles={{
                                    inactiveColor: "#6c757d",
                                    inactiveBackgroundColor: "#f8f9fa"
                                }}/>
                        ) : (
                            <Navigate to="/getting-started" replace/>
                        )}>
                            <Route element={<HealthCategoryViews/>}>
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
                    </div>
                </AppContainer>
            </div>
        </BrowserRouter>
    );
}

export default App;
