const Product = require("../models/Product");

const router = require("express").Router();

router.get("/", (req, res) => {
  return res.render("adminHome");
});

router.get("/add-product-form", (req, res) => {
  return res.render("addProductForm");
});

router.post("/add-product", async (req, res) => {
  const product = new Product({
    ...req.body,
    img: req.file.filename,
  });

  try {
    await product.save();
    return res.redirect("/admin/add-product-form");
  } catch (Error) {
    console.log(`Error while creating product: ${Error}`);
    return res.status(500).json(Error);
  }
});

router.put("/edit-product", (req, res) => {});

router.post("/delete-product", (req, res) => {});

module.exports = router;
