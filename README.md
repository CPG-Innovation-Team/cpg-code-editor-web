# 在线代码编辑器前端项目
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=CPG-Innovation-Team_cpg-code-editor-web&metric=alert_status)](https://sonarcloud.io/dashboard?id=CPG-Innovation-Team_cpg-code-editor-web)
[![Build Status](https://www.travis-ci.com/CPG-Innovation-Team/cpg-code-editor-web.svg?branch=master)](https://www.travis-ci.com/CPG-Innovation-Team/cpg-code-editor-web)
[![codecov](https://codecov.io/gh/CPG-Innovation-Team/cpg-code-editor-web/branch/master/graph/badge.svg?token=CA7DJRBY7X)](https://codecov.io/gh/CPG-Innovation-Team/cpg-code-editor-web)

## 系统依赖
### 需要安装 [Node.js](https://nodejs.org)
### 在版本 Node.js 14.17 上稳定运行

## 操作命令
### 首次运行或有依赖变更时执行安装 `npm install`
### 启动本地服务 `npm run serve`
### 编译生产环境代码包 `npm run build`
### 执行单元测试 `npm run test:unit`
### 执行代码校验 `npm run lint`


## 项目主要文件与目录结构说明
```
.
├── README.md    项目说明文档
├── babel.config.js    Babel配置文件
├── jest.config.js    Jest单元测试配置文件
├── package-lock.json    项目依赖版本配置文件
├── package.json    项目配置文件
├── public
│   ├── favicon.ico    网站web图标
│   ├── img
│   │   └── icons    网站app图标目录
│   ├── index.html    网站HTML模板
│   └── robots.txt    搜索引擎robots协议文件
├── src
│   ├── App.vue    全局页面
│   ├── assets    静态资源文件目录，含图片、视频等
│   ├── components    公用组件目录
│   │   ├── IndexHeader.vue    主页的顶部菜单
│   │   ├── EditorHeader.vue    编辑页面的顶部菜单
│   │   ├── IndexToolbar.vue    主页的工具栏
│   │   ├── EditorToolbar.vue    编辑页面的工具栏
│   │   ├── UserStatus.vue    头像状态组件
│   │   └── tools    工具栏中的菜单
│   │       ├── History.vue    编辑历史
│   │       ├── Profile.vue    个人简介
│   │       └── Setting.vue    设置菜单
│   ├── plguins    插件
│   │   └── vuetify.js    组件库Vuetify设置
│   ├── indexedDb.js    本地indexedDb数据库文件
│   ├── main.js    项目入口文件
│   ├── registerServiceWorker.js
│   ├── router.js    路由文件
│   ├── util.js    公用方法文件
│   ├── query.js    graphql api文件
│   └── views    页面目录
│       ├── Editor.vue    编辑器页面
│       ├── Projects.vue    文档管理页面（首页）
|       └── WelcomeWindow.vue    欢迎弹窗组件
├── tests
│   ├── e2e    E2E测试目录
│   └── unit    单元测试目录
└── vue.config.js    Vue项目配置文件
```

## 主要组件及技术
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Socket.IO](https://socket.io/)
- [IndxedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)

## 集成工具
- 自动化构建部署 [CircleCI](https://app.circleci.com/pipelines/github/CPG-Innovation-Team/cpg-code-editor-web)
- 代码质量静态扫描 [SonarCloud](https://sonarcloud.io/project/overview?id=CPG-Innovation-Team_cpg-code-editor-web)
- 单元测试覆盖率报告 [Codecov](https://app.codecov.io/gh/CPG-Innovation-Team/cpg-code-editor-web)
