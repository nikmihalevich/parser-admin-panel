const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const okeySchema = new Schema(
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

const Okey = mongoose.model("okey", okeySchema);

module.exports = Okey;
