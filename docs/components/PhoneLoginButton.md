# PhoneLoginButton 微信手机号登录按钮

封装微信小程序手机号快捷登录流程：授权获取 `phoneCode` → `uni.login` 获取 `code` → 触发登录事件或自动调用登录接口。

## 登录流程

1. 用户点击按钮 → 微信弹出手机号授权弹窗
2. 用户同意 → 获取 `phoneCode`（`e.detail.code`）
3. 通过 `uni.login`（provider 由 `uni.getProvider` 动态获取）拿到微信 `code`
4. 触发 `login` 事件 / 自动调用 `loginApi`

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | `String` | `手机号快捷登录` | 按钮文案 |
| `loadingText` | `String` | `登录中...` | 加载态文案 |
| `disabled` | `Boolean` | `false` | 禁用按钮 |
| `autoLogin` | `Boolean` | `false` | 是否自动调用 loginApi |
| `loginApi` | `Function` | `null` | 登录接口，参数 `{ code, phoneCode }`，返回 Promise |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `login` | `{ code, phoneCode }` | 获取到两个 code 后触发 |
| `success` | 接口返回值 | autoLogin 模式登录成功 |
| `fail` | `{ message, error? }` | 登录失败 |
| `refuse` | — | 用户拒绝授权 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义按钮内容，覆盖默认文案 |

## 使用示例

```vue
<template>
  <!-- 手动处理登录 -->
  <PhoneLoginButton @login="handleLogin" @refuse="onRefuse" />

  <!-- 自动登录模式 -->
  <PhoneLoginButton auto-login :login-api="loginByPhone" @success="onSuccess" />

  <!-- 自定义按钮样式 -->
  <PhoneLoginButton @login="handleLogin">
    <view class="custom-btn">微信一键登录</view>
  </PhoneLoginButton>
</template>

<script setup>
  import { PhoneLoginButton } from '@/components'
</script>
```
