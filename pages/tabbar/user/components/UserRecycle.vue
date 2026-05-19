<template>
  <view class="section-card mt-38">
    <view class="section-title">我的回收</view>

    <!-- 回收状态入口 -->
    <view class="recycle-nav">
      <view
        v-for="item in recycleNav"
        :key="item.label"
        class="recycle-nav__item"
        @tap="navigateTo(item.path)"
      >
        <view class="recycle-nav__icon-wrapper">
          <view
            class="recycle-nav__icon"
            :style="{ backgroundColor: item.bgColor }"
          />
          <view
            v-if="item.badge"
            class="recycle-nav__badge"
          >
            <text class="recycle-nav__badge-text">{{ item.badge }}</text>
          </view>
        </view>
        <text class="recycle-nav__label">{{ item.label }}</text>
      </view>
    </view>

    <!-- 最新订单 -->
    <view
      v-if="latestOrder"
      class="latest-order"
      @tap="navigateTo('/pages/order/recycle/detail/index')"
    >
      <view class="latest-order__img" />
      <view class="latest-order__info">
        <view class="latest-order__top">
          <text class="latest-order__status">{{ latestOrder.status }}</text>
          <text class="latest-order__time">{{ latestOrder.time }}</text>
        </view>
        <text class="latest-order__desc ellipsis-1">{{ latestOrder.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  /** 回收导航入口 */
  const recycleNav = ref([
    {
      label: '待取件',
      bgColor: '#e3f2fd',
      badge: 2,
      path: '/pages/order/recycle/list/index?tab=1',
    },
    {
      label: '进行中',
      bgColor: '#e8f5e9',
      badge: 0,
      path: '/pages/order/recycle/list/index?tab=2',
    },
    {
      label: '待评价',
      bgColor: '#fff3e0',
      badge: 0,
      path: '/pages/order/recycle/list/index?tab=3',
    },
    {
      label: '全部订单',
      bgColor: '#e8eaf6',
      badge: 0,
      path: '/pages/order/recycle/list/index?tab=0',
    },
  ])

  /** 最新订单 */
  const latestOrder = ref({
    status: '等待取件',
    time: '2026-05-19 13:11',
    desc: '【旧衣回收】订单预约成功，请打包好...',
  })

  /** 页面跳转 */
  const navigateTo = (path) => {
    if (!path) return
    uni.navigateTo({ url: path })
  }
</script>

<style lang="scss" scoped>
  .section-card {
    background-color: #fff;
    border-radius: 24rpx;
    position: relative;
    margin: 24rpx;
    padding: 28rpx;
  }

  .mt-38 {
    margin-top: -38rpx;
  }

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }

  .recycle-nav {
    display: flex;
    justify-content: space-around;
    margin-bottom: 24rpx;
  }

  .recycle-nav__item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .recycle-nav__icon-wrapper {
    position: relative;
    margin-bottom: 12rpx;
  }

  .recycle-nav__icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 18rpx;
  }

  .recycle-nav__badge {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    min-width: 32rpx;
    height: 32rpx;
    border-radius: 16rpx;
    background-color: #ff4444;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8rpx;
  }

  .recycle-nav__badge-text {
    font-size: 20rpx;
    color: #fff;
    font-weight: 500;
  }

  .recycle-nav__label {
    font-size: 24rpx;
    color: #666;
  }

  .latest-order {
    display: flex;
    align-items: center;
    background-color: #fafafa;
    border-radius: 16rpx;
    padding: 20rpx;
  }

  .latest-order__img {
    width: 100rpx;
    height: 100rpx;
    border-radius: 12rpx;
    background-color: #e0e0e0;
    margin-right: 20rpx;
    flex-shrink: 0;
  }

  .latest-order__info {
    flex: 1;
    overflow: hidden;
  }

  .latest-order__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;
  }

  .latest-order__status {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
  }

  .latest-order__time {
    font-size: 22rpx;
    color: #999;
  }

  .latest-order__desc {
    font-size: 24rpx;
    color: #666;
    line-height: 1.4;
  }
</style>
