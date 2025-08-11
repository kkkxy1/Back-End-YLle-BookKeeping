const express = require("express");
const router = express.Router();

// 挂载认证路由
const authRouter = require("./auth");
router.use("/auth", authRouter);

module.exports = router;
