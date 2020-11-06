import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { setCurrentUser } from "./actions/authActions";
import {
  getDateLastUpdateOurProducts,
  getShopsData,
} from "./actions/shopsActions";
import { Provider } from "react-redux";
import store from "./store";

import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Parsers from "./components/parsers/Parsers";
import ReactTables from "./components/table/ReactTables";

// Check for token to keep user logged in
if (localStorage._id) {
  store.dispatch(setCurrentUser(localStorage._id));
}

// start actions
store.dispatch(getDateLastUpdateOurProducts());
store.dispatch(getShopsData());

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/parsers" component={Parsers} />
              <PrivateRoute exact path="/table" component={ReactTables} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
