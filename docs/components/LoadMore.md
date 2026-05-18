# LoadMore 加载更多组件

列表底部加载状态提示组件，支持「加载前 / 加载中 / 没有更多」三种状态。

## 引入

```js
import { LoadMore } from '@/components'
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| status | String | `'more'` | 加载状态：`more` \| `loading` \| `no-more` |
| moreText | String | `'点击加载更多'` | 加载前提示文字 |
| loadingText | String | `'正在加载...'` | 加载中提示文字 |
| noMoreText | String | `'没有更多了'` | 没有更多数据提示文字 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| loadMore | — | `status` 为 `more` 时点击触发 |

## 状态说明

| status | 视觉表现 |
| --- | --- |
| `more` | 纯文字提示，可点击 |
| `loading` | 旋转动画 + 文字 |
| `no-more` | 横线 + 文字 + 横线 |

## 使用示例

```vue
<template>
  <view>
    <!-- 列表内容 -->
    <view v-for="item in list" :key="item.id">...</view>

    <!-- 加载更多 -->
    <LoadMore :status="loadStatus" @load-more="onLoadMore" />
  </view>
</template>

<script setup>
  import { LoadMore } from '@/components'

  const loadStatus = ref('more') // more | loading | no-more

  function onLoadMore() {
    loadStatus.value = 'loading'
    // 请求下一页数据...
  }
</script>
```
