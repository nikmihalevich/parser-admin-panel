import React, { createRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from "axios";

// reactstrap components
import { Button, Col } from "reactstrap";
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
    this.hiddenFileInput = createRef()
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

        let p = 0;

        if (prop.price && ap) p = ((ap - prop.price) / prop.price) * 100;

        return {
          id: key + 1,
          category: prop.category_name,
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

  exportToCSV = (csvData, fileName) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const ws = XLSX.utils.json_to_sheet(csvData.sort(this.byField("category")));

    const wb = { Sheets: { 'data': this.editColsHeader(ws) }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  byField = (field) => {
    return (a, b) => a[field] > b[field] ? 1 : -1;
  }

  editColsHeader = (sheet) => {
    if(!sheet) return

    for(let key in sheet) {
      if(sheet[key].v === "category")
        sheet[key].v = "Категория"
      else if(sheet[key].v === "name")
        sheet[key].v = "Продукт"
      else if(sheet[key].v === "product_id")
        sheet[key].v = "ID продукта"
      else if(sheet[key].v === "our_price")
        sheet[key].v = "Наша цена"
      else if(sheet[key].v === "vprok_price")
        sheet[key].v = "Цена в Перекрестке"
      else if(sheet[key].v === "okey_price")
        sheet[key].v = "Цена в Окее"
      else if(sheet[key].v === "average_price")
        sheet[key].v = "Средняя цена"
      else if(sheet[key].v === "percent")
        sheet[key].v = "Процент"
    }

    return sheet
    
  }

  handleButtonUploadFile = event => {
    this.hiddenFileInput.current.click()
  }

  handleUploadFile = event => {
    const fileUploaded = event.target.files[0];

    let reader = new FileReader()
    reader.onload = function(e) {
      let bstr = e.target.result
      let wb = XLSX.read(bstr, {type: 'binary'})
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // Convert array of arrays
      const data = XLSX.utils.sheet_to_json(ws);

      axios
        .post("/our-products/import", data)
        .then(res => console.log(res.data))
    }
    reader.readAsBinaryString(fileUploaded);
  }

  render() {
    return (
      <>
        <Navbar route="table" />
        <section id="main-content">
          <section className="wrapper">
            <div className="row">
              <div className="col-lg-9 main-chart">
                <div className="border-head">
                  <h3>
                    Отчет
                    <Button 
                      style={{marginLeft: "10px"}}
                      disabled={!this.state.data.length} 
                      onClick={e => this.exportToCSV(this.state.data, "Отчет от " + new Date().toLocaleDateString())}
                    >
                      Export
                    </Button>
                    <Button 
                      style={{marginLeft: "10px"}}
                      disabled={!this.state.data.length} 
                      onClick={this.handleButtonUploadFile}
                    >
                      Import
                    </Button>
                    <input 
                      type="file" 
                      style={{display:'none'}} 
                      ref={this.hiddenFileInput}
                      onChange={this.handleUploadFile}
                    />
                  </h3>
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
