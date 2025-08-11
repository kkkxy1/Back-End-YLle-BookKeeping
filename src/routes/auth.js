const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 微信登录
router.post("/wechat-login", authController.wechatLogin);

module.exports = router;
