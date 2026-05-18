# 组合式函数

组合式函数位于 `composables/` 目录，统一从 `composables/index.js` 导出。

## 目录结构

```text
composables/
├── useModal.js         # 弹窗相关
├── usePageScroll.js    # 页面滚动监听
├── useTimePicker.js    # 时间选择弹窗状态管理
└── index.js            # 统一导出
```

## Hook 文档

| Hook | 文档 | 说明 |
| --- | --- | --- |
| useModal | [useModal.md](./useModal.md) | 原生弹窗（App 原生 / 其他端 uni.showModal） |
| usePageScroll | [usePageScroll.md](./usePageScroll.md) | 页面滚动监听，自动同步 NavBar |
| useTimePicker | [useTimePicker.md](./useTimePicker.md) | 时间选择弹窗状态管理，搭配 TimePickerPopup 使用 |
