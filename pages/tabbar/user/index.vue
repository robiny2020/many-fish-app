<template>
  <!-- 顶部用户信息区域 -->
  <UserHeader />

  <!-- 我的回收 -->
  <UserRecycle />

  <!-- banner 导航 -->
  <MfBanner
    :list="bannerList"
    height="180rpx"
    width=" calc(100% - 48rpx)"
    :custom-style="{ margin: '24rpx', borderRadius: '24rpx' }"
  />

  <!-- 我的成就 -->
  <UserAchievement />

  <!-- 更多服务 -->
  <UserService />
</template>

<script setup>
  import { MfBanner } from '@/components'
  import { UserHeader, UserRecycle, UserAchievement, UserService } from './components'

  /** banner 导航数据 */
  const bannerList = ref([{ image: '', link: '' }])
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
