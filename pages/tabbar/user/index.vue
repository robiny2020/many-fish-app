<template>
  <!-- 顶部用户信息区域 -->
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
          <view class="edit-icon" />
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

  <!-- 我的回收 -->
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

  <!-- 我的成就 -->
  <view class="section-card">
    <view class="section-title">我的成就</view>

    <view class="achievement-grid">
      <!-- 第一行：环保证书 + 碳排放 -->
      <view class="achievement-row">
        <view class="achievement-item">
          <view class="achievement-item__content">
            <text class="achievement-item__label">我的环保证书</text>
            <view class="achievement-item__value-row">
              <text class="achievement-item__value">{{ achievement.certCount }}</text>
              <text class="achievement-item__unit">张</text>
            </view>
          </view>
        </view>
        <view class="achievement-item">
          <view class="achievement-item__content">
            <text class="achievement-item__label">减少碳排放</text>
            <view class="achievement-item__value-row">
              <text class="achievement-item__value">{{ achievement.carbonReduction }}</text>
              <text class="achievement-item__unit">吨</text>
            </view>
          </view>
          <view
            class="achievement-item__icon"
            style="background-color: #4caf50"
          />
        </view>
      </view>

      <!-- 第二行：环保旅程（跨全宽） -->
      <view class="achievement-row">
        <view class="achievement-item achievement-item--full">
          <view class="achievement-item__content">
            <text class="achievement-item__label">我的环保旅程</text>
            <text class="achievement-item__sub">共参与 {{ achievement.projectCount }} 次项目</text>
          </view>
          <view
            class="achievement-item__icon"
            style="background-color: #2196f3"
          />
        </view>
      </view>
    </view>
  </view>

  <!-- 更多服务 -->
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

  /** 成就数据 */
  const achievement = ref({
    certCount: 0,
    carbonReduction: '0.00',
    projectCount: 0,
  })

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
  @import './index.scss';
</style>
