const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: Number,
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("order", orderSchema);
