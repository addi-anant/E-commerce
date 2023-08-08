const router = require("express").Router();

router.get("/", (req, res) => {
  return res.render("adminHome");
});

router.get("/add-product-form", (req, res) => {
  return res.render("addProductForm");
});

router.post("/add-product", (req, res) => {
  const product = {
    ...req.body,
    file: req.file.filename,
  }; /* 'Product' to be stored in DB. */

  return res.status(200).json("added successfully");
});

router.put("/edit-product", (req, res) => {});

router.post("/delete-product", (req, res) => {});

module.exports = router;
