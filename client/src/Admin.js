import React from "react";
import "./admin/css/admin.scss";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { AdminProvider } from "./admin/context";
import Secured from "./admin/routing/Secured";
import Main from "./admin/Main";
import Login from "./admin/Login";

const Admin = () => {
  const match = useRouteMatch();
  return (
    <div className="adminRoot">
      <AdminProvider>
        <Switch>
          <Route exact path={`${match.path}/login`} component={Login} />

          <Secured path={`${match.path}`} component={Main} />
        </Switch>
      </AdminProvider>
    </div>
  );
};

export default Admin;
