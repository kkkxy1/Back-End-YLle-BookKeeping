# YLle BookKeeping - 后端服务

基于Node.js和Express的后端服务，为YLle记账应用提供API接口。

## 项目结构

```
src/
├── config/        # 配置文件
├── controllers/   # 业务逻辑控制器
├── middlewares/   # 自定义中间件
├── models/        # 数据模型
├── routes/        # API路由
├── utils/         # 工具函数
├── app.js         # Express应用配置
└── server.js      # 服务器启动入口
tests/             # 测试用例
```

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

## API端点

- `GET /` - 欢迎页面

## 开发脚本

- `npm run dev` - 启动开发服务器（使用nodemon）
- `npm start` - 启动生产服务器
- `npm test` - 运行测试

## 技术栈

- Node.js
- Express
