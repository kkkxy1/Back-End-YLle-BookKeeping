const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// 微信登录
router.post("/wechat-login", authController.wechatLogin);

router.post("/update-info", protect, authController.updateUserInfo);

module.exports = router;
