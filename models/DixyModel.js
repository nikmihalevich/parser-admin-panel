const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dixySchema = new Schema(
  {
    product_id: {
      type: Number,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Dixy = mongoose.model("dixy", dixySchema);

module.exports = Dixy;
