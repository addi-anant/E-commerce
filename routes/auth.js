const router = require("express").Router();
const auth = require("../controllers/auth");

router.get("/login", auth.login_GET);

router.post("/login", auth.login_POST);

router.get("/register", auth.register_GET);

router.post("/register", auth.register_POST);

router.get("/verify/:token", auth.verifyEmail_GET);

router.get("/logout", auth.logout_GET);

router.get("/forgot-password", auth.forgotPassword_GET);

router.post("/forgot-password", auth.forgotPassword_POST);

router.get("/new-password/:token", auth.newPassword_GET);

router.post("/new-password/:token", auth.newPassword_POST);

module.exports = router;
