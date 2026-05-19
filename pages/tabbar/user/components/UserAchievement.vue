<template>
  <view class="section-card">
    <view class="section-title">我的成就</view>

    <view class="achievement-grid">
      <!-- 第一行：环保证书 + 碳排放 -->
      <view class="achievement-item">
        <view class="achievement-item__content">
          <text class="achievement-item__label">我的环保证书</text>
          <view class="achievement-item__value-row">
            <text class="achievement-item__value">{{ achievement.certCount }}</text>
            <text class="achievement-item__unit">张</text>
          </view>
        </view>
        <view class="achievement-item__icon" />
      </view>
      <view class="achievement-item">
        <view class="achievement-item__content">
          <text class="achievement-item__label">减少碳排放</text>
          <view class="achievement-item__value-row">
            <text class="achievement-item__value">{{ achievement.carbonReduction }}</text>
            <text class="achievement-item__unit">吨</text>
          </view>
        </view>
        <view class="achievement-item__icon" />
      </view>
    </view>
  </view>
</template>

<script setup>
  /** 成就数据 */
  const achievement = ref({
    certCount: 0,
    carbonReduction: '0.00',
    projectCount: 0,
  })
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

  .achievement-grid {
    display: flex;
    gap: 20rpx;
  }

  .achievement-item {
    flex: 1;
    background-color: #f8fafb;
    border-radius: 16rpx;
    padding: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .achievement-item__content {
    flex: 1;
  }

  .achievement-item__label {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 12rpx;
  }

  .achievement-item__value-row {
    display: flex;
    align-items: baseline;
  }

  .achievement-item__value {
    font-size: 44rpx;
    font-weight: 700;
    color: #333;
    margin-right: 8rpx;
  }

  .achievement-item__unit {
    font-size: 24rpx;
    color: #999;
  }

  .achievement-item__icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 14rpx;
    flex-shrink: 0;
    margin-left: 16rpx;
    background: #fff;
  }
</style>
