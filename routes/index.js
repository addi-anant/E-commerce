const router = require("express").Router();
const index = require("../controllers/index");

// Home - GET:
router.get("/", index.home_GET);

// Fetch Product (:limit) - GET:
router.get("/fetch-product/:limit", index.fetch_product_GET);

// Fetch individual Product (:id) - GET:
router.get("/product/:id", index.product_GET);

// auth route:
router.use("/auth", require("./auth"));

// user route:
router.use("/user", require("./user"));

// admin route:
router.use("/admin", require("./admin"));

module.exports = router;
