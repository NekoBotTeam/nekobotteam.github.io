# NekoBot 文档

这是 NekoBot 项目的官方文档网站，使用 VitePress 构建，支持中英文切换。

## 项目信息

- **项目名称**: NekoBot
- **项目地址**: https://github.com/NekoBotTeam/NekoBot
- **文档地址**: https://nekobotteam.github.io
- **包管理器**: pnpm
- **主色调**: #39C5BB

## 技术栈

- **文档框架**: VitePress
- **主题**: 自定义主题
- **国际化**: 支持中文(zh)和英文(en)
- **样式**: CSS3 + 自定义变量
- **构建工具**: Vite

## 本地开发

### 环境要求

- Node.js 16+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:5173` 查看文档。

### 构建文档

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 项目结构

```
docs/
├── .vitepress/
│   ├── config.ts              # VitePress 配置
│   └── theme/                 # 自定义主题
│       ├── index.ts          # 主题入口
│       ├── custom.css        # 自定义样式
│       ├── Layout.vue        # 布局组件
│       ├── NotFound.vue      # 404页面
│       └── components/       # 自定义组件
│           └── VPHome.vue    # 首页组件
├── zh/                       # 中文文档
│   ├── guide/               # 指南
│   ├── api/                 # API文档
│   └── plugins/             # 插件文档
├── en/                       # 英文文档
│   ├── guide/               # Guide
│   ├── api/                 # API Reference
│   └── plugins/             # Plugin Documentation
└── index.md                  # 首页
```

## 文档编写

### 添加新页面

1. 在对应语言目录下创建 Markdown 文件
2. 在 `config.ts` 中添加导航和侧边栏配置
3. 确保文件名和路径正确

### 添加新语言

1. 在 `config.ts` 的 `locales` 中添加新语言配置
2. 创建对应的文档目录
3. 翻译现有文档内容

### 样式定制

- 修改 `theme/custom.css` 文件
- 使用 CSS 变量进行主题定制
- 支持响应式设计

## 部署

### GitHub Pages

1. 构建文档：`pnpm build`
2. 将 `docs/.vitepress/dist` 目录内容推送到 `gh-pages` 分支
3. 在 GitHub 仓库设置中启用 Pages

### 其他平台

构建后的文件位于 `docs/.vitepress/dist` 目录，可以部署到任何静态网站托管服务。

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 联系方式

- **项目地址**: https://github.com/NekoBotTeam/NekoBot
- **文档地址**: https://nekobotteam.github.io
- **问题反馈**: https://github.com/NekoBotTeam/NekoBot/issues
- **社区讨论**: https://github.com/NekoBotTeam/NekoBot/discussions

