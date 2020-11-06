const tress = require("tress");
const cheerio = require("cheerio");
const underscore = require("underscore");
const axios = require("axios");

const Okey = require("../models/OkeyModel");

const q = tress((job, callback) => {
  OkeyDostavka(job.URL, job.product, callback);
}, 10);

const parseOkeyData = async (html, product, callback) => {
  // parse DOM
  let $ = cheerio.load(html);

  let productNameTemplate =
    product.name + " " + product.params.weight + product.params.unit;
  let productNameTemplateArr = productNameTemplate.toLowerCase().split(" ");
  let productNameTemplateArrLength = productNameTemplateArr.length;

  let ourProductWeight;

  if (product.params.unit !== "л" || product.params.unit !== "кг")
    ourProductWeight = product.params.weight / 1000;
  else ourProductWeight = product.params.weight;

  $(".product.ok-theme").each(async (i, elem) => {
    let pt = $(elem).find(".product-name").find("a").text().trim();
    let pta = pt.toLowerCase().split(" ");
    let ptal = pta.length;

    $(elem).find(".product-weight").find("span").remove();
    let pw = $(elem).find(".product-weight").text().trim()
      ? parseFloat(
          $(elem).find(".product-weight").text().trim().replace(",", ".")
        )
      : 0;

    if (ourProductWeight !== pw) return;

    let pp;

    // check entering name in product title
    if (
      underscore.intersection(pta, productNameTemplateArr).length >=
      productNameTemplateArrLength - 1
    ) {
      if ($(elem).find(".product-price").find("span.label.small.crossed").text()) {
        pp = parseFloat(
          $(elem)
            .find(".product-price")
            .find("span.label.small.crossed")
            .html()
            .toString()
            .split(" ")[1]
            .trim()
            .replace(",", ".")
        );
      } else {
        pp = parseFloat(
          $(elem)
            .find(".product-price")
            .find("span.price.label")
            .html()
            .toString()
            .split(" ")[1]
            .trim()
            .replace(",", ".")
        );
      }
    }

    if (!pp) return;

    let result = {
      product_id: product.product_id,
      price: pp,
    };

    let okey = await new Okey(result);
    await okey.save();
  });

  callback(null, "done");
};

const OkeyDostavka = (url, product, callback) => {
  axios.get(url).then((res) => parseOkeyData(res.data, product, callback));
};

module.exports = async (products, cb) => {
  return new Promise((resolve, reject) => {
    q.drain = () => {
      resolve();
    };
    for (let i = 0; i < products.length; i++) {
      let URL = encodeURI(
        "https://www.okeydostavka.ru/webapp/wcs/stores/servlet/SearchDisplay?categoryId=&storeId=10653&catalogId=12052&langId=-20&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&searchSource=Q&pageView=&beginIndex=0&pageSize=72&searchTerm=" +
          products[i].name.toLowerCase()
      );
      q.push({ URL, product: products[i] });
    }
  });
};
