const OurProducts = require("../models/OurProductsModel");
const Okey = require("../models/OkeyModel");
const User = require("../models/UserModel");
const okeyParser = require("../core/okeyParser");
const calcAveragePrice = require("../helpers/calcAveragePrice");

module.exports = (router) => {
  const routes = router();

  // get all
  routes.get("/", async (req, res) => {
    const okey = await Okey.find({});

    res.status(200).json({
      products: okey,
      success: true,
    });
  });

  // get product by id
  routes.get("/:id", async (req, res) => {
    const { id } = req.body;

    const product = await Okey.findById(id);

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
    const { _id } = req.body;

    const user = await User.findById(_id);

    if (!user)
      return res.status(401).json({
        message: "У вас нет доступа к выполнению данной команды",
        success: false,
      });

    const ourProducts = await OurProducts.find({});

    await Okey.deleteMany({});

    await okeyParser(ourProducts);

    const okeyProducts = await Okey.find({});

    await calcAveragePrice(Okey, okeyProducts);

    res.status(200).json({
      message: "Парсинг Окея начат",
      success: true,
    });
  });

  // TODO dodelat

  return routes;
};
