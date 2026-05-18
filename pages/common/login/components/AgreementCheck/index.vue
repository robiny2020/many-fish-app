<template>
  <view :class="['agreement-check', { 'agreement-check--shake': shaking }]">
    <view
      class="agreement-check__row flex-center"
      @click="$emit('toggle')"
    >
      <view :class="['agreement-check__box', { 'agreement-check__box--checked': checked }]" />
      <text class="agreement-check__label">阅读并同意</text>
      <text
        class="agreement-check__link"
        @click.stop="$emit('open', 'user')"
      >
        《用户协议》
      </text>
      <text class="agreement-check__label">和</text>
      <text
        class="agreement-check__link"
        @click.stop="$emit('open', 'privacy')"
      >
        《隐私政策》
      </text>
    </view>
    <text class="agreement-check__sub">未注册用户登录默认为注册会员</text>
  </view>
</template>

<script setup>
  defineProps({
    /** 是否已勾选 */
    checked: {
      type: Boolean,
      default: false,
    },
  })

  defineEmits(['toggle', 'open'])

  /** 抖动状态 */
  const shaking = ref(false)

  /**
   * 触发抖动动画提示用户勾选协议（防抖：动画期间不重复触发）
   * @returns {void}
   */
  const shake = () => {
    if (shaking.value) return
    shaking.value = true
    setTimeout(() => {
      shaking.value = false
    }, 500)
  }

  defineExpose({ shake })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
