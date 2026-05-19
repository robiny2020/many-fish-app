<template>
  <view class="mf-empty">
    <view class="mf-empty__icon">
      <view class="mf-empty__icon-inner" />
    </view>
    <text class="mf-empty__text">{{ text }}</text>
  </view>
</template>

<script setup>
  /**
   * MfEmpty 空状态占位组件
   * 纯 CSS 绘制空状态图标 + 自定义提示文字
   *
   * @property {String} text - 提示文字，默认 "暂无数据"
   */

  defineProps({
    text: {
      type: String,
      default: '-暂无数据-',
    },
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
