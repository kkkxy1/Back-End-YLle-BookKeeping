const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User");

// 微信登录
exports.wechatLogin = async (req, res) => {
  try {
    const { code } = req.body;

    // 1. 验证输入
    if (!code) {
      return res.status(400).json({
        status: "fail",
        message: "请提供微信授权码",
      });
    }

    // 2. 向微信服务器请求access_token和openid
    const wechatResponse = await axios.get(
      "https://api.weixin.qq.com/sns/oauth2/access_token",
      {
        params: {
          appid: process.env.WECHAT_APP_ID,
          secret: process.env.WECHAT_APP_SECRET,
          code: code,
          grant_type: "authorization_code",
        },
      }
    );

    const { openid, unionid } = wechatResponse.data;

    // 3. 检查用户是否存在
    let user = await User.findOne({ wechatOpenId: openid });

    // 4. 如果用户不存在则创建
    if (!user) {
      // 生成随机用户名
      const randomUsername = `wx_${Math.random()
        .toString(36)
        .substring(2, 10)}`;

      user = new User({
        username: randomUsername,
        password:
          Math.random().toString(36).substring(2) +
          Math.random().toString(36).substring(2), // 随机密码
        wechatOpenId: openid,
        wechatUnionId: unionid,
      });
      await user.save();
    }

    // 5. 生成JWT令牌
    const token = jwt.sign(
      {
        id: user._id,
        openid: user.wechatOpenId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. 发送响应
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          username: user.username,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (err) {
    console.error("微信登录错误:", err);
    let message = "微信登录过程中发生错误";

    if (err.response && err.response.data) {
      message = `微信接口错误: ${err.response.data.errmsg}`;
    }

    res.status(500).json({
      status: "error",
      message,
    });
  }
};

// 保存或更新用户信息的接口 (需要用户已登录)
exports.updateUserInfo = async (req, res) => {
  // console.log(req.body);
  try {
    // 1. 从 JWT 验证中间件获取当前用户
    const userId = req.user._id;

    // 2. 获取请求体中要更新的数据
    // 使用白名单过滤，只允许更新特定字段，防止更新敏感字段如 password, wechatOpenId 等
    const updates = {};
    const allowedUpdates = ["username", "avatarUrl"]; // 定义允许更新的字段

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 5. 执行更新操作
    // 使用 { new: true } 返回更新后的文档，{ runValidators: true } 运行 schema 验证
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    // 6. 检查用户是否存在（理论上应该存在，因为是通过 JWT 验证的）
    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "用户未找到",
      });
    }
    // console.log(updatedUser);
    // 8. 发送成功响应
    res.status(200).json({
      status: "success",
      message: "用户信息更新成功",
      data: {
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          avatarUrl: updatedUser.avatarUrl,
        },
      },
    });
  } catch (err) {
    console.error("更新用户信息错误:", err);

    // 4.1. 处理 Mongoose 验证错误 (例如 username 不符合规则)
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        status: "fail",
        message: "数据验证失败",
        details: messages, // 返回具体的错误信息
      });
    }

    // 4.2. 处理 MongoDB 唯一索引冲突错误 (虽然上面已检查 username，但其他字段可能有冲突)
    if (err.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(400).json({
        status: "fail",
        message: "数据冲突，可能某个字段已存在（如用户名）",
        // 可以尝试解析 err.keyValue 来获取具体哪个字段冲突
      });
    }

    // 5. 其他服务器错误
    res.status(500).json({
      status: "error",
      message: "更新用户信息时发生服务器错误",
    });
  }
};
