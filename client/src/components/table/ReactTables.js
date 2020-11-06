import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// reactstrap components
import { Col } from "reactstrap";
import Loader from "react-loader-spinner";

import { getShopsData } from "../../actions/shopsActions";

// core components
import ReactTable from "../ReactTable/ReactTable";
import Navbar from "../layout/Navbar";

class ReactTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    this.setData();
  }

  componentDidMount() {
    setInterval(() => {
      while (!this.state.data.length) {
        this.setData();
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.refresher);
  }

  setData() {
    this.setState({
      data: this.props.shops_data.map((prop, key) => {
        let vprok = prop.vprok_price ? prop.vprok_price : 0;
        let okey = prop.okey_price ? prop.okey_price : 0;
        let dixy = prop.dixy_price ? prop.dixy_price : 0;

        let shops_prices = this.counter([vprok, okey, dixy]);

        let ap = shops_prices ? (vprok + okey + dixy) / shops_prices : 0;
        // let p = prop.price
        //   ? ap
        //     ? ((prop.price - ap) / prop.price) * 100
        //     : 0
        //   : 0;

        let p = 0;

        if (prop.price && ap) p = ((ap - prop.price) / prop.price) * 100;

        return {
          id: key + 1,
          category: prop.category,
          name: prop.name + " " + prop.params.weight + " " + prop.params.unit,
          product_id: prop.product_id,
          our_price: prop.price,
          vprok_price: vprok,
          okey_price: okey,
          // dixy_price: dixy,
          average_price: ap.toFixed(2),
          percent: p.toFixed(2),
        };
      }),
    });
  }

  counter = (prices) => {
    let count = 0;
    // eslint-disable-next-line
    prices.map((price, key) => {
      if (price !== 0) count++;
    });
    // eslint-disable-next-line
    return count;
  };

  render() {
    return (
      <>
        <Navbar route="table" />
        <section id="main-content">
          <section className="wrapper">
            <div className="row">
              <div className="col-lg-9 main-chart">
                <div className="border-head">
                  <h3>Отчет</h3>
                </div>
              </div>
              <Col lg="12">
                {!this.state.data.length ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "100px",
                    }}
                  >
                    <Loader
                      type="Circles"
                      color="#c9cdd7"
                      height={100}
                      width={100}
                    />
                  </div>
                ) : (
                  <ReactTable
                    data={this.state.data}
                    columns={[
                      {
                        Header: "#",
                        accessor: "id",
                        filterable: false,
                      },
                      {
                        Header: "Категория",
                        accessor: "category",
                      },
                      {
                        Header: "Продукт",
                        accessor: "name",
                      },
                      {
                        Header: "ID Продукта",
                        accessor: "product_id",
                      },
                      {
                        Header: "Наша цена",
                        accessor: "our_price",
                        filterable: false,
                      },
                      {
                        Header: "Цена в Перекрестке",
                        accessor: "vprok_price",
                        filterable: false,
                      },
                      {
                        Header: "Цена в Окее",
                        accessor: "okey_price",
                        filterable: false,
                      },
                      // {
                      //   Header: "Цена в Диксе",
                      //   accessor: "dixy_price",
                      //   filterable: false,
                      // },
                      {
                        Header: "Средняя цена",
                        accessor: "average_price",
                        filterable: false,
                      },
                      {
                        Header: "%",
                        accessor: "percent",
                        filterable: false,
                      },
                    ]}
                    className="-striped -highlight primary-pagination"
                  />
                )}
              </Col>
            </div>
          </section>
        </section>
      </>
    );
  }
}

ReactTables.propTypes = {
  getShopsData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  shops_data: state.shops.shops_data,
  data_loading: state.shops.data_loading,
});

export default connect(mapStateToProps, { getShopsData })(ReactTables);
