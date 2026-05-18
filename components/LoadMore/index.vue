<template>
  <view class="load-more" @click="handleClick">
    <view class="load-more__content">
      <!-- 加载中：旋转动画 + 文字 -->
      <template v-if="status === 'loading'">
        <view class="load-more__spinner" />
        <text class="load-more__text">{{ loadingText }}</text>
      </template>

      <!-- 没有更多：横线 + 文字 + 横线 -->
      <template v-else-if="status === 'no-more'">
        <view class="load-more__line" />
        <text class="load-more__text">{{ noMoreText }}</text>
        <view class="load-more__line" />
      </template>

      <!-- 加载前：点击加载更多 -->
      <template v-else>
        <text class="load-more__text">{{ moreText }}</text>
      </template>
    </view>
  </view>
</template>

<script setup>
  /**
   * LoadMore 加载更多组件
   * 用于列表底部展示加载状态
   *
   * @property {String} status - 加载状态：more | loading | no-more，默认 more
   * @property {String} moreText - 加载前提示文字，默认 "点击加载更多"
   * @property {String} loadingText - 加载中提示文字，默认 "正在加载..."
   * @property {String} noMoreText - 没有更多数据提示文字，默认 "没有更多了"
   *
   * @event {Function} loadMore - status 为 more 时点击触发
   */

  const props = defineProps({
    status: {
      type: String,
      default: 'more',
      validator: (val) => ['more', 'loading', 'no-more'].includes(val),
    },
    moreText: {
      type: String,
      default: '点击加载更多',
    },
    loadingText: {
      type: String,
      default: '正在加载...',
    },
    noMoreText: {
      type: String,
      default: '没有更多了',
    },
  })

  const emit = defineEmits(['loadMore'])

  /**
   * 点击事件处理：仅在 more 状态下触发 loadMore 事件
   */
  function handleClick() {
    if (props.status === 'more') {
      emit('loadMore')
    }
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
