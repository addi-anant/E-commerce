const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/admin", require("./admin"));
router.use("/user", require("./user"));

router.get("/", (req, res) => {
  /* send the 'user' to the home page. */
  return res.render("home", { user: "Deepanshu" });
});

module.exports = router;
