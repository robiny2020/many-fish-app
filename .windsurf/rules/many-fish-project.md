# 多鱼回收 — 项目规则

## 项目概览

多鱼回收是一款一站式上门回收服务应用，基于 **uni-app + Vue 3** 构建，目标平台包括微信小程序、H5、App（Android/iOS）。

## 技术栈

| 类别 | 技术 | 版本/说明 |
|------|------|-----------|
| 框架 | uni-app + Vue 3 | Composition API + `<script setup>` |
| 状态管理 | Pinia | pinia-plugin-persistedstate 持久化 |
| 请求封装 | UniRequest | 自研，基于 uni.request，支持拦截器、Token 刷新队列 |
| 样式 | SCSS | uni.scss 全局变量，rpx 适配 |
| 包管理 | pnpm | >= 10 |
| 构建 | Vite | @dcloudio/vite-plugin-uni |
| 自动导入 | unplugin-auto-import | vue、uni-app、pinia |
| 代码规范 | ESLint + Prettier + Commitlint | Conventional Commits |

## 目录结构约定
- [目录结构约定](../directory-structure.md) 


## 编码规范

### Vue 组件

- **必须使用 Composition API + `<script setup>`**，禁止 Options API
- 组件文件使用 PascalCase 命名（如 `NavBar.vue`）
- 页面入口统一命名为 `index.vue`，放在各自目录下
- 页面级组件放在对应页面目录的 `components/` 子目录中

### JavaScript

- 使用 ES Module（`import` / `export`）
- 常量使用 UPPER_SNAKE_CASE，定义在 `config/constant.js`
- 常量前缀约定：存储键 `__MF_`，事件名 `MODULE:ACTION` 格式
- vue、uni-app、pinia API 已通过 `unplugin-auto-import` 自动导入，无需手动 import
- 路径别名使用 `@/` 指向项目根目录

### 样式

- 使用 SCSS 预处理
- 尺寸单位使用 `rpx`（750rpx = 屏幕宽度），保证多端适配
- 全局 SCSS 变量定义在 `uni.scss`，无需 import 即可使用
- 颜色变量前缀 `$uni-color-`，字体 `$uni-font-size-`，间距 `$uni-spacing-`
- 全局样式入口为 `style/index.scss`，包含 `base.scss` 和 `flex.scss`

#### 全局工具类（`style/`）

项目提供了一套全局 CSS 工具类，编写样式时应优先复用，避免重复声明：

- **Flex 布局类**（`style/flex.scss`，UnoCSS 风格）：
  - 容器：`flex`、`inline-flex`
  - 方向：`flex-row`、`flex-col`、`flex-row-reverse`、`flex-col-reverse`
  - 换行：`flex-wrap`、`flex-nowrap`、`flex-wrap-reverse`
  - 主轴对齐：`justify-start`、`justify-center`、`justify-end`、`justify-between`、`justify-around`、`justify-evenly`
  - 交叉轴对齐：`items-start`、`items-center`、`items-end`、`items-baseline`、`items-stretch`
  - 弹性属性：`flex-1`、`flex-auto`、`flex-none`、`flex-grow`、`flex-shrink-0`
  - **常用组合类**（推荐优先使用）：
    - `flex-center` — 水平垂直居中
    - `flex-center-col` — 纵向居中
    - `flex-between` — 两端对齐 + 垂直居中
    - `flex-start` / `flex-end` — 左/右对齐 + 垂直居中
    - `flex-around` / `flex-evenly` — 环绕/均匀分布
    - 以上均有 `-col` 纵向变体
- **基础工具类**（`style/base.scss`）：
  - `safe-bottom` — 安全区底部适配（`env(safe-area-inset-bottom)`）
  - `web-mask` — 页面遮罩层
  - `slide_up` — 底部上滑动画
  - `web-arrow` — CSS 箭头（支持 `--arrow-size`、`--arrow-color`、`--arrow-rotate` 变量）
  - `ellipsis-{1~5}` — 文本溢出省略（单行/多行）

### 请求与鉴权

- 所有 API 请求通过 `api/request/` 中的 `http` 实例发出
- 业务 API 按模块在 `api/` 下创建独立文件，统一从 `api/index.js` 导出
- Token 刷新采用发布订阅模式，请求层与鉴权层解耦：
  - 请求层（`api/request/index.js`）：检测 401 → 发出 `TOKEN_NEED_REFRESH_EVENT` → 挂起请求
  - 鉴权层（`utils/auth.js`）：订阅事件 → 执行刷新 → 发出结果事件
- 鉴权初始化在 `App.vue` 的 `onLaunch` 中调用 `setupAuth()`

### 状态管理

- Store 按功能拆分为独立文件（`store/system.js`、`store/user.js` 等）
- 统一从 `store/index.js` 导出
- 需要持久化的 store 使用 `pinia-plugin-persistedstate`

## 多端兼容注意事项

- **条件编译**：使用 `#ifdef` / `#ifndef` 处理平台差异
- **API 调用**：统一使用 `uni.*` API，不使用 `wx.*`
- **导航栏**：H5 端使用 `"navigationStyle": "custom"` 自定义导航
- **页面配置**：所有页面路由在 `pages.json` 中注册
- **组件库**：优先使用 `uni_modules/` 下的 uni-app 插件
- **样式兼容**：避免使用小程序不支持的 CSS 属性（需注意兼容性）

## 文档与工作流

- 项目文档位于 `docs/` 目录，按模块划分，入口为 `docs/README.md`
- 使用 `/git-flow` 工作流提交代码，自动触发 `/update-docs` 更新文档
- Commit message 遵循 Conventional Commits 规范，中文描述
- Skills 参考位于 `.windsurf/skills/`，涵盖 vue、pinia、uni-app、unocss、vite 等

## 禁止事项

- 禁止在请求层（`api/request/`）中直接处理页面跳转或业务逻辑
- 禁止硬编码 Token、API Key 等敏感信息
- 禁止在 `pages/` 之外的目录创建页面文件
- 禁止使用 `var` 声明变量
- 禁止提交 `console.log` 调试代码到生产分支（开发阶段可保留）
