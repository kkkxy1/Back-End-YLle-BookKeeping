const express = require('express');
const router = express.Router();

// 基础健康检查路由
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

// 挂载认证路由
const authRouter = require('./auth');
router.use('/auth', authRouter);

// 其他路由模块将在这里挂载
// router.use('/bookkeeping', require('./bookkeeping'));

module.exports = router;
