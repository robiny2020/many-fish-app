<template>
  <view class="user-header">
    <view class="user-header__bg" />
    <view class="user-info">
      <view class="avatar-wrapper">
        <!-- 头像占位 -->
        <view class="avatar" />
      </view>
      <view class="user-meta">
        <view class="user-meta__top">
          <text class="nickname">{{ userInfo.nickname }}</text>
          <image
            class="edit-icon"
            src="@/static/icons/edit-pen.png"
            mode="widthFix"
          />
          <text class="user-id">ID:{{ userInfo.userId }}</text>
        </view>
        <text class="join-text">已加入飞蚂蚁{{ userInfo.joinDays }}天</text>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="user-stats">
      <view
        v-for="stat in statList"
        :key="stat.label"
        class="stat-item"
      >
        <text class="stat-value">{{ stat.value }}</text>
        <text class="stat-label">{{ stat.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  /** 用户信息 */
  const userInfo = ref({
    nickname: '师',
    userId: '27845433',
    joinDays: 6,
  })

  /** 顶部统计 */
  const statList = ref([
    { value: 0, label: '参与回收(次)>' },
    { value: 10, label: '环保豆(颗)>' },
    { value: 0, label: '余额(元)>' },
  ])
</script>

<style lang="scss" scoped>
  .user-header {
    position: relative;
    padding: 38rpx 32rpx;
    overflow: hidden;
  }

  .user-header__bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(135deg, #3b9bff, #1a6fdd);
  }

  .user-info {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
  }

  .avatar-wrapper {
    margin-right: 24rpx;
    flex-shrink: 0;
  }

  .avatar {
    width: 110rpx;
    height: 110rpx;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    border: 4rpx solid rgba(255, 255, 255, 0.6);
  }

  .user-meta {
    flex: 1;
  }

  .user-meta__top {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
    flex-wrap: nowrap;
  }

  .nickname {
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
    margin-right: 12rpx;
    flex-shrink: 0;
  }

  .edit-icon {
    width: 30rpx;
    height: 30rpx;
  }

  .user-id {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.9);
    margin-left: auto;
    flex-shrink: 0;
    border-radius: 20rpx;
    letter-spacing: 1rpx;
  }

  .join-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.75);
  }

  .user-stats {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20rpx 0;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-value {
    font-size: 40rpx;
    font-weight: 700;
    color: #fff;
    margin-bottom: 6rpx;
  }

  .stat-label {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.8);
  }
</style>
