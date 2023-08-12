const router = require("express").Router();
const Product = require("../models/Product");

router.get("/", (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect("/auth/login");
  if (!req.session.admin)
    return res.render("adminHome", {
      user: req.session.user,
      notAuthorized: true,
    });

  return res.render("adminHome", {
    user: req.session.user,
    notAuthorized: false,
  });
});

router.get("/fetch-admin-product", async (req, res) => {
  if (!req.session.isLoggedIn && !req.session.admin)
    return res.status(403).send();

  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (Error) {
    console.log(`Fetching Admin Product Error: ${Error}.`);
    return res.status(500).send();
  }
});

router.get("/add-product-form", (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect("/auth/login");
  if (!req.session.admin)
    return res.render("adminHome", {
      user: req.session.user,
      notAuthorized: "You are not authorized to view this page.",
    });

  return res.render("addProductForm");
});

router.post("/add-product", async (req, res) => {
  if (!req.session.isLoggedIn && !req.session.admin)
    return res.status(403).send();

  console.log("here");

  console.log(req);

  console.log(req.body);
  console.log(req?.file?.filename);

  const product = new Product({
    ...req.body,
    img: req?.file?.filename,
  });

  try {
    // await product.save();
    return res.status(201).send();
  } catch (Error) {
    console.log(`Error while creating product: ${Error}`);
    return res.status(500).json(Error);
  }
});

router.post("/edit-product/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;

  if (!req.session.isLoggedIn && !req.session.admin)
    return res.status(403).send();

  try {
    await Product.findByIdAndUpdate(id, {
      $set: { name, description, price, quantity },
    });
    return res.status(200).send();
  } catch (Error) {
    console.log(`Error while deleting Product - Admin: ${Error}.`);
    return res.status(500).send();
  }
});

router.get("/delete-product/:id", async (req, res) => {
  const { id } = req.params;

  if (!req.session.isLoggedIn && !req.session.admin)
    return res.status(403).send();

  try {
    await Product.findByIdAndDelete(id);
    return res.status(200).send();
  } catch (Error) {
    console.log(`Error while deleting Product - Admin: ${Error}.`);
    return res.status(500).send();
  }
});

module.exports = router;
