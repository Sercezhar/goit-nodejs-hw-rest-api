const express = require("express");
const ctrl = require("../../controllers/auth");
const { ctrlWrapper } = require("../../helpers");
const { auth, upload } = require("../../middlewares");

const router = express.Router();

router.post("/signup", ctrlWrapper(ctrl.signup));

router.get("/verify/:verificationToken", ctrlWrapper(ctrl.verifyEmail));

router.post("/verify", ctrlWrapper(ctrl.resendVerifyEmail));

router.post("/login", ctrlWrapper(ctrl.login));

router.get("/logout", auth, ctrlWrapper(ctrl.logout));

router.get("/current", auth, ctrlWrapper(ctrl.getCurrent));

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  ctrlWrapper(ctrl.setAvatar)
);

module.exports = router;
