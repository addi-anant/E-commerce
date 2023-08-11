const Product = require("../models/Product");

module.exports.home_GET = async (req, res) => {
  try {
    return res.render("home", {
      user: req.session.user,
    });
  } catch (Error) {
    console.log(`Error while getting products: ${Error})`);
    return res.status(500).json(Error);
  }
};

module.exports.fetch_product_GET = async (req, res) => {
  const { limit } = req.params;
  try {
    const productList = await Product.find({})
      .skip(limit - 5)
      .limit(5);
    return res.status(200).json(productList);
  } catch (Error) {
    console.log(`Error while getting products: ${Error})`);
    return res.status(500).json(Error);
  }
};

module.exports.product_GET = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (Error) {
    console.log(`Error while getting products: ${Error})`);
    return res.status(500).json(Error);
  }
};
