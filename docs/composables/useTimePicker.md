# useTimePicker

封装 `TimePickerPopup` 的状态管理与交互逻辑，返回响应式状态和方法，供页面直接绑定到模板。

## 引入

```js
import { useTimePicker } from '@/composables'
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| initialTimeInfo | Object | 否 | 初始时间信息，用于编辑回显 |

## 返回值

| 属性/方法 | 类型 | 说明 |
| --- | --- | --- |
| showTimePicker | Ref\<Boolean\> | 弹窗显示状态 |
| timeInfo | Ref\<Object\> | 已选时间 `{ date, dateLabel, slotId, slotLabel }` |
| openTimePicker | Function | 打开时间选择弹窗 |
| handleTimeConfirm | Function | 时间选择确认回调，接收 confirm 事件数据 |
| resetTimeInfo | Function | 重置时间信息为初始状态 |

## 使用示例

```vue
<template>
  <RecycleOrderForm
    :timeInfo="timeInfo"
    @time-click="openTimePicker"
  />
  <TimePickerPopup
    v-model="showTimePicker"
    :defaultDate="timeInfo.date"
    :defaultSlotId="timeInfo.slotId"
    @confirm="handleTimeConfirm"
  />
</template>

<script setup>
  import { RecycleOrderForm, TimePickerPopup } from '@/components'
  import { useTimePicker } from '@/composables'

  const { showTimePicker, timeInfo, openTimePicker, handleTimeConfirm } = useTimePicker()
</script>
```
