<template>
  <view
    v-if="visible"
    class="agreement-popup__mask flex-center"
    @click="$emit('cancel')"
  >
    <view
      class="agreement-popup flex-center-col"
      @click.stop="() => {}"
    >
      <text class="agreement-popup__title">服务协议及隐私保护</text>
      <view class="agreement-popup__content">
        <text class="agreement-popup__text">为了更好地保障您的合法权益，请阅读并同意</text>
        <text
          class="agreement-popup__link"
          @click="$emit('open', 'user')"
        >
          《用户协议》
        </text>
        <text class="agreement-popup__text">和</text>
        <text
          class="agreement-popup__link"
          @click="$emit('open', 'privacy')"
        >
          《隐私政策》
        </text>
      </view>
      <view class="agreement-popup__btns flex-between">
        <view
          class="agreement-popup__btn agreement-popup__btn--cancel flex-center"
          @click="$emit('cancel')"
        >
          <text class="agreement-popup__btn-text--cancel">不同意</text>
        </view>
        <view
          class="agreement-popup__btn agreement-popup__btn--confirm flex-center"
          @click="$emit('confirm')"
        >
          <text class="agreement-popup__btn-text--confirm">同意</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  defineProps({
    /** 是否显示弹窗 */
    visible: {
      type: Boolean,
      default: false,
    },
  })

  defineEmits(['confirm', 'cancel', 'open'])
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
