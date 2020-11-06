const OurProducts      = require('../models/OurProductsModel')
const Vprok            = require('../models/VprokModel')
const User             = require('../models/UserModel')

module.exports = (router) => {
    const routes = router();

    // get shops data for table
    routes.get("/", async (req,res) => {
        const vprok = await Vprok.find({})

        res.status(200).json({
            products: vprok,
            success: true
        })
    });

    return routes;
};
