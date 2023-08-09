const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Token = require("../models/Token");
const tokenGeneration = require("../utils/TokenGeneration");
const { verifyEmail, resetPassword } = require("../utils/NodeMailer");

// Login: GET
module.exports.login_GET = (req, res) => {
  return res.render("login", { user: null, error: null });
};

// Login: POST
module.exports.login_POST = async (req, res) => {
  const { email, password } = req.body;

  // Both email and password are required:
  if (email === "" || password === "") {
    return res.render("login", {
      user: null,
      error: "Both username and password are required!",
    });
  }

  try {
    const user = await User.findOne({ email: email, password: password });

    // No user with provided credentials:
    if (!user) {
      return res.render("login", {
        user: null,
        error: "Invalid username or password!",
      });
    }

    // Valid Credentials:
    req.session.user = user.name;
    req.session.isLoggedIn = true;
    req.session.admin = user.admin;

    res.redirect("/");
  } catch (Error) {
    console.log(`Error while Login: ${Error}`);
    return res.status(500).json(Error);
  }
};

// Register: GET
module.exports.register_GET = (req, res) => {
  return res.render("register", {
    user: null,
    error: null,
  });
};

// Register: POST
module.exports.register_POST = async (req, res) => {
  const { name, email, password } = req.body;

  // All Fields are required.
  if (name === "" || email === "" || password === "") {
    return res.render("register", {
      user: null,
      error: "All Fields are required!",
    });
  }

  try {
    // check for existing user with provided Email:
    const Exist = await User.findOne({
      email: email,
    });

    // Email already in use:
    if (Exist) {
      return res.render("register", {
        user: null,
        error: "Email already in use",
      });
    }

    // Create New USER:
    await User.create({
      name: name,
      email: email,
      password: password,
    });

    // GENERATE TOKEN FOR VERIFICATION:
    const token = await tokenGeneration(email);

    // SEND LINK FOR EMAIL VERIFICATION:
    await verifyEmail(email, token);

    return res.render("message", {
      user: req.session.user,
      message: "Link send for verification, Check Your Email!",
    });
  } catch (Error) {
    console.log(`Error while Registeration: ${Error}`);
    return res.status(500).json(Error);
  }
};

// Verify Email:
module.exports.verifyEmail_GET = (req, res) => {
  const { token } = req.params;

  // Verifying the JWT token
  jwt.verify(token, process.env.JWT_SECRET, async (Error, decoded) => {
    const email = decoded.email;

    await User.findOneAndUpdate({ email }, { $set: { verified: true } });
    await Token.findOneAndDelete({ email });

    if (Error) {
      console.log(`Error while verifying JWT token: ${Error}`);
      res.status(500).json(Error);
    }

    res.redirect("/login");
  });
};

// Forgot Password: GET
module.exports.forgotPassword_GET = (req, res) => {
  return res.render("forgotPassword", { user: req.session.user, error: null });
};

// Forgot Password: POST
module.exports.forgotPassword_POST = async (req, res) => {
  const { email } = req.body;

  // CHECK IF ANY USER WITH PROVIDED EMAIL EXISTS:
  const Exist = await User.findOne({ email: email });
  if (!Exist) {
    return res.render("forgotPassword", {
      user: req.session.user,
      error: "No user with provided Email Exist!",
    });
  }

  // GENERATE TOKEN FOR VERIFICATION:
  const token = await tokenGeneration(email);

  // SEND MAIL FOR VERIFICATION:
  await resetPassword(email, token);

  return res.render("message", {
    message: "Link for updating password sent, Check Your Email!",
    user: req.session.user,
  });
};

// NEW Password: GET
module.exports.newPassword_GET = (req, res) => {
  return res.render("newPassword", { user: req.session.user, token: "abc" });
};

// NEW Password: POST
module.exports.newPassword_POST = (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // VERIFY TOKEN AND UPDATE PASSWORD:
  jwt.verify(token, process.env.JWT_SECRET, async (Error, decoded) => {
    const email = decoded.email;

    await User.findOneAndUpdate({ email }, { $set: { password: password } });
    await Token.findOneAndDelete({ email });

    if (Error) {
      console.log(`Error while verifying JWT token: ${Error}`);
      res.status(500).json(Error);
    }

    res.redirect("/auth/login");
  });
};

// LOGOUT:
module.exports.logout_GET = (req, res) => {
  req.session.destroy();
  return res.redirect("/login");
};
