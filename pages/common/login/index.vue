<template>
  <view class="login-page">
    <!-- 顶部 Logo + Slogan -->
    <view class="login-page__brand flex-center-col">
      <image
        class="login-page__logo"
        src="/static/logo.png"
        mode="aspectFit"
      />
      <text class="login-page__slogan">让 回 收 更 简 单</text>
    </view>

    <!-- 操作区域 -->
    <view class="login-page__actions">
      <!-- #ifdef MP -->
      <!-- 小程序：手机号快捷登录模式 -->
      <template v-if="!showSmsForm">
        <PhoneLoginButton
          v-if="agreed"
          :disabled="!agreed"
          @login="handlePhoneLogin"
          @refuse="handleRefuse"
        >
          <view class="login-page__btn-phone">手机号快捷登录</view>
        </PhoneLoginButton>
        <view
          v-else
          class="login-page__btn-phone"
          @click="handlePhoneLoginTip"
        >
          手机号快捷登录
        </view>

        <view
          class="login-page__btn-sms flex-center"
          @click="showSmsForm = true"
        >
          <text class="login-page__btn-sms-text">验证码登录</text>
        </view>
      </template>
      <!-- #endif -->

      <!-- 短信验证码登录表单 -->
      <SmsLoginForm
        v-if="showSmsForm"
        @check-agreement="handleCheckAgreement"
        @login="handleSmsLogin"
      />

      <!-- 协议勾选 -->
      <AgreementCheck
        ref="agreementRef"
        :checked="agreed"
        @toggle="agreed = !agreed"
        @open="openAgreement"
      />
    </view>

    <!-- 底部提示 -->
    <view class="login-page__footer flex-center-col">
      <text class="login-page__footer-text">手机号不可用？</text>
      <view class="login-page__footer-service">
        <text class="login-page__footer-text">遇到问题？拨打客服电话</text>
        <text
          class="login-page__footer-phone"
          @click="handleCallService"
        >
          400-xxxx-xxxx
        </text>
      </view>
    </view>

    <!-- 协议确认弹窗 -->
    <AgreementPopup
      :visible="showAgreementPopup"
      @confirm="handleAgreeAndContinue"
      @cancel="showAgreementPopup = false"
      @open="openAgreement"
    />
  </view>
</template>

<script setup>
  import { PhoneLoginButton } from '@/components'
  import { uniToast } from '@/utils/uni-api'
  import SmsLoginForm from './components/SmsLoginForm/index.vue'
  import AgreementCheck from './components/AgreementCheck/index.vue'
  import AgreementPopup from './components/AgreementPopup/index.vue'

  // ==================== 协议状态管理 ====================

  /** 是否勾选协议 */
  const agreed = ref(false)
  /** AgreementCheck 组件引用 */
  const agreementRef = ref(null)
  /** 协议弹窗显示状态 */
  const showAgreementPopup = ref(false)
  /** 暂存弹窗同意后要执行的回调 */
  let pendingAction = null

  /**
   * 子组件请求协议检查（统一入口）
   * @param {Function} callback - 同意后要执行的回调
   */
  const handleCheckAgreement = (callback) => {
    if (agreed.value) {
      callback()
      return
    }
    pendingAction = callback
    showAgreementPopup.value = true
  }

  /** 弹窗点击「同意」 */
  const handleAgreeAndContinue = () => {
    agreed.value = true
    showAgreementPopup.value = false
    if (typeof pendingAction === 'function') {
      pendingAction()
      pendingAction = null
    }
  }

  // ==================== 登录模式切换 ====================

  /** 是否显示短信验证码表单（非小程序默认 true） */
  let _defaultSmsForm = true
  // #ifdef MP
  _defaultSmsForm = false
  // #endif
  const showSmsForm = ref(_defaultSmsForm)

  // ==================== 短信验证码登录回调 ====================

  /**
   * 短信验证码登录
   * @param {Object} data - { phone, code }
   */
  const handleSmsLogin = (data) => {
    // TODO: 调用验证码登录接口
    console.log('[Login] smsLogin:', data)
  }

  // ==================== 手机号快捷登录（小程序） ====================

  /**
   * 微信手机号快捷登录回调
   * @param {Object} loginData - { code, phoneCode }
   */
  const handlePhoneLogin = (loginData) => {
    if (!agreed.value) {
      handleCheckAgreement(() => handlePhoneLogin(loginData))
      return
    }
    // TODO: 调用登录接口
    console.log('[Login] phoneLogin:', loginData)
  }

  /** 用户拒绝授权 */
  const handleRefuse = () => {
    uniToast('需要授权手机号才能登录')
  }

  /** 未同意协议时点击手机号快捷登录按钮 */
  const handlePhoneLoginTip = () => {
    agreementRef.value?.shake()
    uniToast('请阅读并同意 《用户协议》 和 《隐私政策》 ')
  }

  // ==================== 通用方法 ====================

  /**
   * 打开协议页面
   * @param {String} type - 协议类型：user | privacy
   */
  const openAgreement = (type) => {
    // TODO: 替换为真实协议 URL
    const urlMap = {
      user: 'https://example.com/user-agreement',
      privacy: 'https://example.com/privacy-policy',
    }
    const url = urlMap[type]
    if (url) {
      uni.navigateTo({
        url: `/pages/common/webview/index?webUrl=${encodeURIComponent(url)}`,
      })
    }
  }

  /** 拨打客服电话 */
  const handleCallService = () => {
    uni.makePhoneCall({
      phoneNumber: '400-xxxx-xxxx',
      fail: () => {},
    })
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
