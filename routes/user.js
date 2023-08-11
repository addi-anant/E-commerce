const user = require("../controllers/user");
const router = require("express").Router();

router.get("/cart", user.cart_GET);

// fetch product (:limit)
router.get("/fetch-cart-product/:limit", user.fetch_cart_product_GET);

// add product to cart (:id)
router.get("/add-product-cart/:id", user.add_product_GET);

// increase product quantity from cart (:id)
router.post("/increase-quantity/:id", user.increase_quantity_POST);

// decrease product quantity from cart (:id)
router.post("/decrease-quantity/:id", user.decrease_quantity_POST);

// delete product from cart (:id)
router.get("/delete-product/:id", user.delete_product_GET);

module.exports = router;
