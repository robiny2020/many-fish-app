# RecycleOrderForm 预约回收下单表单

集成取件地址、上门时间、预估重量、物品照片上传等功能的回收下单表单组件。通过 `validate()` 方法触发校验并提交。

## 引入

```js
import { RecycleOrderForm } from '@/components'
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| addressInfo | Object | `{ name: '', phone: '', address: '' }` | 取件地址信息（父组件控制） |
| timeInfo | Object | `{ date: '', dateLabel: '', slotId: -1, slotLabel: '' }` | 已选时间信息（父组件控制） |
| showWeight | Boolean | `true` | 是否显示预估重量模块 |
| showPhoto | Boolean | `true` | 是否显示照片上传模块 |
| weightOptions | Array | 见下方 | 重量选项列表 |
| exampleImage | String | `''` | 示例图 URL，为空不显示 |
| maxPhotos | Number | `2` | 最大照片数量 |
| requirePhoto | Boolean | `false` | 是否必须上传照片 |

**weightOptions 默认值：**

```js
[
  { range: '3 – 10kg', desc: '约20件' },
  { range: '10 – 20kg', desc: '约40件' },
  { range: '20 – 40kg', desc: '约50件' },
]
```

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| address-click | — | 点击取件地址区域 |
| time-click | — | 点击上门时间区域 |
| submit | `formData` | 校验通过后触发，携带完整表单数据 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| tip | 提示条内容，默认显示「可将衣物打包后放置在门口，无需等待快递上门」 |

## Expose

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| validate() | Boolean | 校验必填项，通过则 emit submit 并返回 true |
| getFormData() | Object | 收集当前表单数据（不触发校验） |

## 使用示例

```vue
<template>
  <RecycleOrderForm
    ref="orderFormRef"
    :addressInfo="addressInfo"
    :timeInfo="timeInfo"
    exampleImage="https://example.com/sample.png"
    @address-click="handleAddressClick"
    @time-click="openTimePicker"
    @submit="handleSubmit"
  />
</template>

<script setup>
  import { RecycleOrderForm } from '@/components'

  const orderFormRef = ref(null)
  const addressInfo = ref({ name: '', phone: '', address: '' })
  const timeInfo = ref({ date: '', dateLabel: '', slotId: -1, slotLabel: '' })

  const handleSubmit = (formData) => {
    // formData: { addressInfo, timeInfo, weightIndex, weightOption, photoList }
  }
</script>
```
