# MfBanner 通用 Banner 组件

通用导航 Banner 组件，多张图片时渲染为 swiper 轮播，单张图片时去除轮播直接展示。

## 引入

```js
import { MfBanner } from '@/components'
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| list | Array | `[]` | banner 数据列表，每项包含 `{ image\|bannerImgUrl, link? }` |
| width | String\|Number | `'100%'` | 宽度，支持 rpx/px/%，纯数字自动加 rpx |
| height | String\|Number | `'300rpx'` | 高度，支持 rpx/px/%，纯数字自动加 rpx |
| customStyle | Object | `{}` | 最外层自定义样式对象 |
| indicatorDots | Boolean | `true` | 是否显示指示点 |
| autoplay | Boolean | `true` | 是否自动播放 |
| interval | Number | `3000` | 自动播放间隔（ms） |
| duration | Number | `500` | 滑动动画时长（ms） |
| circular | Boolean | `true` | 是否循环播放 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| item-click | `{ item, index }` | 点击 banner 项时触发（需绑定 `@item-click`） |

## 默认点击行为

未监听 `item-click` 事件时，组件内部自动跳转 `item.link` 或 `item.bannerJumpPath` 对应的页面。

## 使用示例

```vue
<template>
  <MfBanner
    :list="bannerList"
    height="360rpx"
  />
</template>

<script setup>
  import { MfBanner } from '@/components'

  const bannerList = ref([
    { image: 'https://example.com/banner1.png', link: '/pages/activity/index' },
    { image: 'https://example.com/banner2.png', link: '' },
  ])
</script>
```
