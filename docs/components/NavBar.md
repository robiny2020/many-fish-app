# NavBar 顶部导航栏组件

固定在页面顶部的导航栏，左 | 中 | 右三栏布局。左侧集成 GoBack 组件，支持背景色/渐变、滚动渐显。

## 两种布局模式

- **模式 A**（`showBack=true`，默认）：`[GoBack] | [标题居中] | [右侧插槽]`
- **模式 B**（`showBack=false`）：`[merged 插槽] | [右侧插槽]`，左中合并

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `String` | `''` | 标题文字 |
| `titleImage` | `String` | `''` | 标题图片（优先于 title） |
| `titleColor` | `String` | `''` | 标题文字颜色 |
| `showBack` | `Boolean` | `true` | 是否显示 GoBack 组件 |
| `size` | `String \| Number` | `72` | GoBack 容器尺寸(rpx) |
| `iconSize` | `String \| Number` | `60` | GoBack 图标尺寸(rpx) |
| `background` | `String` | `#ffffff` | 背景色，支持 `linear-gradient(...)` 渐变 |
| `placeholder` | `Boolean` | `true` | 是否生成等高占位元素 |
| `zIndex` | `Number` | `990` | 层级 |
| `scrollShow` | `Boolean` | `false` | 开启滚动显隐模式 |
| `scrollThreshold` | `Number` | `150` | 滚动多少 px 后完全显示 |
| `opacity` | `Number` | `-1` | 手动控制透明度 0~1（-1 不启用） |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `center` | 中间区域（showBack=true 时） |
| `right` | 右侧区域 |
| `merged` | 左中合并区域（showBack=false 时） |

## Expose

| 方法 | 参数 | 说明 |
| --- | --- | --- |
| `updateScrollTop` | `top: number` | 更新滚动距离，驱动透明度计算 |

## 滚动渐显

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

## 更多示例

```vue
<template>
  <!-- 渐变背景 + 白色标题 -->
  <NavBar
    title="我的"
    title-color="#fff"
    background="linear-gradient(135deg, #667eea, #764ba2)"
  />

  <!-- 不显示返回，左侧自定义内容 -->
  <NavBar :show-back="false" title-image="/static/logo.png">
    <template #right>
      <image src="/static/icons/scan.png" style="width: 44rpx; height: 44rpx" />
    </template>
  </NavBar>
</template>
```
