# CRM 知识门户

面向 CRM 一线用户的内部知识与服务门户原型。

## 功能模块

- 首页：通知、高频问题、工具入口、服务之星预览
- 常见问题 / SOP / 操作手册 / 录屏教程 / 业务规则 / 系统通知
- 常用工具链接
- 服务之星评选（每人限投 1 票的前端演示）
- 全局搜索

## 本地运行

```bash
npm install
npm run dev
```

默认地址：http://localhost:5174/

## 验证

```bash
npm run build
npm run lint
npm run dev
npm run e2e
```

## 技术栈

- Vite + React + TypeScript
- React Router
- Tailwind CSS v4
- Playwright（端到端冒烟测试）
