import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Navbar from "../layout/Navbar";

class Dashboard extends Component {

  render() {
    // const { user } = this.props.auth;

    return (
      <>
        <Navbar route="dashboard" />  
        <section id="main-content">
          <section className="wrapper">
            <div className="row">
              <div className="col-lg-9 main-chart">
                <div className="border-head">
                  <h3>Информационная панель</h3>
                </div>
              </div>
            </div>
          </section>
        </section>
      </>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(Dashboard);
