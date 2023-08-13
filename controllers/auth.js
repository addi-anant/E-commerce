const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Token = require("../models/Token");
const tokenGeneration = require("../utils/TokenGeneration");
const validatePassword = require("../utils/validatePassword");
const {
  verifyEmail,
  updatePassword,
  successful,
} = require("../utils/NodeMailer");

/* Login: GET */
module.exports.login_GET = (req, res) => {
  if (req?.session?.isLoggedIn) return res.redirect("/");

  return res.render("login", { user: null });
};

/* Login: POST */
module.exports.login_POST = async (req, res) => {
  const { email, password } = req.body;

  // Both email and password are required:
  if (email === "" || password === "") return res.status(400).send();

  try {
    const user = await User.findOne({ email: email, password: password });

    // No user with provided credentials:
    if (!user) return res.status(404).send();

    // check for Email verification:
    if (!user.verified) return res.status(401).send();

    // Valid Credentials:
    req.session.user = user.name;
    req.session.isLoggedIn = true;
    req.session.admin = user.admin;
    req.session.cartID = user.cart;
    req.session.email = user.email;

    return res.status(200).send();
  } catch (Error) {
    console.log(`Error while Login: ${Error}`);
    return res.status(500).json(Error);
  }
};

/* Register: GET */
module.exports.register_GET = (req, res) => {
  if (req?.session?.isLoggedIn) return res.redirect("/");

  return res.render("register", {
    user: null,
  });
};

/* Register: POST */
module.exports.register_POST = async (req, res) => {
  const { name, email, password } = req.body;

  // All field are required:
  if (name === "" || email === "" || password === "")
    return res.status(400).send();

  // validate password:
  if (!validatePassword(password)) return res.status(406).send();

  try {
    // check for existing user with provided Email:
    const Exist = await User.findOne({ email: email });

    // Email already in use:
    if (Exist) return res.status(401).send();

    // create cart for user:
    const cart = await Cart.create({});

    // Create New USER:
    await User.create({
      name: name,
      email: email,
      cart: cart._id,
      password: password,
    });

    // GENERATE TOKEN FOR VERIFICATION:
    const token = await tokenGeneration(email);

    // SEND LINK FOR EMAIL VERIFICATION:
    await verifyEmail(email, token, req.headers.host);

    return res.status(200).send();
  } catch (Error) {
    console.log(`Error while Registeration: ${Error}`);
    return res.status(500).json(Error);
  }
};

/* Verify Email: */
module.exports.verifyEmail_GET = async (req, res) => {
  const { token } = req.params;

  /* check if Token Exist in DB: */
  const isValid = await Token.find({ token: token });
  if (isValid?.length === 0) return res.redirect("/auth/invalid-token");

  /* Verifying the JWT token */
  jwt.verify(token, process.env.JWT_SECRET, async (Error, decoded) => {
    if (Error) {
      console.log(`Error while verifying JWT token: ${Error}`);
      return res.redirect("/auth/invalid-token");
    }

    const email = decoded.email;
    await User.findOneAndUpdate({ email }, { $set: { verified: true } });
    await Token.findOneAndDelete({ email });

    /* Verfied Email: */
    const user = await User.findOne({ email });
    req.session.user = user.name;
    req.session.isLoggedIn = true;
    req.session.admin = user.admin;
    req.session.cartID = user.cart;
    req.session.email = user.email;
    res.redirect("/");
  });
};

/* Forgot Password: GET */
module.exports.forgotPassword_GET = (req, res) => {
  return res.render("updatePassword", {
    user: req.session.user,
    heading: "Forgot Password",
  });
};

/* Forgot Password - POST: */
module.exports.updatePassword_POST = async (req, res) => {
  const { email } = req.body;

  if (email === "") return res.status(400).send();

  // CHECK IF ANY USER WITH PROVIDED EMAIL EXISTS:
  const Exist = await User.findOne({ email: email });
  if (!Exist) return res.status(404).send();

  // GENERATE TOKEN FOR VERIFICATION:
  const token = await tokenGeneration(email);

  // SEND MAIL FOR VERIFICATION:
  await updatePassword(email, token, req.headers.host);

  return res.status(200).send();
};

/* Reset Password: GET */
module.exports.resetPassword_GET = (req, res) => {
  if (!req.session.isLoggedIn) return res.redirect("/");

  return res.render("newPassword", {
    user: req.session.user,
    heading: "Reset Password",
  });
};

/* NEW Password - GET: */
module.exports.newPassword_GET = (req, res) => {
  return res.render("newPassword", {
    user: req.session.user,
    heading: "Enter New Password",
  });
};

/* NEW Password - POST: */
module.exports.newPassword_POST = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password === "" || confirmPassword === "") return res.status(400).send();

  if (password !== confirmPassword) return res.status(409).send();

  // validate password:
  if (!validatePassword(password)) return res.status(406).send();

  /* token === undefined -> RESET PASSWORD */
  if (token === "undefined") {
    await User.findOneAndUpdate(
      { email: req.session.email },
      { $set: { password: password } }
    );

    /* password successfully updated mail! */
    await successful(req.session.email);

    /* Remove user from session: */
    req.session.destroy();

    return res.status(200).send();
  }

  /* check if Token Exist in DB: */
  const isValid = await Token.find({ token: token });

  if (isValid?.length === 0 || isValid?.length === "[]")
    return res.status(500).send();

  // VERIFY TOKEN AND UPDATE PASSWORD:
  jwt.verify(token, process.env.JWT_SECRET, async (Error, decoded) => {
    const email = decoded.email;

    await User.findOneAndUpdate({ email }, { $set: { password: password } });
    await Token.findOneAndDelete({ email });

    if (Error) {
      console.log(`Error while verifying JWT token: ${Error}`);
      return res.status(500).send();
    }

    /* password successfully updated mail! */
    await successful(email);

    /* Remove user from session: */
    req.session.destroy();

    return res.status(200).send();
  });
};

/* LOGOUT - GET: */
module.exports.logout_GET = (req, res) => {
  req.session.destroy();
  return res.redirect("/auth/login");
};

/* Invalid Token: */
module.exports.invalid_token_GET = (req, res) => {
  return res.render("invalidURL", { user: req.session.user });
};
