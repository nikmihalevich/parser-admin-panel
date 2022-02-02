const tress = require("tress");
const cheerio = require("cheerio");
const underscore = require("underscore");
const axios = require("axios");

const DixyModel = require("../models/DixyModel");

let results = [];

const q = tress((job, callback) => {
  Dixy(job.URL, job.product, job.percent, callback);
}, 10);

const parseDixyData = async (html, product, percent, callback) => {
  // парсим DOM
  let $ = cheerio.load(html);

  let productNameTemplate =
    product.name //+ " " + product.params.weight + product.params.unit;
  let productNameTemplateDirtArr = productNameTemplate.trim().toLowerCase().split(" ");
  let productNameTemplateArr = underscore.without(productNameTemplateDirtArr, '')
  
  let productNameTemplateArrLength = productNameTemplateArr.length;
  let productPrice;
  let productWeight = 0;

  $(".catalog_item_wrapp").each(async (i, elem) => {
    let productTitle = $(elem).find(".item-title").find('span').text();

    let productTitleArray = [];

    productTitleArray = productTitle.trim().toLowerCase().split(" ");

    productWeight = parseFloat(
      productTitleArray[productTitleArray.length - 2].match(/\d.(\d+)/)
    );

    if (!productWeight) return;

    if (typeof productWeight === "number") {
      productWeight = productWeight.toString();
    }

    // if (productWeight !== product.params.weight) return;

    if (
      underscore.intersection(productTitleArray, productNameTemplateArr)
        .length >=
      productNameTemplateArrLength - 2
    ) {
      productPrice = parseFloat(
        $(elem).find("span.price_value").text()
      );
    }

    if (!productPrice) return;

    let comparePercent = ((productPrice / product.price) * 100) - 100

    // if(percent) {
    //   if(Math.abs(comparePercent) > percent) return;
    // }

    if(product.deviant_percent) {
      if(Math.abs(comparePercent) > product.deviant_percent) return;
    } else {
      if(percent) {
        if(Math.abs(comparePercent) > percent) return;
      }
    }

    let result = {
      product_id: product.product_id,
      price: productPrice,
    };

    let same = results.some(function(e) {
      return e.product_id == result.product_id
    })

    if(!same) {
      results.push(result);

      let dixy = await new DixyModel(result);
      await dixy.save();
    }
  });

  callback(null, "done");
};

const Dixy = (url, product, percent, callback) => {
  axios.get(url).then((res) => parseDixyData(res.data, product, percent, callback));
};

module.exports = async (products, percent, cb) => {
  return new Promise((resolve, reject) => {
    q.drain = () => {
      resolve();
    };
    for (let i = 0; i < products.length; i++) {
      let URL = encodeURI(
        "https://dostavka.dixy.ru/catalog/?q=" +
          products[i].name.toLowerCase()
      );
      q.push({ URL, product: products[i], percent });
    }
  });
};
