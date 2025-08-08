const express = require('express');
const router = express.Router();

// 基础健康检查路由
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

// 其他路由模块将在这里挂载
// router.use('/bookkeeping', require('./bookkeeping'));

module.exports = router;
