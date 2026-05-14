# 组合式函数

组合式函数位于 `composables/` 目录，统一从 `composables/index.js` 导出。

## 目录结构

```text
composables/
├── useModal.js         # 弹窗相关
├── usePageScroll.js    # 页面滚动监听
└── index.js            # 统一导出
```

## usePageScroll

封装 `onPageScroll` 页面生命周期，自动将滚动距离同步给 NavBar 组件，支持额外回调。

> `onPageScroll` 只在页面组件中生效，子组件中无法直接调用，因此封装为 hook 在页面 `<script setup>` 中使用。

### 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `callback` | `Function` | 否 | 额外滚动回调，参数为 `scrollTop: number` |

### 返回值

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `navBarRef` | `Ref` | NavBar 组件引用，自动调用 `updateScrollTop` |
| `scrollTop` | `Ref<number>` | 当前滚动距离（响应式） |
| `onPageScroll` | `Function` | uni-app 页面滚动生命周期引用 |

### 使用示例

```vue
<template>
  <NavBar ref="navBarRef" title="首页" scroll-show />
</template>

<script setup>
  import { NavBar } from '@/components'
  import { usePageScroll } from '@/composables'

  // 基础用法：自动同步 NavBar
  const { navBarRef } = usePageScroll()

  // 需要额外处理滚动时
  // const { navBarRef, scrollTop } = usePageScroll((top) => {
  //   console.log('滚动距离:', top)
  // })
</script>
```
