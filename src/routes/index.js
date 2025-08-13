const express = require("express");
const router = express.Router();

// 挂载认证路由
const authRouter = require("./auth");
router.use("/auth", authRouter);

// 挂载文件上传路由
const uploadRouter = require("./upload");
router.use("/upload", uploadRouter);

module.exports = router;
