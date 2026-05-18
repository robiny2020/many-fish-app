<template>
  <view class="sms-form">
    <!-- 手机号输入（两阶段复用） -->
    <view class="sms-form__input-wrap">
      <input
        v-model="phone"
        class="sms-form__input"
        type="number"
        placeholder="请输入手机号"
        placeholder-class="sms-form__input-placeholder"
        :maxlength="11"
        :disabled="codeSent"
      />
      <view
        v-if="codeSent"
        class="sms-form__phone-clear flex-center"
        @click.stop="handleResetPhone"
      >
        <text class="sms-form__phone-clear-icon">✕</text>
      </view>
    </view>

    <!-- 发送前：获取验证码按钮 -->
    <view
      v-if="!codeSent"
      :class="['sms-form__btn-code flex-center', { 'sms-form__btn-code--disabled': !canSendCode }]"
      @click="handleSendCode"
    >
      <text class="sms-form__btn-code-text">获取验证码</text>
    </view>

    <!-- 发送后：验证码输入 + 登录按钮 -->
    <template v-else>
      <view class="sms-form__code-wrap flex-between">
        <input
          v-model="smsCode"
          class="sms-form__code-input"
          type="number"
          placeholder="请输入验证码"
          placeholder-class="sms-form__input-placeholder"
          :maxlength="6"
          focus
        />
        <text
          :class="[
            'sms-form__code-countdown',
            { 'sms-form__code-countdown--active': countdown === 0 },
          ]"
          @click="handleResendCode"
        >
          {{ countdown > 0 ? `${countdown}s后重新获取` : '重新获取' }}
        </text>
      </view>
      <view
        :class="['sms-form__btn-login flex-center', { 'sms-form__btn-login--disabled': !canLogin }]"
        @click="handleSmsSubmit"
      >
        <text class="sms-form__btn-login-text">登录</text>
      </view>
    </template>
  </view>
</template>

<script setup>
  import { uniToast } from '@/utils/uni-api'

  const emit = defineEmits(['check-agreement', 'login'])

  /** 手机号 */
  const phone = ref('')
  /** 验证码 */
  const smsCode = ref('')
  /** 是否已发送验证码（控制阶段切换） */
  const codeSent = ref(false)
  /** 倒计时秒数 */
  const countdown = ref(0)
  /** 倒计时定时器 */
  let countdownTimer = null

  /** 是否可以发送验证码 */
  const canSendCode = computed(() => {
    return /^1[3-9]\d{9}$/.test(phone.value) && countdown.value === 0
  })

  /** 是否可以点击登录 */
  const canLogin = computed(() => {
    return /^\d{4,6}$/.test(smsCode.value)
  })

  /** 发送验证码 */
  const handleSendCode = () => {
    if (!canSendCode.value) {
      if (!/^1[3-9]\d{9}$/.test(phone.value)) {
        uniToast('请输入正确的手机号')
      }
      return
    }
    emit('check-agreement', doSendCode)
  }

  /** 实际发送验证码 */
  const doSendCode = () => {
    // TODO: 调用发送验证码接口
    codeSent.value = true
    startCountdown()
    uniToast('验证码已发送')
  }

  /** 重新发送验证码 */
  const handleResendCode = () => {
    if (countdown.value > 0) return
    // TODO: 调用发送验证码接口
    startCountdown()
    uniToast('验证码已发送')
  }

  /** 重置手机号（返回阶段一） */
  const handleResetPhone = () => {
    codeSent.value = false
    smsCode.value = ''
    phone.value = ''
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
    countdown.value = 0
  }

  /** 验证码登录提交 */
  const handleSmsSubmit = () => {
    if (!canLogin.value) {
      uniToast('请输入验证码')
      return
    }
    emit('check-agreement', () => {
      // TODO: 调用验证码登录接口
      emit('login', { phone: phone.value, code: smsCode.value })
    })
  }

  /** 开始倒计时 */
  const startCountdown = () => {
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  }

  /** 页面卸载时清理定时器 */
  onUnmounted(() => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
