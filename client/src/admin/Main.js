import React from "react";
import MainBlock from "./components/MainBlock";
import SideBarMenu from "./components/SideBarMenu";
import MainPage from "./pages/MainPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { Switch, Route, useRouteMatch } from "react-router";
import DoodlesPage from "./pages/DoodlesPage";
import OrderPage from "./pages/OrderPage";
import GeneralLayout from "./pages/GeneralLayout";
import Categories from "./pages/Categories";
import Products from "./pages/Products";

const Main = () => {
  const match = useRouteMatch();
  return (
    <div className="main-container">
      <MainBlock>
        <SideBarMenu />
      </MainBlock>
      <MainBlock main title="Главная">
        <Switch>
          <Route exact path={`${match.path}`} component={MainPage} />
          <Route exact path={`${match.path}/about`} component={AboutPage} />
          <Route exact path={`${match.path}/contact`} component={ContactPage} />
          <Route exact path={`${match.path}/doodles`} component={DoodlesPage} />
          <Route exact path={`${match.path}/order`} component={OrderPage} />
          <Route
            exact
            path={`${match.path}/general`}
            component={GeneralLayout}
          />
          <Route
            exact
            path={`${match.path}/categories`}
            component={Categories}
          />
          <Route exact path={`${match.path}/products`} component={Products} />
        </Switch>
      </MainBlock>
    </div>
  );
};

export default Main;
