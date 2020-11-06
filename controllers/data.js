const OurProducts = require("../models/OurProductsModel");
const Okey = require("../models/OkeyModel");
const Vprok = require("../models/VprokModel");
const User = require("../models/UserModel");
const createDataForTable = require("../helpers/createDataForTable");

module.exports = (router) => {
  const routes = router();

  // get all
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

  return routes;
};
