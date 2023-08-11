const Cart = require("../models/Cart");
const Product = require("../models/Product");

module.exports.cart_GET = (req, res) => {
  // check if user is logged in.
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ message: "Login to view cart." });
  }

  return res.render("cart", { user: req.session.user });
};

// fetch product (:limit)
module.exports.fetch_cart_product_GET = async (req, res) => {
  const { limit } = req.params;
  try {
    const cartList = await Cart.findById(req?.session?.cartID, {
      productList: { $slice: [limit - 5, 5] },
    }).populate({
      path: "productList.productInfo",
    });

    return res.status(200).json(cartList);
  } catch (Error) {
    console.log(`Error while getting cart products: ${Error})`);
    return res.status(500).json(Error);
  }
};

// add product to cart (:id) - doubt
module.exports.add_product_GET = async (req, res) => {
  const { id } = req.params;

  // check if user is logged in.
  if (!req.session.isLoggedIn) {
    console.log("You are not logged in");
    return res.status(401).json({ message: "You are not logged in" });
  }

  try {
    // Check if product is already in cart:
    const alreadyInCart = await Cart.find({
      _id: req?.session?.cartID,
      productList: { $elemMatch: { productInfo: id } },
    });

    if (alreadyInCart.length) {
      return res.status(200).json({ message: "product already in cart!" });
    }

    // add product to cart with quantity = 1.
    await Cart.findByIdAndUpdate(req?.session?.cartID, {
      $push: { productList: { productInfo: id, quantity: 1 } },
    });

    return res
      .status(200)
      .json({ message: "product added to cart successfully" });
  } catch (Error) {
    console.log(`Error while adding product to cart: ${Error}`);
    return res.status(500).json(Error);
  }
};

// increase product quantity from cart (:id)
module.exports.increase_quantity_POST = async (req, res) => {
  const { id } = req.params; /* Product ID */
  const { qty } = req.body; /* count of product in cart */

  /* check if user is logged in. */
  if (!req.session.isLoggedIn)
    return res.status(401).json({ message: "You are not logged in" });

  try {
    /* Check if product have enough stock: */
    const product = await Product.findById(id);

    /* Maximum stock count reached: */
    if (product.quantity <= qty) return res.status(400).send();

    /* find the specified product and update it's Quantity: */
    await Cart.findOneAndUpdate(
      {
        _id: req.session.cartID,
        "productList.productInfo": id,
      },
      { $inc: { "productList.$.quantity": 1 } }
    );

    return res.status(200).send();
  } catch (Error) {
    console.log(`Error while incrementing quantity: ${Error}`);
    return res.status(401).json(Error);
  }
};

// decrease product quantity from cart (:id)
module.exports.decrease_quantity_POST = async (req, res) => {
  const { id } = req.params; /* Product ID */
  const { qty } = req.body; /* count of product in cart */

  /* check if user is logged in. */
  if (!req.session.isLoggedIn)
    return res.status(401).json({ message: "You are not logged in" });

  try {
    /* Minimum Quantity count reached: */
    if (qty === 1) return res.status(400).send();

    /* find the specified product and update it's Quantity: */
    await Cart.findOneAndUpdate(
      {
        _id: req.session.cartID,
        "productList.productInfo": id,
      },
      { $inc: { "productList.$.quantity": -1 } }
    );

    return res.status(200).send();
  } catch (Error) {
    console.log(`Error while decrementing quantity: ${Error}`);
    return res.status(401).json(Error);
  }
};

// delete product from cart (:id)
module.exports.delete_product_GET = async (req, res) => {
  const { id } = req.params;

  // check if user is logged in.
  if (!req.session.isLoggedIn) {
    console.log("You are not logged in");
    return res.status(401).json({ message: "You are not logged in" });
  }

  await Cart.updateOne(
    {
      _id: req.session.cartID,
    },
    { $pull: { productList: { productInfo: id } } }
  );

  return res.status(200).json({ message: "success" });
};
