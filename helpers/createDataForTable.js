const tress = require("tress");

const q = tress((job, callback) => {
  _create(job.ourProducts, job.vprokProducts, job.okeyProducts, callback);
}, 10);

let resultArray = [];

module.exports = (ourProducts, vprokProducts, okeyProducts) => {
  return new Promise((resolve, reject) => {
    q.drain = () => {
      resolve(ourProducts);
    };
    q.push({ ourProducts, vprokProducts, okeyProducts });
  });
};

const _create = async (ourProducts, vprokProducts, okeyProducts, callback) => {
  let greatesLength = Math.max(vprokProducts.length, okeyProducts.length);

  ourProducts = ourProducts.map((product, key) => {
    for (let j = 0; j < greatesLength; j++) {
      if(vprokProducts[j])
        if (product.product_id === vprokProducts[j].product_id)
          product.vprok_price = vprokProducts[j].price;

      if(okeyProducts[j])
        if (product.product_id === okeyProducts[j].product_id)
          product.okey_price = okeyProducts[j].price;
    }
    return product;
  });

  callback(null, "Done");
};
