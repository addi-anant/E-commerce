const router = require("express").Router();
const Product = require("../models/Product");

router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/admin", require("./admin"));

router.get("/", async (req, res) => {
  try {
    const productList = await Product.find({});
    return res.render("home", {
      user: req.session.user,
      productList: productList,
    });
  } catch (Error) {
    console.log(`Error while getting products: ${Error})`);
    return res.status(500).json(Error);
  }
});

router.get("/products", async (req, res) => {
  try {
    const productList = await Product.find({});
  } catch (Error) {
    console.log(`Error while getting products: ${Error})`);
    return res.status(500).json(Error);
  }
});

module.exports = router;
