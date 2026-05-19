# MfEmpty 空状态占位组件

纯 CSS 绘制空状态图标 + 自定义提示文字，用于列表或页面无数据时的占位展示。

## 引入

```js
import { MfEmpty } from '@/components'
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| text | String | `'-暂无数据-'` | 提示文字 |

## 使用示例

```vue
<template>
  <MfEmpty />
  <MfEmpty text="暂无消息" />
</template>

<script setup>
  import { MfEmpty } from '@/components'
</script>
```
