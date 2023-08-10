const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Token = require("../models/Token");
const tokenGeneration = require("../utils/TokenGeneration");
const { verifyEmail, updatePassword } = require("../utils/NodeMailer");
const validatePassword = require("../utils/validatePassword");

// Login: GET
module.exports.login_GET = (req, res) => {
  return res.render("login", { user: null, message: null });
};

// Login: POST
module.exports.login_POST = async (req, res) => {
  const { email, password } = req.body;

  // Both email and password are required:
  if (email === "" || password === "") {
    return res.render("login", {
      user: null,
      message: "Both username and password are required!",
    });
  }

  try {
    const user = await User.findOne({ email: email, password: password });

    // No user with provided credentials:
    if (!user) {
      return res.render("login", {
        user: null,
        message: "Invalid username or password!",
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
    message: null,
  });
};

// Register: POST
module.exports.register_POST = async (req, res) => {
  const { name, email, password } = req.body;

  // validate password:
  if (!validatePassword(password)) {
    console.log("here");
    return res.render("register", {
      user: null,
      message: "Follow the Password Constraints.",
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
        message: "Another user Registered with the provided Email!",
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
    if (Error) {
      console.log(`Error while verifying JWT token: ${Error}`);
      res.status(500).json(Error);
    }

    const email = decoded.email;
    await User.findOneAndUpdate({ email }, { $set: { verified: true } });
    await Token.findOneAndDelete({ email });

    // Verfied Email:
    const user = await User.findOne({ email });
    req.session.user = user.name;
    req.session.isLoggedIn = true;
    req.session.admin = user.admin;
    res.redirect("/");
  });
};

// Forgot Password: GET
module.exports.forgotPassword_GET = (req, res) => {
  return res.render("updatePassword", {
    user: req.session.user,
    heading: "Forgot Password",
    message: null,
  });
};

// Reset Password: GET
module.exports.resetPassword_GET = (req, res) => {
  return res.render("updatePassword", {
    user: req.session.user,
    heading: "Reset Password",
    message: null,
  });
};

// Forgot & Reset Password - POST:
module.exports.updatePassword_POST = async (req, res) => {
  const { email } = req.body;

  // CHECK IF ANY USER WITH PROVIDED EMAIL EXISTS:
  const Exist = await User.findOne({ email: email });
  if (!Exist) {
    return res.render("updatePassword", {
      heading: "Update Password",
      user: req.session.user,
      message: "No user with provided Email Exist!",
    });
  }

  // GENERATE TOKEN FOR VERIFICATION:
  const token = await tokenGeneration(email);

  // SEND MAIL FOR VERIFICATION:
  await updatePassword(email, token);

  return res.render("message", {
    message: "Link to update / reset password sent, Check Your Email!",
    user: req.session.user,
  });
};

// NEW Password (Forgot/Reset) - GET:
module.exports.newPassword_GET = (req, res) => {
  return res.render("newPassword", { user: req.session.user, message: null });
};

// NEW Password (Forgot/Reset) - POST:
module.exports.newPassword_POST = (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render(`newPassword`, {
      user: req.session.user,
      message: "Passwords do'not match!",
    });
  }

  // validate password:
  if (!validatePassword(password)) {
    return res.render(`newPassword`, {
      user: req.session.user,
      message: "follow the password constraints.",
    });
  }

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

// LOGOUT - GET:
module.exports.logout_GET = (req, res) => {
  req.session.destroy();
  return res.redirect("/login");
};
