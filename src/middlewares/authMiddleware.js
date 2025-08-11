const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT 验证中间件
exports.protect = async (req, res, next) => {
  try {
    // 1. 从请求头获取 token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "请提供有效的认证令牌",
      });
    }

    // 2. 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. 检查用户是否仍然存在
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "令牌对应的用户已不存在",
      });
    }

    // 4. 将用户信息附加到请求对象
    req.user = currentUser;
    next();
  } catch (err) {
    console.error("JWT 验证错误:", err);
    return res.status(401).json({
      status: "fail",
      message: "无效的认证令牌",
    });
  }
};
