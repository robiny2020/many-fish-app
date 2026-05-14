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
└── index.js            # 统一导出
```

## GoBack 返回组件

根据页面栈自动判断返回行为：页面栈深度 > 1 时返回上一页，否则跳转首页。支持浮动定位、自定义位置与尺寸。

### Props

| 属性       | 类型               | 默认值                               | 说明                           |
| ---------- | ------------------ | ------------------------------------ | ------------------------------ |
| `float`    | `Boolean`          | `true`                               | 是否 fixed 浮动定位            |
| `top`      | `String \| Number` | `''`（CSS 默认：状态栏高度 + 16rpx） | 距顶部距离                     |
| `left`     | `String \| Number` | `''`（CSS 默认：24rpx）              | 距左侧距离                     |
| `right`    | `String \| Number` | `''`                                 | 距右侧距离（设置后 left 失效） |
| `bottom`   | `String \| Number` | `''`                                 | 距底部距离（设置后 top 失效）  |
| `size`     | `String \| Number` | `72`                                 | 图标容器尺寸，数值时单位 rpx   |
| `iconSize` | `String \| Number` | `60`                                 | 图标尺寸，数值时单位 rpx       |
| `homePath` | `String`           | `/pages/tabbar/index/index`          | 首页路径                       |
| `zIndex`   | `Number`           | `999`                                | 浮动层级                       |

### Events

| 事件    | 参数                     | 说明                               |
| ------- | ------------------------ | ---------------------------------- |
| `click` | `{ canGoBack: boolean }` | 点击时触发，返回当前是否为返回模式 |

### 核心逻辑

1. 通过 `getCurrentPages()` 获取页面栈，判断 `pages.length > 1`
2. 页面栈 > 1：显示返回图标（`go-back.png`），点击调用 `uni.navigateBack()`
3. 页面栈 = 1：显示首页图标（`go-home.png`），点击调用 `uni.switchTab()` 跳转首页
4. `navigateBack` 失败时自动 fallback 到 `switchTab`

### 图标资源

- `/static/icons/go-back.png` — 返回箭头（深色圆形背景）
- `/static/icons/go-home.png` — 首页图标（深色圆形背景）

### 使用示例

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

## NavBar 顶部导航栏组件

固定在页面顶部的导航栏，左 | 中 | 右三栏布局。左侧集成 GoBack 组件，支持背景色/渐变、滚动渐显。

### 两种布局模式

- **模式 A**（`showBack=true`，默认）：`[GoBack] | [标题居中] | [右侧插槽]`
- **模式 B**（`showBack=false`）：`[merged 插槽] | [右侧插槽]`，左中合并

### Props

| 属性              | 类型               | 默认值    | 说明                                     |
| ----------------- | ------------------ | --------- | ---------------------------------------- |
| `title`           | `String`           | `''`      | 标题文字                                 |
| `titleImage`      | `String`           | `''`      | 标题图片（优先于 title）                 |
| `titleColor`      | `String`           | `''`      | 标题文字颜色                             |
| `showBack`        | `Boolean`          | `true`    | 是否显示 GoBack 组件                     |
| `size`            | `String \| Number` | `72`      | GoBack 容器尺寸(rpx)                     |
| `iconSize`        | `String \| Number` | `60`      | GoBack 图标尺寸(rpx)                     |
| `background`      | `String`           | `#ffffff` | 背景色，支持 `linear-gradient(...)` 渐变 |
| `placeholder`     | `Boolean`          | `true`    | 是否生成等高占位元素                     |
| `zIndex`          | `Number`           | `990`     | 层级                                     |
| `scrollShow`      | `Boolean`          | `false`   | 开启滚动显隐模式                         |
| `scrollThreshold` | `Number`           | `150`     | 滚动多少 px 后完全显示                   |
| `opacity`         | `Number`           | `-1`      | 手动控制透明度 0~1（-1 不启用）          |

### Slots

| 插槽名   | 说明                              |
| -------- | --------------------------------- |
| `center` | 中间区域（showBack=true 时）      |
| `right`  | 右侧区域                          |
| `merged` | 左中合并区域（showBack=false 时） |

### Expose

| 方法              | 参数          | 说明                         |
| ----------------- | ------------- | ---------------------------- |
| `updateScrollTop` | `top: number` | 更新滚动距离，驱动透明度计算 |

### 滚动渐显

NavBar 不能直接监听页面滚动（`onPageScroll` 仅页面级生效），需配合 `usePageScroll` hook：

```vue
<template>
  <NavBar ref="navBarRef" title="首页" scroll-show />
</template>

<script setup>
import { NavBar } from '@/components'
import { usePageScroll } from '@/composables'

const { navBarRef } = usePageScroll()
</script>
```

### 更多示例

```vue
<template>
  <!-- 渐变背景 + 白色标题 -->
  <NavBar title="我的" title-color="#fff" background="linear-gradient(135deg, #667eea, #764ba2)" />

  <!-- 不显示返回，左侧自定义内容 -->
  <NavBar :show-back="false" title-image="/static/logo.png">
    <template #right>
      <image src="/static/icons/scan.png" style="width: 44rpx; height: 44rpx" />
    </template>
  </NavBar>
</template>
```
