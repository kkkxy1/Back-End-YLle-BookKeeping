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
        username: user.username,
        avatarUrl: user.avatarUrl,
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
