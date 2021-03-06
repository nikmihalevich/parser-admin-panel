const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vprokSchema = new Schema(
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

const Vprok = mongoose.model("vprok", vprokSchema);

module.exports = Vprok;
