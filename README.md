<div align="center">

<img src="frontend/public/logo.svg" width="100" height="100" alt="SnippetVault Logo">

# 🚀 SnippetVault

**智能代码片段管理工具 | Intelligent Code Snippet Manager**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-3776ab.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)](https://fastapi.tiangolo.com)
[![Electron](https://img.shields.io/badge/Electron-28-47848f.svg)](https://electronjs.org)

[English](#english) | [简体中文](#简体中文) | [繁體中文](#繁體中文)

</div>

---

<a name="简体中文"></a>
## 🇨🇳 简体中文

### 🎉 项目介绍

**SnippetVault** 是一个现代化的智能代码片段管理工具，专为开发者设计。它帮助开发者高效地保存、组织和复用代码片段，提升开发效率。

#### 💡 灵感来源

在日常开发中，我们经常遇到这样的情况：
- 🔍 写过的代码片段找不到，需要重新搜索
- 📝 散落在各处的小工具函数难以统一管理
- 🏷️ 代码片段没有良好的分类和标签
- 🌐 需要在不同设备间同步代码片段

SnippetVault 正是为解决这些问题而生！

#### ✨ 自研差异化亮点

- 🤖 **智能标签推荐** - 基于代码内容自动推荐标签
- 🔎 **全文搜索** - 支持标题、代码内容、描述的全文检索
- 🎨 **语法高亮** - 支持 25+ 种编程语言的语法高亮
- 💻 **跨平台桌面应用** - Windows、macOS、Linux 原生支持
- 📊 **数据统计** - 可视化展示代码库使用情况
- 📦 **数据导入导出** - 支持 JSON 格式的数据迁移

---

### ✨ 核心特性

| 特性 | 描述 | 状态 |
|------|------|------|
| 🎯 **智能管理** | 创建、编辑、删除、搜索代码片段 | ✅ |
| 🏷️ **标签系统** | 多标签分类，智能推荐 | ✅ |
| 🔍 **全文搜索** | 支持代码内容搜索 | ✅ |
| 🎨 **语法高亮** | 25+ 编程语言支持 | ✅ |
| 📊 **统计面板** | 语言分布、标签云 | ✅ |
| 💻 **桌面应用** | Electron 跨平台支持 | ✅ |
| 📱 **响应式设计** | 适配各种屏幕尺寸 | ✅ |
| 🌙 **深色主题** | 护眼的深色界面 | ✅ |
| 📦 **数据导入导出** | JSON 格式备份恢复 | ✅ |
| 🔒 **本地存储** | 数据保存在本地，隐私安全 | ✅ |

---

### 🚀 快速开始

#### 环境要求

- **Python** >= 3.8
- **Node.js** >= 18
- **npm** >= 9

#### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/gitstq/CodeSnippet-Vault.git
cd CodeSnippet-Vault

# 2. 安装依赖
npm run install:all

# 3. 启动开发服务器
npm run dev
```

#### 本地启动

```bash
# 同时启动后端和前端
npm run dev

# 或分别启动
npm run dev:backend   # 启动 FastAPI 后端 (http://localhost:8000)
npm run dev:frontend  # 启动 React 前端 (http://localhost:3000)
```

#### 构建桌面应用

```bash
# 构建前端
npm run build

# 构建桌面应用
cd desktop
npm install
npm run build
```

---

### 📖 详细使用指南

#### 创建代码片段

1. 点击左侧菜单的「新建片段」
2. 填写标题和代码内容
3. 选择编程语言
4. 添加标签（可使用智能推荐）
5. 点击「创建片段」保存

#### 搜索代码片段

- 在搜索框输入关键词
- 支持按编程语言筛选
- 支持按标签筛选
- 搜索结果实时显示

#### 管理标签

- 创建片段时添加标签
- 使用智能推荐功能自动获取标签建议
- 点击标签可筛选相关片段

#### 数据备份

1. 进入「设置」页面
2. 点击「导出数据」下载 JSON 文件
3. 需要恢复时，点击「导入数据」选择文件

---

### 💡 设计思路与迭代规划

#### 技术选型

| 层级 | 技术 | 选择理由 |
|------|------|----------|
| 后端 | FastAPI + SQLite | 高性能、易开发、零配置 |
| 前端 | React + TypeScript | 类型安全、生态丰富 |
| 样式 | Tailwind CSS | 原子化 CSS、快速开发 |
| 桌面 | Electron | 跨平台、成熟稳定 |
| 编辑器 | react-simple-code-editor | 轻量、可定制 |
| 高亮 | Prism.js | 支持语言多、主题丰富 |

#### 后续迭代计划

- [ ] 🔐 用户认证和多用户支持
- [ ] ☁️ 云端同步功能
- [ ] 🤖 AI 代码解释和优化建议
- [ ] 🔗 浏览器扩展（快速保存网页代码）
- [ ] 📱 移动端 App
- [ ] 🔄 GitHub Gist 集成
- [ ] 👥 代码片段分享功能
- [ ] 🎨 自定义主题

---

### 📦 打包与部署指南

#### Web 应用部署

```bash
# 构建生产版本
cd frontend
npm run build

# 构建产物在 dist/ 目录
```

#### 桌面应用打包

```bash
cd desktop

# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux

# 全部平台
npm run dist
```

打包产物位于 `desktop/dist/` 目录。

---

### 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

#### 提交规范

- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

---

### 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

<a name="english"></a>
## 🇺🇸 English

### 🎉 Introduction

**SnippetVault** is a modern intelligent code snippet manager designed for developers. It helps developers efficiently save, organize, and reuse code snippets to improve development productivity.

#### 💡 Inspiration

In daily development, we often encounter situations like:
- 🔍 Can't find previously written code snippets and need to search again
- 📝 Utility functions scattered everywhere are hard to manage uniformly
- 🏷️ Code snippets lack proper categorization and tags
- 🌐 Need to sync code snippets across different devices

SnippetVault was born to solve these problems!

#### ✨ Differentiation Highlights

- 🤖 **Smart Tag Recommendations** - Automatically recommend tags based on code content
- 🔎 **Full-text Search** - Support full-text search in titles, code content, and descriptions
- 🎨 **Syntax Highlighting** - Support for 25+ programming languages
- 💻 **Cross-platform Desktop App** - Native support for Windows, macOS, and Linux
- 📊 **Data Statistics** - Visualize code library usage
- 📦 **Data Import/Export** - Support JSON format data migration

---

### ✨ Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🎯 **Smart Management** | Create, edit, delete, and search code snippets | ✅ |
| 🏷️ **Tag System** | Multi-tag categorization with smart recommendations | ✅ |
| 🔍 **Full-text Search** | Support code content search | ✅ |
| 🎨 **Syntax Highlighting** | 25+ programming languages support | ✅ |
| 📊 **Statistics Panel** | Language distribution, tag cloud | ✅ |
| 💻 **Desktop App** | Electron cross-platform support | ✅ |
| 📱 **Responsive Design** | Adapt to various screen sizes | ✅ |
| 🌙 **Dark Theme** | Eye-friendly dark interface | ✅ |
| 📦 **Data Import/Export** | JSON format backup and restore | ✅ |
| 🔒 **Local Storage** | Data stored locally for privacy | ✅ |

---

### 🚀 Quick Start

#### Requirements

- **Python** >= 3.8
- **Node.js** >= 18
- **npm** >= 9

#### Installation

```bash
# 1. Clone the repository
git clone https://github.com/gitstq/CodeSnippet-Vault.git
cd CodeSnippet-Vault

# 2. Install dependencies
npm run install:all

# 3. Start development server
npm run dev
```

#### Local Development

```bash
# Start both backend and frontend
npm run dev

# Or start separately
npm run dev:backend   # Start FastAPI backend (http://localhost:8000)
npm run dev:frontend  # Start React frontend (http://localhost:3000)
```

#### Build Desktop App

```bash
# Build frontend
npm run build

# Build desktop app
cd desktop
npm install
npm run build
```

---

### 📖 Usage Guide

#### Create a Code Snippet

1. Click "New Snippet" in the left menu
2. Fill in the title and code content
3. Select programming language
4. Add tags (use smart recommendations)
5. Click "Create Snippet" to save

#### Search Code Snippets

- Enter keywords in the search box
- Filter by programming language
- Filter by tags
- Real-time search results

#### Manage Tags

- Add tags when creating snippets
- Use smart recommendation for tag suggestions
- Click tags to filter related snippets

#### Data Backup

1. Go to "Settings" page
2. Click "Export Data" to download JSON file
3. To restore, click "Import Data" and select the file

---

### 💡 Design & Roadmap

#### Tech Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| Backend | FastAPI + SQLite | High performance, easy development, zero config |
| Frontend | React + TypeScript | Type safety, rich ecosystem |
| Styling | Tailwind CSS | Atomic CSS, rapid development |
| Desktop | Electron | Cross-platform, mature and stable |
| Editor | react-simple-code-editor | Lightweight, customizable |
| Highlight | Prism.js | Many languages, rich themes |

#### Roadmap

- [ ] 🔐 User authentication and multi-user support
- [ ] ☁️ Cloud sync functionality
- [ ] 🤖 AI code explanation and optimization suggestions
- [ ] 🔗 Browser extension (quick save web code)
- [ ] 📱 Mobile App
- [ ] 🔄 GitHub Gist integration
- [ ] 👥 Code snippet sharing
- [ ] 🎨 Custom themes

---

### 📦 Build & Deployment

#### Web App Deployment

```bash
# Build production version
cd frontend
npm run build

# Build output in dist/ directory
```

#### Desktop App Packaging

```bash
cd desktop

# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux

# All platforms
npm run dist
```

Build outputs are in `desktop/dist/` directory.

---

### 🤝 Contributing

Issues and Pull Requests are welcome!

#### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `refactor:` Code refactoring
- `test:` Test related
- `chore:` Build/tool related

---

### 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🔗 Links

- 🏠 **Homepage**: https://github.com/gitstq/CodeSnippet-Vault
- 📖 **Documentation**: See README above
- 🐛 **Issues**: https://github.com/gitstq/CodeSnippet-Vault/issues
- 💬 **Discussions**: https://github.com/gitstq/CodeSnippet-Vault/discussions

---

<div align="center">

**Made with ❤️ by SnippetVault Team**

⭐ Star us on GitHub — it motivates us a lot!

</div>
