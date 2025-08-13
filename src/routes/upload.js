const express = require("express");
const router = express.Router();
const { upload, uploadFile } = require("../controllers/uploadController");

// 文件上传路由
router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;
