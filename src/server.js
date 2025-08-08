// 加载环境变量配置
require('dotenv').config();

const app = require('./app');
const http = require('http');

// 获取环境变量配置
const PORT = process.env.PORT || 3000;

// 创建HTTP服务器
const server = http.createServer(app);

// 启动服务器
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
