const router = require("express").Router();

router.get("/cart", (req, res) => {
  return res.render("cart", { user: "Deepanshu" });
});

module.exports = router;
