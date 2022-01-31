const OurProducts = require("../models/OurProductsModel");
const Okey = require("../models/OkeyModel");
const Vprok = require("../models/VprokModel");
const Dixy = require("../models/DixyModel");
const User = require("../models/UserModel");
const createDataForTable = require("../helpers/createDataForTable");

module.exports = (router) => {
  const routes = router();

  // get data
  routes.get("/", async (req, res) => {
    const ourProducts = await OurProducts.find({}).lean();
    const vprok = await Vprok.find({});
    const okey = await Okey.find({});
    const dixy = await Dixy.find({});

    let data = await createDataForTable(ourProducts, vprok, okey, dixy);

    res.status(200).json({
      success: true,
      data,
    });
  });

  routes.get("/lastupdate", async (req, res) => {
    const ourProducts = await OurProducts.find({}).limit(1);
    const vprok = await Vprok.find({}).limit(1);
    const okey = await Okey.find({}).limit(1);
    const dixy = await Dixy.find({}).limit(1);


    let lastUpdate = {
      our_products: ourProducts[0] ? ourProducts[0].updatedAt : null,
      vprok: vprok[0] ? vprok[0].updatedAt : null,
      okey: okey[0] ? okey[0].updatedAt : null,
      dixy: dixy[0] ? dixy[0].updatedAt : null,
    };

    res.status(200).json({
      success: true,
      lastUpdate,
    });
  });

  return routes;
};
