<template>
  <view class="main-action flex-center">
    <view class="main-action__btn flex-center" :class="{ 'main-action__btn--animate': animate }" @click="onClick">
      <text class="main-action__text">去回收旧衣服</text>
    </view>
  </view>
</template>

<script setup name="MainAction">
  /**
   * MainAction 主导航大按钮组件
   * 带呼吸脉冲动画效果，吸引用户点击
   *
   * @property {Boolean} animate - 是否开启动画，默认 true
   */

  const props = defineProps({
    animate: {
      type: Boolean,
      default: true,
    },
  })


  /**
   * 按钮点击
   */
  function onClick() {
   
  }
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
