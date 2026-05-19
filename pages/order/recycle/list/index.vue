<template>
  <view class="recycle-order-list">
    <!-- 顶部吸顶 Tab 栏 -->
    <view class="tabs-wrapper">
      <view class="tabs">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          :class="{ active: currentTab === index }"
          @tap="switchTab(index)"
        >
          <text class="tab-text">{{ tab.label }}</text>
        </view>
        <!-- 滑动指示条 -->
        <view
          class="tab-indicator"
          :style="{ transform: `translateX(${currentTab * 100}%)` }"
        />
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-card"
      >
        <!-- 卡片头部：图标 + 订单号 + 状态 -->
        <view class="order-header">
          <view class="order-header__left">
            <view class="order-icon">
              <text class="order-icon__text">♻</text>
            </view>
            <text class="order-no">订单号：{{ order.orderNo }}</text>
            <view
              class="copy-btn"
              @tap="copyOrderNo(order.orderNo)"
            />
          </view>
          <text
            class="order-status"
            :class="getStatusClass(order.status)"
          >
            {{ order.statusText }}
          </text>
        </view>

        <!-- 卡片信息 -->
        <view class="order-info">
          <view class="info-row">
            <text class="info-label">回收类别：</text>
            <text class="info-value">{{ order.category }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">下单时间：</text>
            <text class="info-value">{{ order.createTime }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">预约时间：</text>
            <text class="info-value">{{ order.appointTime }}</text>
          </view>
        </view>

        <!-- 卡片底部按钮 -->
        <view class="order-actions">
          <view
            v-for="action in order.actions"
            :key="action.text"
            class="action-btn"
            :class="action.type"
            @tap="handleAction(action, order)"
          >
            <text class="action-btn__text">{{ action.text }}</text>
          </view>
        </view>

        <!-- 温馨提示 -->
        <view
          v-if="order.tip"
          class="order-tip"
        >
          <text class="order-tip__text">{{ order.tip }}</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view
        v-if="filteredOrders.length === 0"
        class="empty-state"
      >
        <text class="empty-state__text">暂无相关订单</text>
      </view>
    </view>
  </view>
</template>

<script setup>
  /** Tab 配置 */
  const tabs = ref([
    { label: '所有订单', value: 'all' },
    { label: '待取件', value: 'pending' },
    { label: '进行中', value: 'processing' },
    { label: '待评价', value: 'review' },
  ])

  const currentTab = ref(0)

  /** 切换 Tab */
  const switchTab = (index) => {
    currentTab.value = index
  }

  /** 模拟订单数据 */
  const orderList = ref([
    {
      id: 1,
      orderNo: 'F20260518160351534577',
      status: 'cancelled',
      statusText: '预约取消',
      category: '旧衣回收',
      createTime: '2026-05-18 16:03:52',
      appointTime: '2026-05-21',
      tip: '感谢您对环保事业的支持，期待您的下次预约哦。',
      actions: [
        { text: '删除订单', type: 'default' },
        { text: '重新预约', type: 'outline' },
        { text: '查看详情', type: 'primary' },
      ],
    },
    {
      id: 2,
      orderNo: 'F20260515095914688765',
      status: 'cancelled',
      statusText: '预约取消',
      category: '旧衣回收',
      createTime: '2026-05-15 09:59:15',
      appointTime: '2026-05-17',
      tip: '感谢您对环保事业的支持，期待您的下次预约哦。',
      actions: [
        { text: '删除订单', type: 'default' },
        { text: '重新预约', type: 'outline' },
        { text: '查看详情', type: 'primary' },
      ],
    },
    {
      id: 3,
      orderNo: 'F20260516143022119384',
      status: 'pending',
      statusText: '待取件',
      category: '书籍回收',
      createTime: '2026-05-16 14:30:22',
      appointTime: '2026-05-20',
      tip: '',
      actions: [
        { text: '取消预约', type: 'default' },
        { text: '查看详情', type: 'primary' },
      ],
    },
    {
      id: 4,
      orderNo: 'F20260517082156443201',
      status: 'processing',
      statusText: '进行中',
      category: '大家电回收',
      createTime: '2026-05-17 08:21:56',
      appointTime: '2026-05-19',
      tip: '',
      actions: [{ text: '查看详情', type: 'primary' }],
    },
    {
      id: 5,
      orderNo: 'F20260514171033562890',
      status: 'review',
      statusText: '待评价',
      category: '旧衣回收',
      createTime: '2026-05-14 17:10:33',
      appointTime: '2026-05-16',
      tip: '回收已完成，快来评价一下吧！',
      actions: [
        { text: '去评价', type: 'primary' },
        { text: '查看详情', type: 'outline' },
      ],
    },
  ])

  /** 根据 Tab 过滤订单 */
  const filteredOrders = computed(() => {
    const tabValue = tabs.value[currentTab.value].value
    if (tabValue === 'all') return orderList.value
    return orderList.value.filter((order) => order.status === tabValue)
  })

  /** 获取状态样式类 */
  const getStatusClass = (status) => {
    const classMap = {
      cancelled: 'status--cancelled',
      pending: 'status--pending',
      processing: 'status--processing',
      review: 'status--review',
    }
    return classMap[status] || ''
  }

  /** 复制订单号 */
  const copyOrderNo = (orderNo) => {
    uni.setClipboardData({
      data: orderNo,
      success: () => {
        uni.showToast({ title: '复制成功', icon: 'success' })
      },
    })
  }

  /** 处理按钮操作 */
  const handleAction = (action, order) => {
    uni.showToast({ title: `${action.text} - ${order.orderNo.slice(-6)}`, icon: 'none' })
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
