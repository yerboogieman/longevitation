import "./App.css";
import ScoreInfo from "./components/ScoreInfo.tsx";
import Overview from "./components/Overview.tsx";
import Routine from "./components/Routine.tsx";
import Lifestyle from "./components/Lifestyle.tsx";
import LifestyleCategories from "./components/lifestyle/Categories.tsx";
import Tracker from "./components/lifestyle/Tracker.tsx";
import Stats from "./components/Stats.tsx";
import Shop from "./components/Shop.tsx";
import Diet from "./components/diet/Diet.tsx";
import Menu from "./components/diet/Menu.tsx";
import Recipes from "./components/diet/Recipes.tsx";
import ShoppingList from "./components/diet/ShoppingList.tsx";
import HealthyFood from "./components/shop/HealthyFood.tsx";
import Devices from "./components/shop/Devices.tsx";
import Services from "./components/shop/Services.tsx";
import Supplements from "./components/shop/Supplements.tsx";
import Tests from "./components/shop/Tests.tsx";
import HealthCategoryViews from "./components/HealthCategoryViews.tsx";
import HealthCategoriesListView from "./components/HealthCategoriesListView.tsx";
import HealthCategoriesTabbedView from "./components/HealthCategoriesTabbedView.tsx";
import GettingStarted from "./components/GettingStarted.tsx";
import {AppContainer, AuthProvider, LanguageProvider, LoginPage, ProtectedRoute} from '@customation/ui';
import '@customation/ui/dist/ui.css';
import {accountMenuItems} from "./menu-data/account-menu-items.ts";
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {leftNavMenuItems} from "./menu-data/left-nav-menu-items.ts";

function App() {

    const data = {
        gender: "female",
        score: 88,
        setupComplete: false,
    };

    const styles = {
        backgroundColor: "#f8f9fa",
        leftNav: {
            collapsed: true,
            verticalOffset: "-74px"
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
            },
            showLanguageSelector: true,
        },
        footer: {
            backgroundColor: "#f8f9fa"
        }
    };

    return (
        <BrowserRouter>
            <LanguageProvider>
                <AuthProvider>
                    <div className="App">
                        <AppContainer accountMenuItems={accountMenuItems}
                                      leftNavMenuItems={leftNavMenuItems}
                                      styles={styles}>
                            <div style={{paddingLeft: '10px', width: '100%'}}>
                                <Routes>
                                    <Route path="/login" element={<LoginPage/>}/>
                                    <Route element={<ProtectedRoute/>}>
                                        <Route path="/"
                                               element={<Navigate to={data.setupComplete ? "/overview" : "/getting-started"}
                                                                  replace/>}/>
                                        <Route element={
                                            <ScoreInfo score={data.score}
                                                       gender={data.gender}
                                                       styles={{
                                                           inactiveColor: "#6c757d",
                                                           inactiveBackgroundColor: "#f8f9fa"
                                                       }}/>
                                        }>
                                            <Route path="/overview" element={<Overview/>}/>
                                            <Route path="/routine" element={<Routine/>}/>
                                            <Route path="/stats" element={<Stats/>}/>
                                            <Route path="/lifestyle" element={<Lifestyle/>}>
                                                <Route index element={<Navigate to="categories" replace/>}/>
                                                <Route path="categories" element={<LifestyleCategories/>}/>
                                                <Route path="tracker" element={<Tracker/>}/>
                                            </Route>
                                            <Route path="/shop" element={<Shop/>}>
                                                <Route index element={<Navigate to="devices" replace/>}/>
                                                <Route path="healthy-food" element={<HealthyFood/>}/>
                                                <Route path="devices" element={<Devices/>}/>
                                                <Route path="services" element={<Services/>}/>
                                                <Route path="supplements" element={<Supplements/>}/>
                                                <Route path="tests" element={<Tests/>}/>
                                            </Route>
                                            <Route path="/diet" element={<Diet/>}>
                                                <Route index element={<Navigate to="menu" replace/>}/>
                                                <Route path="menu" element={<Menu/>}/>
                                                <Route path="recipes" element={<Recipes/>}/>
                                                <Route path="shopping-list" element={<ShoppingList/>}/>
                                            </Route>
                                            <Route path="/categories" element={<HealthCategoryViews/>}>
                                                <Route index element={<Navigate to="tabbed-view" replace/>}/>
                                                <Route path="list-view" element={<HealthCategoriesListView/>}/>
                                                <Route path="tabbed-view" element={<HealthCategoriesTabbedView/>}/>
                                            </Route>
                                        </Route>
                                        <Route element={
                                            <ScoreInfo score={data.score}
                                                       gender={data.gender}
                                                       setupComplete={false}
                                                       styles={{
                                                           inactiveColor: "#6c757d",
                                                           inactiveBackgroundColor: "#f8f9fa"
                                                       }}/>
                                        }>
                                            <Route path="/getting-started" element={<GettingStarted/>}/>
                                        </Route>
                                    </Route>
                                </Routes>
                            </div>
                        </AppContainer>
                    </div>
                </AuthProvider>
            </LanguageProvider>
        </BrowserRouter>
    );
}

export default App;
