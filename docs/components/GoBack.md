# GoBack 返回组件

根据页面栈自动判断返回行为：页面栈深度 > 1 时返回上一页，否则跳转首页。支持浮动定位、自定义位置与尺寸。

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `float` | `Boolean` | `true` | 是否 fixed 浮动定位 |
| `top` | `String \| Number` | `''`（CSS 默认：状态栏高度 + 16rpx） | 距顶部距离 |
| `left` | `String \| Number` | `''`（CSS 默认：24rpx） | 距左侧距离 |
| `right` | `String \| Number` | `''` | 距右侧距离（设置后 left 失效） |
| `bottom` | `String \| Number` | `''` | 距底部距离（设置后 top 失效） |
| `size` | `String \| Number` | `72` | 图标容器尺寸，数值时单位 rpx |
| `iconSize` | `String \| Number` | `60` | 图标尺寸，数值时单位 rpx |
| `homePath` | `String` | `/pages/tabbar/index/index` | 首页路径 |
| `zIndex` | `Number` | `999` | 浮动层级 |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `{ canGoBack: boolean }` | 点击时触发，返回当前是否为返回模式 |

## 核心逻辑

1. 通过 `getCurrentPages()` 获取页面栈，判断 `pages.length > 1`
2. 页面栈 > 1：显示返回图标（`go-back.png`），点击调用 `uni.navigateBack()`
3. 页面栈 = 1：显示首页图标（`go-home.png`），点击调用 `uni.switchTab()` 跳转首页
4. `navigateBack` 失败时自动 fallback 到 `switchTab`

## 图标资源

- `/static/icons/go-back.png` — 返回箭头（深色圆形背景）
- `/static/icons/go-home.png` — 首页图标（深色圆形背景）

## 使用示例

```vue
<template>
  <!-- 默认浮动在左上角 -->
  <GoBack />

  <!-- 非浮动，跟随文档流 -->
  <GoBack :float="false" />

  <!-- 自定义位置和大小 -->
  <GoBack top="200" right="24" :size="88" :icon-size="48" />
</template>

<script setup>
  import { GoBack } from '@/components'
</script>
```
