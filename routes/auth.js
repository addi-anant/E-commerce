const router = require("express").Router();

router.get("/login", (req, res) => {
  return res.render("login", { user: null, required: false, invalid: false });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    return res.render("login", { user: null, required: true, invalid: false });
  }

  // if user doesn't exist:
  // return res.render("login", { user: null, required: false, invalid: true });

  // if user exist:
  return res.redirect("/");
});

router.get("/register", (req, res) => {
  return res.render("register", {
    user: null,
    exist: false,
    required: false,
  });
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (name === "" || email === "" || password === "") {
    return res.render("register", {
      user: null,
      exist: false,
      required: true,
    });
  }

  // check if user already registered:
  // return res.render("register", { user: null, exist: true, required: false });

  // save the user in the database:
  return res.redirect("/auth/login");
});

router.get("/logout", (req, res) => {
  console.log("GET /logout");
});

module.exports = router;
