const router = require("express").Router();
const admin = require("../controllers/admin");

/* Home - GET: */
router.get("/", admin.home_GET);

/* Fetch-Product - GET: */
router.get("/fetch-admin-product", admin.fetch_admin_product_GET);

/* Add-Product-Form - GET: */
router.get("/add-product-form", admin.add_product_form_GET);

/* Add-Product - POST: */
router.post("/add-product", admin.add_product_POST);

/* Edit-Product - POST: */
router.post("/edit-product/:id", admin.edit_product_POST);

/* Delete-Product - GET: */
router.get("/delete-product/:id", admin.delete_product_GET);

module.exports = router;
