import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/css/paper-dashboard.css";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth";

const hist = createBrowserHistory();

const checkAuth = (nextState, replace) => {

  let isAuth = localStorage.getItem("_id")

  if(!isAuth)
    replace('/')
}

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/admin" onEnter={checkAuth} render={(props) => <AdminLayout {...props} />} />
      <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
      <Redirect to="/admin/dashboard" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
