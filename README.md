# DNext CMS

一个基于 Next.js 15、Payload CMS 3 和 MongoDB 构建的内容管理系统，当前聚焦于博客场景，包含后台管理、文章发布、分类/标签聚合页和文章详情页。

## 技术栈

- Next.js 15 App Router
- Payload CMS 3
- MongoDB
- React 19
- Lexical Rich Text
- Optional Vercel Blob media storage
- Vitest + Playwright

## 当前能力

- Payload 后台登录与用户管理
- 文章、分类、标签、媒体五个内容模型
- 首页推荐文章与最新文章列表
- 分类页、标签页、文章详情页
- 自定义后台 Logo / Icon

## 本地开发

建议使用 Node.js `20.19+`。当前 `20.18.1` 可以安装依赖，但会收到 `vite` 的 engine warning。

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

```bash
cp .env.example .env
```

必填变量：

- `DATABASE_MONGODB_URI`
- `PAYLOAD_SECRET`

可选变量：

- `BLOB_READ_WRITE_TOKEN`
  说明：不配置时，项目会跳过 Vercel Blob 适配器，方便本地开发。

3. 启动开发环境

```bash
npm run dev
```

默认地址：

- 前台: `http://localhost:3000`
- 后台: `http://localhost:3000/admin`

## 常用命令

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run check
npm run generate:types
npm run generate:importmap
npm run reset:admin
npm run test:int
npm run test:e2e
```

## 项目结构

```text
src/
├── app/
│   ├── (frontend)/        # 博客前台页面
│   └── (payload)/         # Payload 后台
├── collections/           # Users / Media / Posts / Categories / Tags
├── components/            # 后台品牌组件与博客 UI 组件
├── scripts/               # 开发辅助脚本
├── styles/                # 全局样式
├── payload.config.ts      # Payload 主配置
└── payload-types.ts       # 生成的 Payload 类型
tests/
├── int/                   # 集成测试
└── e2e/                   # Playwright 端到端测试
```

## 内容模型

- `users`: 后台用户，包含 `name`、`role`、`avatar`、`bio`
- `media`: 上传资源，当前包含 `alt`
- `posts`: 文章，包含 `status`、`featured`、`seo`、富文本 `content`
- `categories`: 分类
- `tags`: 标签

## 开发约定

- 修改 Payload schema 后执行 `npm run generate:types`
- 修改 Payload 后台组件路径后执行 `npm run generate:importmap`
- 传入 `user` 调用 Local API 时，务必同时设置 `overrideAccess: false`
- 在 hooks 中发起嵌套写操作时，务必透传 `req`

## 测试说明

- `npm run test:int` 依赖可用的 MongoDB 与正确的环境变量
- `npm run test:e2e` 依赖本地开发服务运行在 `http://localhost:3000`

## 已知注意点

- `Users` 集合中的 `role` 默认值当前是 `admin`，与注释中的“仅首个用户为管理员”并不一致，后续如果要调整权限模型请先确认业务预期。
