# TimePickerPopup 预约上门时间选择弹窗

底部弹出的日期 + 时间段二级选择器，支持未来 7 天、自动禁用已过时段。

## 引入

```js
import { TimePickerPopup } from '@/components'
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | Boolean | `false` | v-model 控制显示/隐藏 |
| defaultDate | String | `''` | 默认选中日期（YYYY-MM-DD） |
| defaultSlotId | Number | `-1` | 默认选中时间段 ID（-1 表示无） |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| update:modelValue | Boolean | 弹窗关闭时触发 |
| confirm | `{ date, dateLabel, slotId, slotLabel }` | 确认选择时触发 |

## 时间段规则

| ID | 标签 | 说明 |
| --- | --- | --- |
| 0 | 当前两小时 | 仅今日 9:00-17:00 可选 |
| 1 | 09:00-11:00 | — |
| 2 | 11:00-13:00 | — |
| 3 | 13:00-15:00 | — |
| 4 | 15:00-17:00 | — |
| 5 | 17:00-19:00 | — |

- 当天已过时段提前 5 分钟置灰不可选
- 超过 16:55 后默认选中明天
- 非今天不显示「当前两小时」

## 使用示例

```vue
<template>
  <TimePickerPopup
    v-model="showTimePicker"
    :defaultDate="timeInfo.date"
    :defaultSlotId="timeInfo.slotId"
    @confirm="handleTimeConfirm"
  />
</template>

<script setup>
  import { TimePickerPopup } from '@/components'
  import { useTimePicker } from '@/composables'

  const { showTimePicker, timeInfo, openTimePicker, handleTimeConfirm } = useTimePicker()
</script>
```

## 配合 useTimePicker

推荐搭配 `useTimePicker` composable 使用，详见 [useTimePicker 文档](../composables/useTimePicker.md)。
