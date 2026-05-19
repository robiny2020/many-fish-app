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
├── MfPopup/
│   ├── index.vue       # MfPopup 弹层组件
│   └── index.scss      # 组件样式
├── MfBanner/
│   ├── index.vue       # MfBanner 通用 Banner 组件
│   └── index.scss      # 组件样式
├── RecycleOrderForm/
│   ├── index.vue       # 预约回收下单表单组件
│   └── index.scss      # 组件样式
├── TimePickerPopup/
│   ├── index.vue       # 预约上门时间选择弹窗
│   └── index.scss      # 组件样式
├── PhoneLoginButton/
│   ├── index.vue       # 微信手机号登录按钮组件
│   └── index.scss      # 组件样式
├── LoadMore/
│   ├── index.vue       # LoadMore 加载更多组件
│   └── index.scss      # 组件样式
├── MfEmpty/
│   ├── index.vue       # MfEmpty 空状态占位组件
│   └── index.scss      # 组件样式
└── index.js            # 统一导出
```

## 组件文档

| 组件 | 文档 | 说明 |
| --- | --- | --- |
| GoBack | [GoBack.md](./GoBack.md) | 返回/首页导航按钮 |
| NavBar | [NavBar.md](./NavBar.md) | 顶部导航栏（左中右三栏） |
| MfPopup | [MfPopup.md](./MfPopup.md) | 多方向弹层（bottom/top/left/right/center） |
| MfBanner | [MfBanner.md](./MfBanner.md) | 通用 Banner（单图直出 / 多图轮播） |
| RecycleOrderForm | [RecycleOrderForm.md](./RecycleOrderForm.md) | 预约回收下单表单（地址、时间、重量、照片） |
| TimePickerPopup | [TimePickerPopup.md](./TimePickerPopup.md) | 预约上门时间二级选择弹窗 |
| PhoneLoginButton | [PhoneLoginButton.md](./PhoneLoginButton.md) | 微信手机号快捷登录按钮 |
| LoadMore | [LoadMore.md](./LoadMore.md) | 列表底部加载状态（more/loading/no-more） |
| MfEmpty | [MfEmpty.md](./MfEmpty.md) | 空状态占位（纯 CSS 图标 + 文字） |
