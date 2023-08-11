const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  productList: [
    {
      productInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
