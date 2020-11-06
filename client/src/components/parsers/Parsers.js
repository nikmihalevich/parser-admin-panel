import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Button from "reactstrap-button-loader";

import {
  refreshOurProducts,
  refreshPerekrestok,
  refreshOkey,
} from "../../actions/shopsActions";

import Navbar from "../layout/Navbar";

class Parsers extends Component {
  onOurProductsClick = (e) => {
    e.preventDefault();
    const { user } = this.props.auth;
    this.props.refreshOurProducts(user);
  };

  onPerekrestokClick = (e) => {
    e.preventDefault();
    const { user } = this.props.auth;
    this.props.refreshPerekrestok(user);
  };

  onOkeyClick = (e) => {
    e.preventDefault();
    const { user } = this.props.auth;
    this.props.refreshOkey(user);
  };

  render() {
    return (
      <>
        <Navbar route="parsers" />
        <section id="main-content">
          <section className="wrapper">
            <div className="row">
              <div className="col-lg-9 main-chart">
                <div className="border-head">
                  <h3>Парсеры</h3>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-12">
                    <div className="custom-box">
                      <div className="servicetitle">
                        <h4>Наши продукты</h4>
                        <hr />
                      </div>
                      <p>
                        Данный процесс запустит обновление списка и
                        характеристик наших продуктов для парсинга.{" "}
                        <b>
                          Рекомендуется запускать его перед парсингом, если
                          продуктовая информация поменялась.
                        </b>
                      </p>
                      {this.props.shops.our_products_date_last_update && (
                        <>
                          <p>Дата последнего обновления:</p>
                          <p>
                            <b>
                              {new Date(
                                this.props.shops.our_products_date_last_update
                              ).toLocaleString()}
                            </b>
                          </p>
                        </>
                      )}
                      <Button
                        onClick={(e) => this.onOurProductsClick(e)}
                        loading={this.props.shops.data_loading}
                      >
                        Обновить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                  <div className="custom-box">
                    <div className="servicetitle">
                      <h4>Перекресток</h4>
                      <hr />
                    </div>
                    <Button
                      onClick={(e) => this.onPerekrestokClick(e)}
                      loading={this.props.shops.data_loading}
                    >
                      Парсить
                    </Button>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                  <div className="custom-box">
                    <div className="servicetitle">
                      <h4>Окей</h4>
                      <hr />
                    </div>
                    <Button
                      onClick={(e) => this.onOkeyClick(e)}
                      loading={this.props.shops.data_loading}
                    >
                      Парсить
                    </Button>
                  </div>
                </div>
                {/* <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                  <div className="custom-box">
                    <div className="servicetitle">
                      <h4>Дикси</h4>
                      <hr />
                    </div>
                    <Button
                      onClick={(e) => console.log("Dixy clicked!")}
                      loading={this.props.shops.data_loading}
                    >
                      Парсить
                    </Button>
                  </div>
                </div> */}
              </div>
            </div>
          </section>
        </section>
      </>
    );
  }
}

Parsers.propTypes = {
  refreshOurProducts: PropTypes.func.isRequired,
  refreshPerekrestok: PropTypes.func.isRequired,
  refreshOkey: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  shops: state.shops,
});

export default connect(mapStateToProps, {
  refreshOurProducts,
  refreshPerekrestok,
  refreshOkey,
})(Parsers);
