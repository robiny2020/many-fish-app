# useModal

原生弹窗 composable。App 端使用 `plus.nativeObj.View` 原生弹窗，其他端降级为 `uni.showModal`。

> 实际实现位于 `uni_modules/mf-native-modal/composables/useModal.js`，`composables/useModal.js` 为兼容导出。

## 返回值

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `showModal` | `(options) => Promise<{ confirm, cancel }>` | 显示模态弹窗 |

## options 参数

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `String` | `''` | 弹窗标题 |
| `content` | `String` | `''` | 弹窗内容 |
| `showCancel` | `Boolean` | `true` | 是否显示取消按钮 |
| `cancelText` | `String` | `取消` | 取消按钮文案 |
| `confirmText` | `String` | `确定` | 确认按钮文案 |
| `cancelColor` | `String` | `#000000` | 取消按钮颜色 |
| `confirmColor` | `String` | `#007AFF` | 确认按钮颜色 |

## 返回结果

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `confirm` | `Boolean` | 用户是否点击了确认 |
| `cancel` | `Boolean` | 用户是否点击了取消 |

## 使用示例

```vue
<script setup>
  import { useModal } from '@/composables'

  const { showModal } = useModal()

  async function handleDelete() {
    const { confirm } = await showModal({
      title: '提示',
      content: '确认删除？',
    })
    if (confirm) {
      // 执行删除
    }
  }
</script>
```
