# mf-native-modal

> iOS 风格原生弹窗 uni-app 插件

基于 `plus.nativeObj.View` 原生绘制，两端统一 iOS 风格。小程序 / H5 自动降级为 `uni.showModal`。

## 特性

- **原生绘制**：App 端使用 `plus.nativeObj.View`，脱离 WebView，层级最高
- **iOS 设计规范**：圆角 14px、毛玻璃遮罩、加粗确认按钮
- **淡入淡出动画**：显示/隐藏均有平滑过渡
- **连续调用不闪烁**：遮罩延迟隐藏，无缝衔接
- **View 复用**：首次创建后复用原生对象，性能优异
- **多端兼容**：小程序 / H5 自动降级为系统弹窗

## 安装

将 `mf-native-modal` 目录放入项目 `uni_modules/` 下。

## 使用

### 1. 注册插件（main.js）

```js
import mfNativeModal from '@/uni_modules/mf-native-modal'

export function createApp() {
  const app = createSSRApp(App)
  app.use(mfNativeModal)
  return { app }
}
```

### 2. 组件内使用（推荐 composable）

```vue
<script setup>
import { useModal } from '@/uni_modules/mf-native-modal/composables/useModal'

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

### 3. API 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | `''` | 标题 |
| content | string | `''` | 内容 |
| showCancel | boolean | `true` | 是否显示取消按钮 |
| cancelText | string | `'取消'` | 取消按钮文字 |
| confirmText | string | `'确定'` | 确认按钮文字 |
| cancelColor | string | `'#007AFF'` | 取消按钮颜色 |
| confirmColor | string | `'#007AFF'` | 确认按钮颜色 |

### 4. 返回值

```js
const { confirm, cancel } = await showModal({ ... })
// confirm: true 表示点击了确认
// cancel: true 表示点击了取消
```

### 5. 更多示例

```js
// 纯提示（无取消按钮）
await showModal({ title: '成功', content: '操作已完成', showCancel: false })

// 危险操作（红色确认按钮）
await showModal({
  title: '警告',
  content: '此操作不可撤销',
  confirmText: '删除',
  confirmColor: '#FF3B30',
})
```
