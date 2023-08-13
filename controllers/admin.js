const Cart = require("../models/Cart");
const Product = require("../models/Product");

/* Home - GET: */
module.exports.home_GET = (req, res) => {
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
};

/* Fetch-Product - GET: */
module.exports.fetch_admin_product_GET = async (req, res) => {
  if (!req.session.isLoggedIn && !req.session.admin)
    return res.status(403).send();

  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (Error) {
    console.log(`Fetching Admin Product Error: ${Error}.`);
    return res.status(500).send();
  }
};

/* Add-Product-Form - GET: */
module.exports.add_product_form_GET = (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect("/auth/login");
  if (!req.session.admin)
    return res.render("adminHome", {
      user: req.session.user,
      notAuthorized: "You are not authorized to view this page.",
    });

  return res.render("addProductForm", { user: req.session.user });
};

/* Add-Product - POST: */
module.exports.add_product_POST = async (req, res) => {
  if (!req.session.isLoggedIn && !req.session.admin)
    return res.status(403).send();

  const product = new Product({
    ...req.body,
    img: req?.file?.filename,
  });

  try {
    await product.save();
    return res.status(200).send();
  } catch (Error) {
    console.log(`Error while creating product: ${Error}`);
    return res.status(500).json(Error);
  }
};

/* Edit-Product - POST: */
module.exports.edit_product_POST = async (req, res) => {
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
};

/* Delete-Product - GET: */
module.exports.delete_product_GET = async (req, res) => {
  const { id } = req.params;

  if (!req.session.isLoggedIn && !req.session.admin)
    return res.status(403).send();

  try {
    /* delete product: */
    await Product.findByIdAndDelete(id);

    /* delete the product from all the cart, where it is stored: */
    await Cart.updateMany(
      { "productList.productInfo": id },
      { $pull: { productList: { productInfo: id } } }
    );

    return res.status(200).send();
  } catch (Error) {
    console.log(`Error while deleting Product - Admin: ${Error}.`);
    return res.status(500).send();
  }
};
