const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. 验证输入
    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: '请提供用户名和密码'
      });
    }
    
    // 2. 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: '用户名已存在'
      });
    }
    
    // 3. 创建新用户
    const newUser = new User({ username, password });
    await newUser.save();
    
    // 4. 生成JWT令牌
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    // 5. 发送响应
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
    
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: '注册过程中发生错误'
    });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. 验证输入
    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: '请提供用户名和密码'
      });
    }
    
    // 2. 检查用户是否存在
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: '用户名或密码不正确'
      });
    }
    
    // 3. 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: '用户名或密码不正确'
      });
    }
    
    // 4. 生成JWT令牌
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    // 5. 发送响应
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          username: user.username
        }
      }
    });
    
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: '登录过程中发生错误'
    });
  }
};
