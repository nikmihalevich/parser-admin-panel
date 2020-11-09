import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { logoutUser } from "../../actions/authActions";

class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    return (
      <>
        <header className="header black-bg">
          <div className="sidebar-toggle-box">
            <div className="fa fa-bars tooltips" data-placement="right" data-original-title="Toggle Navigation"></div>
          </div>
          <Link to="/" className="logo"><b>Parser<span>Admin</span></b></Link>
          <div className="top-menu">
            <ul className="nav pull-right top-menu">
              <li><a className="logout" href="/" onClick={e => this.onLogoutClick(e)}>Выйти</a></li>
            </ul>
          </div>
        </header>
        <aside>
        <div id="sidebar" className="nav-collapse ">
          <ul className="sidebar-menu" id="nav-accordion">
            <h5 className="centered">Admin</h5>
            <li className="mt">
              <Link className={this.props.route === "dashboard" ? "active" : ""} to="/">
                <i className="fa fa-dashboard"></i>
                <span>Информационная панель</span>
              </Link>
            </li>
            <li>
              <Link className={this.props.route === "parsers" ? "active" : ""} to="/parsers">
                <i className="fa fa-cogs"></i>
                <span>Парсеры</span>
              </Link>
            </li>
            <li>
              <Link className={this.props.route === "table" ? "active" : ""} to="/table">
                <i className="fa fa-th"></i>
                <span>Таблица</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
      </>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
