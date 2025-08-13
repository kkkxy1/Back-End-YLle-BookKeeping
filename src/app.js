const express = require("express");
const app = express();
const path = require("path");

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 挂载路由
const indexRouter = require("./routes/index");
app.use("/api", indexRouter);

// 根路由
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to YLle BookKeeping API",
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

module.exports = app;
