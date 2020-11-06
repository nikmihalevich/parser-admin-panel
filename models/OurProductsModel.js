const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ourProductsSchema = new Schema({
    product_id: {
        type: Number
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    params: {
        weight: {
            type: String
        },
        weight_class_id: {
            type: Number
        },
        isConverted: {
            type: Boolean
        },
        unit: {
            type: String
        }
    },
}, { timestamps: true });

const OurProducts = mongoose.model("our_products", ourProductsSchema);

module.exports = OurProducts;