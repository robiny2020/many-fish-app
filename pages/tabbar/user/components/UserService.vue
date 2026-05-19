<template>
  <view class="section-card">
    <view class="section-title">更多服务</view>

    <view class="service-grid">
      <view
        v-for="service in serviceList"
        :key="service.label"
        class="service-item"
        @tap="navigateTo(service.path)"
      >
        <view
          class="service-item__icon"
          :style="{ backgroundColor: service.bgColor }"
        />
        <text class="service-item__label">{{ service.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  /** 更多服务列表 */
  const serviceList = ref([
    { label: '商品订单', bgColor: '#e3f2fd', path: '' },
    { label: '我的邮寄', bgColor: '#e8f5e9', path: '' },
    { label: '我的申领', bgColor: '#fff3e0', path: '' },
    { label: '订单同步', bgColor: '#e8eaf6', path: '' },
  ])

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

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
  }

  .service-grid {
    display: flex;
    flex-wrap: wrap;
  }

  .service-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32rpx;
  }

  .service-item__icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 18rpx;
    margin-bottom: 14rpx;
  }

  .service-item__label {
    font-size: 24rpx;
    color: #333;
  }
</style>
