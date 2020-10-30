const OurProducts    = require('../models/OurProductsModel')
const User           = require('../models/UserModel')
const getOurProducts = require('../helpers/getOurProducts')

module.exports = (router) => {
    const routes = router();

    // get all
    routes.get("/", async (req, res) => {
        const products = await OurProducts.find({})

        res.status(200).json({
            products,
            success: true
        })
    });

    // TODO FIX FIND ONE SEARCH
    // get product by id
    routes.get("/:id", async (req, res) => {
        let { product_id } = req.body

        const product = await OurProducts.findOne({product_id})

        if(!product)
            return res.status(404).json({
                message: "Товар не найден",
                success: false,
            })

        res.status(200).json({
            product,
            success: true
        })
    });

    // get our products from MySQL to MongoDB
    routes.post("/refresh", async (req, res) => {
        const { _id } = req.body

        const user = await User.findById(_id)

        if(!user)
            return res.status(401).json({
                message: "У вас нет доступа к выполнению данной команды",
                success: false,
            })

        const result = await OurProducts.deleteMany({})

        getOurProducts()

        res.status(201).json({
            success: true,
            message: 'Данные о товарах обновлены',
            deletedCount: result.deletedCount
        })
    });


    // TODO dodelat

    return routes;
};
