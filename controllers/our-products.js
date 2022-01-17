const OurProducts = require("../models/OurProductsModel");
const User = require("../models/UserModel");
const getOurProducts = require("../helpers/getOurProducts");
const importOurProducts = require("../helpers/importOurProducts");
const updateOurProductsPrice = require("../helpers/updateOurProductsPrice");

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

  // takes 'data' (array of objects) 
  routes.post("/import", async (req, res) => {
    const { _id, data } = req.body

    const user = await User.findById(_id);

    if (!user)
      return res.status(401).json({
        message: "У вас нет доступа к выполнению данной команды",
        success: false,
      });
    
    let result = await importOurProducts(data)

    res.status(201).json({
      success: result.success,
      message: result.message
    })
  });

  // update our product prices into MySQL DB by average calculated price from other shops  
  routes.post("/updatePrices", async (req, res) => {
    const { _id, data } = req.body

    const user = await User.findById(_id);

    if (!user)
      return res.status(401).json({
        message: "У вас нет доступа к выполнению данной команды",
        success: false,
      });
    
    let result = await updateOurProductsPrice(data)

    res.status(201).json({
      success: result.success,
      message: result.message
    })
  });
 
  return routes;
};
