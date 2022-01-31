const tress = require("tress");

const q = tress((job, callback) => {
  _create(job.ourProducts, job.vprokProducts, job.okeyProducts, job.dixyProducts, callback);
}, 10);

let resultArray = [];

module.exports = (ourProducts, vprokProducts, okeyProducts, dixyProducts) => {
  return new Promise((resolve, reject) => {
    q.drain = () => {
      resolve(ourProducts);
    };
    q.push({ ourProducts, vprokProducts, okeyProducts, dixyProducts });
  });
};

const _create = async (ourProducts, vprokProducts, okeyProducts, dixyProducts, callback) => {
  let greatesLength = Math.max(vprokProducts.length, okeyProducts.length, dixyProducts.length);

  ourProducts = ourProducts.map((product, key) => {
    for (let j = 0; j < greatesLength; j++) {
      if(vprokProducts[j])
        if (product.product_id === vprokProducts[j].product_id)
          product.vprok_price = vprokProducts[j].price;

      if(okeyProducts[j])
        if (product.product_id === okeyProducts[j].product_id)
          product.okey_price = okeyProducts[j].price;

      if(dixyProducts[j])
        if (product.product_id === dixyProducts[j].product_id)
          product.dixy_price = dixyProducts[j].price;
    }
    return product;
  });

  callback(null, "Done");
};
