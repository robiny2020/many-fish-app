# 公共组件

全局公共组件位于 `components/` 目录，统一从 `components/index.js` 导出。

## 目录结构

```text
components/
├── GoBack/
│   ├── index.vue       # GoBack 返回组件
│   └── index.scss      # 组件样式
├── NavBar/
│   ├── index.vue       # NavBar 顶部导航栏组件
│   └── index.scss      # 组件样式
├── PhoneLoginButton/
│   ├── index.vue       # 微信手机号登录按钮组件
│   └── index.scss      # 组件样式
└── index.js            # 统一导出
```

## 组件文档

| 组件 | 文档 | 说明 |
| --- | --- | --- |
| GoBack | [GoBack.md](./GoBack.md) | 返回/首页导航按钮 |
| NavBar | [NavBar.md](./NavBar.md) | 顶部导航栏（左中右三栏） |
| PhoneLoginButton | [PhoneLoginButton.md](./PhoneLoginButton.md) | 微信手机号快捷登录按钮 |
