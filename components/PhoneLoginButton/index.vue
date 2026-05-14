<template>
  <view
    class="phone-login-btn"
    :class="{
      'phone-login-btn--default': !$slots.default,
      'phone-login-btn--disabled': disabled || loading,
    }"
  >
    <button
      class="phone-login-btn__button"
      open-type="getPhoneNumber"
      :disabled="disabled || loading"
      @getphonenumber="onGetPhoneNumber"
    >
      <slot>
        <text v-if="loading">{{ loadingText }}</text>
        <text v-else>{{ text }}</text>
      </slot>
    </button>
  </view>
</template>

<script setup>
  /**
   * PhoneLoginButton 微信手机号快捷登录按钮
   *
   * 流程：
   * 1. 用户点击按钮 → 微信弹出手机号授权弹窗
   * 2. 用户同意 → 获取 phone_code（e.detail.code）
   * 3. 调用 uni.login 获取微信 login code
   * 4. 将 code + phone_code 通过 login 事件传给父组件 / 直接调用登录接口
   *
   * @property {String} text - 按钮文案，默认 "手机号快捷登录"
   * @property {String} loadingText - 登录中文案，默认 "登录中..."
   * @property {Boolean} disabled - 是否禁用
   * @property {Boolean} autoLogin - 是否自动调用登录接口（需配置 loginApi），默认 false
   * @property {Function} loginApi - 自动登录时调用的接口函数，参数 { code, phoneCode }，返回 Promise
   */

  import storage from '@/utils/storage'
  import { uniLogin } from '@/utils/uni-api'
  import { MF_USER_TOKEN } from '@/config'

  const props = defineProps({
    text: {
      type: String,
      default: '手机号快捷登录',
    },
    loadingText: {
      type: String,
      default: '登录中...',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autoLogin: {
      type: Boolean,
      default: false,
    },
    loginApi: {
      type: Function,
      default: null,
    },
  })

  const emit = defineEmits(['login', 'success', 'fail', 'refuse'])

  const loading = ref(false)

  /**
   * 获取手机号回调
   * @param {Object} e - getphonenumber 事件对象
   */
  async function onGetPhoneNumber(e) {
    // 用户拒绝授权
    if (e.detail.errMsg && e.detail.errMsg.includes('deny')) {
      emit('refuse')
      return
    }

    const phoneCode = e.detail.code
    if (!phoneCode) {
      emit('fail', { message: '获取手机号授权码失败' })
      return
    }

    loading.value = true

    try {
      // 获取微信 login code
      const code = await uniLogin()

      const loginData = { code, phoneCode }

      // 触发 login 事件，让父组件自行处理
      emit('login', loginData)

      // 自动登录模式：调用传入的登录接口
      if (props.autoLogin && typeof props.loginApi === 'function') {
        const res = await props.loginApi(loginData)

        // 如果接口返回 token，自动存储
        if (res?.token) {
          storage.setStorageSync({ key: MF_USER_TOKEN, data: res.token })
        }

        emit('success', res)
      }
    } catch (error) {
      console.error('[PhoneLoginButton] 登录失败:', error)
      emit('fail', { message: '登录失败', error })
    } finally {
      loading.value = false
    }
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
