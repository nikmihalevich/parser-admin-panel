const OurProducts = require("../models/OurProductsModel");
const Dixy = require("../models/DixyModel");
const User = require("../models/UserModel");
const dixyParser = require("../core/dixyParser");
const calcAveragePrice = require("../helpers/calcAveragePrice");

module.exports = (router) => {
  const routes = router();

  // get all
  routes.get("/", async (req, res) => {
    const dixy = await Dixy.find({});

    res.status(200).json({
      products: dixy,
      success: true,
    });
  });

  // get product by id
  routes.get("/:id", async (req, res) => {
    const { id } = req.body;

    const product = await Dixy.findById(id);

    if (!product)
      return res.status(404).json({
        message: "Товар не найден",
        success: false,
      });

    res.status(200).json({
      product,
      success: true,
    });
  });

  routes.post("/parse", async (req, res) => {
    const { _id, percent } = req.body;

    const user = await User.findById(_id);

    if (!user)
      return res.status(401).json({
        message: "У вас нет доступа к выполнению данной команды",
        success: false,
      });

    const ourProducts = await OurProducts.find({});

    await Dixy.deleteMany({});

    await dixyParser(ourProducts, percent);

    const dixyProducts = await Dixy.find({});

    await calcAveragePrice(Dixy, dixyProducts);

    res.status(200).json({
      message: "Парсинг Дикси начат",
      success: true,
    });
  });

  // TODO dodelat

  return routes;
};
