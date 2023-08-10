const router = require("express").Router();
const auth = require("../controllers/auth");

router.get("/login", auth.login_GET);

router.post("/login", auth.login_POST);

router.get("/register", auth.register_GET);

router.post("/register", auth.register_POST);

// Verify Email - GET:
router.get("/verify/:token", auth.verifyEmail_GET);

// Forgot Password - GET:
router.get("/forgot-password", auth.forgotPassword_GET);

// Reset Password - GET:
router.get("/reset-password", auth.resetPassword_GET);

// Forgot & Reset Password - POST:
router.post("/update-password", auth.updatePassword_POST);

// New Password (Forgot/Reset) - GET:
router.get("/new-password/:token", auth.newPassword_GET);

// New Password (Forgot/Reset) - POST:
router.post("/new-password/:token", auth.newPassword_POST);

// Logout:
router.get("/logout", auth.logout_GET);

module.exports = router;
