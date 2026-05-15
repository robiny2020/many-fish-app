# MfPopup 弹层组件

支持上/下/左/右/中心五个方向弹出的内容弹层，带遮罩淡入淡出与内容区过渡动画。关闭时等待动画完成后再卸载 DOM，确保退出动画完整播放。

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `Boolean` | `false` | 控制弹窗显示/隐藏（v-model） |
| `position` | `String` | `'bottom'` | 弹出方向：`bottom` \| `top` \| `left` \| `right` \| `center` |
| `duration` | `Number \| String` | `300` | 动画时长，单位 ms |
| `overlay` | `Boolean` | `true` | 是否显示遮罩 |
| `closeOnClickOverlay` | `Boolean` | `true` | 点击遮罩是否关闭弹窗 |
| `closeable` | `Boolean` | `false` | 是否显示右上角关闭按钮 |
| `zIndex` | `Number` | `996` | 遮罩层级（内容区为 zIndex + 1） |
| `safeBottom` | `Boolean` | `true` | 是否适配底部安全区域（仅 position=bottom 时生效） |
| `bgColor` | `String` | `'#ffffff'` | 内容区背景色 |
| `borderRadius` | `String` | `''` | 自定义圆角（覆盖默认值） |

## Events

| 事件 | 说明 |
| --- | --- |
| `update:modelValue` | v-model 更新事件 |
| `open` | 弹窗打开动画完成时触发 |
| `close` | 弹窗关闭动画完成、DOM 卸载后触发 |
| `clickOverlay` | 点击遮罩时触发 |

## Methods（ref 调用）

| 方法 | 说明 |
| --- | --- |
| `open()` | 手动打开弹窗 |
| `close()` | 手动关闭弹窗 |

## 动画机制

- **遮罩层**：`opacity` 过渡，timing function 为 `ease`
- **内容区**：`transform` + `opacity` 过渡，timing function 为 `cubic-bezier(0.36, 0.66, 0.04, 1)`
- **各方向动画**：
  - `bottom` / `top`：`translateY(100%)` ↔ `translateY(0)`
  - `left` / `right`：`translateX(±100%)` ↔ `translateX(0)`
  - `center`：`scale(0.8) + opacity:0` ↔ `scale(1) + opacity:1`
- **DOM 生命周期**：打开时先挂载 DOM → nextTick 后触发动画；关闭时先播放动画 → 等待 duration 后卸载 DOM

## 使用示例

```vue
<template>
  <!-- 底部弹出（默认） -->
  <MfPopup v-model="showBottom" closeable>
    <view style="padding: 40rpx;">
      底部弹出内容
    </view>
  </MfPopup>

  <!-- 居中弹出 -->
  <MfPopup v-model="showCenter" position="center" closeable>
    <view style="padding: 60rpx 40rpx;">
      居中弹窗内容
    </view>
  </MfPopup>

  <!-- 右侧抽屉 -->
  <MfPopup v-model="showDrawer" position="right" :close-on-click-overlay="false">
    <view style="width: 500rpx; height: 100%;">
      侧边抽屉内容
    </view>
  </MfPopup>
</template>

<script setup>
  import { MfPopup } from '@/components'

  const showBottom = ref(false)
  const showCenter = ref(false)
  const showDrawer = ref(false)
</script>
```
