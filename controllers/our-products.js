const OurProducts = require("../models/OurProductsModel");
const User = require("../models/UserModel");
const getOurProducts = require("../helpers/getOurProducts");
const improtOurProducts = require('../helpers/improtOurProducts');
const importOurProducts = require("../helpers/improtOurProducts");

module.exports = (router) => {
  const routes = router();

  // get all
  routes.get("/", async (req, res) => {
    const products = await OurProducts.find({});

    res.status(200).json({
      products,
      success: true,
    });
  });

  // get our products from MySQL to MongoDB
  routes.post("/refresh", async (req, res) => {
    const { _id } = req.body;

    const user = await User.findById(_id);

    if (!user)
      return res.status(401).json({
        message: "У вас нет доступа к выполнению данной команды",
        success: false,
      });

    const result = await OurProducts.deleteMany({});

    getOurProducts();

    res.status(201).json({
      success: true,
      message: "Данные о товарах обновлены",
      deletedCount: result.deletedCount,
    });
  });

  routes.post("/import", async (req, res) => {

    // console.log(req.body)

    importOurProducts()

    res.status(201).json({
      success: true,
      message: "Данные импортированы в БД"
    })
    // const user = await User.findById(_id);

    // if (!user)
    //   return res.status(401).json({
    //     message: "У вас нет доступа к выполнению данной команды",
    //     success: false,
    //   });

    // const result = await OurProducts.deleteMany({});

    // getOurProducts();
  });

  return routes;
};
