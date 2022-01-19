const OurProducts = require("../models/OurProductsModel");
const Vprok = require("../models/VprokModel");
const User = require("../models/UserModel");
const vprokParser = require("../core/vprokParser");
const calcAveragePrice = require("../helpers/calcAveragePrice");

module.exports = (router) => {
  const routes = router();

  // get all
  routes.get("/", async (req, res) => {
    const vprok = await Vprok.find({});

    res.status(200).json({
      products: vprok,
      success: true,
    });
  });

  // get product by id
  routes.get("/:id", async (req, res) => {
    const { id } = req.body;

    const product = await Vprok.findById(id);

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

    await Vprok.deleteMany({});

    await vprokParser(ourProducts, percent);

    const vprokProducts = await Vprok.find({});

    await calcAveragePrice(Vprok, vprokProducts);

    res.status(200).json({
      message: "Парсинг Перекрестка начат",
      success: true,
    });
  });

  // TODO dodelat

  return routes;
};
