const router = require("express").Router();
const Product = require("../models/Product");

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/admin", require("./admin"));

router.get("/", async (req, res) => {
  try {
    return res.render("home", {
      user: req.session.user,
    });
  } catch (Error) {
    console.log(`Error while getting products: ${Error})`);
    return res.status(500).json(Error);
  }
});

router.get("/fetch-product/:limit", async (req, res) => {
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
});

router.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (Error) {
    console.log(`Error while getting products: ${Error})`);
    return res.status(500).json(Error);
  }
});

module.exports = router;
