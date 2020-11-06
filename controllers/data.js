const OurProducts = require("../models/OurProductsModel");
const Okey = require("../models/OkeyModel");
const Vprok = require("../models/VprokModel");
const User = require("../models/UserModel");
const createDataForTable = require("../helpers/createDataForTable");

module.exports = (router) => {
  const routes = router();

  // get data
  routes.get("/", async (req, res) => {
    const ourProducts = await OurProducts.find({}).lean();
    const vprok = await Vprok.find({});
    const okey = await Okey.find({});

    let data = await createDataForTable(ourProducts, vprok, okey);

    res.status(200).json({
      success: true,
      data,
    });
  });

  routes.get("/lastupdate", async (req, res) => {
    const ourProducts = await OurProducts.find({}).limit(1);
    const vprok = await Vprok.find({}).limit(1);
    const okey = await Okey.find({}).limit(1);

    console.log();

    let lastUpdate = {
      our_products: ourProducts[0].updatedAt,
      vprok: vprok[0].updatedAt,
      okey: okey[0].updatedAt,
    };

    res.status(200).json({
      success: true,
      lastUpdate,
    });
  });

  return routes;
};
