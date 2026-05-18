<template>
  <view class="notify-list">
    <NavBar title="消息中心">
      <template #right>
        <text
          v-if="messageList.length > 0"
          class="notify-list__read-all"
          @click="handleReadAll"
        >
          全部已读
        </text>
      </template>
    </NavBar>

    <!-- 消息列表 -->
    <view
      v-if="messageList.length > 0"
      class="notify-list__list"
    >
      <MessageItem
        v-for="item in messageList"
        :key="item.id"
        :item="item"
        @click="handleItemClick"
      />
    </view>

    <!-- 空状态 -->
    <view
      v-else-if="!loading"
      class="notify-list__empty"
    >
      <text class="notify-list__empty-text">暂无消息</text>
    </view>
    <LoadMore status="no-more" />
  </view>
</template>

<script setup>
  /**
   * 消息列表页
   * - 统一时间线展示所有类型消息
   * - 支持下拉刷新、触底加载
   * - 支持点击跳转关联业务页面
   */

  import { NavBar, LoadMore } from '@/components'
  import { useMessageStore } from '@/store'
  import { getMessageList, markAsRead } from '@/api/message'
  import MessageItem from './components/MessageItem/index.vue'

  const messageStore = useMessageStore()

  /** 消息列表 */
  const messageList = ref([])
  /** 加载状态 */
  const loading = ref(false)
  /** 是否还有更多数据 */
  const hasMore = ref(false)
  /** 游标：上一页最后一条消息ID */
  const lastId = ref('')

  // ===== Mock 假数据（调试用，上线前删除） =====
  const MOCK_MESSAGES = [
    {
      id: '1',
      type: 'RECYCLE_ORDER',
      event: 'PLACED',
      title: '回收订单已提交',
      content: '您的旧衣服回收订单已提交成功，预计明天上门取件，请保持手机畅通。',
      extra: { orderId: 'RC20250518001', weight: '约5kg' },
      linkUrl: '/pages/order/recycle/detail/index?id=1',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'RECYCLE_ORDER',
      event: 'PICKUP',
      title: '快递员即将上门',
      content: '快递员张师傅正在前往您的地址，预计30分钟内到达。',
      extra: { orderId: 'RC20250518001', expressNo: 'SF1234567890' },
      linkUrl: '/pages/order/recycle/detail/index?id=1',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      type: 'ECO_FUND',
      event: 'GRANTED',
      title: '环保金已到账',
      content: '您本次回收获得环保金 ¥12.50，已发放至您的账户余额。',
      extra: { amount: '¥12.50', orderId: 'RC20250517003' },
      linkUrl: '',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '4',
      type: 'GOODS_ORDER',
      event: 'SHIPPED',
      title: '商品已发货',
      content: '您购买的「环保帆布袋」已发货，快递单号 YT9876543210。',
      extra: { orderNo: 'GD20250516008', expressNo: 'YT9876543210' },
      linkUrl: '/pages/order/goods/detail/index?id=2',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: '5',
      type: 'PAYMENT',
      event: 'WITHDRAW_SUCCESS',
      title: '提现成功',
      content: '您申请的提现 ¥50.00 已到账，请查看银行卡余额。',
      extra: { amount: '¥50.00' },
      linkUrl: '',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: '6',
      type: 'RECYCLE_ORDER',
      event: 'COMPLETED',
      title: '回收订单已完成',
      content: '您的书籍回收订单已完成，共回收12本书，获得环保金 ¥8.00。',
      extra: { orderId: 'RC20250514005', amount: '¥8.00' },
      linkUrl: '/pages/order/recycle/detail/index?id=3',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: '7',
      type: 'SYSTEM',
      event: 'ACTIVITY',
      title: '绿洲计划活动开启',
      content: '参与绿洲计划，回收满3次即可免费种树一棵，快来参与吧！',
      extra: {},
      linkUrl: '/pages/activity/oasis/index/index',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: '8',
      type: 'ECO_FUND',
      event: 'EXPIRING',
      title: '环保金即将过期',
      content: '您有 ¥5.00 环保金将于3天后过期，请尽快使用。',
      extra: { amount: '¥5.00' },
      linkUrl: '',
      isRead: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ]

  /** 页面加载时使用假数据 */
  onLoad(() => {
    // loadMessages()
    messageList.value = MOCK_MESSAGES
  })

  /** 下拉刷新 */
  onPullDownRefresh(async () => {
    await refreshMessages()
    uni.stopPullDownRefresh()
  })

  /** 触底加载更多 */
  onReachBottom(() => {
    if (!loading.value && hasMore.value) {
      loadMessages()
    }
  })

  /**
   * 加载消息列表（追加模式）
   */
  async function loadMessages() {
    if (loading.value) return
    loading.value = true

    try {
      const params = { pageSize: 20 }
      if (lastId.value) {
        params.lastId = lastId.value
      }

      const res = await getMessageList(params)
      const { list = [], hasMore: more = false } = res.data || {}

      messageList.value.push(...list)
      hasMore.value = more

      if (list.length > 0) {
        lastId.value = list[list.length - 1].id
      }
    } catch (e) {
      console.error('[NotifyList] loadMessages failed:', e)
      uni.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新消息列表（重置模式）
   */
  async function refreshMessages() {
    lastId.value = ''
    hasMore.value = true
    messageList.value = []
    await loadMessages()
    // 同步更新未读数
    messageStore.fetchUnreadCount()
  }

  /**
   * 点击消息：标记已读 + 跳转
   * @param {Object} item - 消息对象
   */
  async function handleItemClick(item) {
    // 标记已读
    if (!item.isRead) {
      try {
        await markAsRead(item.id)
        item.isRead = true
        messageStore.decreaseUnread(1)
      } catch (e) {
        console.error('[NotifyList] markAsRead failed:', e)
      }
    }

    // 跳转到关联页面
    if (item.linkUrl) {
      uni.navigateTo({
        url: item.linkUrl,
        fail: () => {
          // 如果 navigateTo 失败（如 tabBar 页面），尝试 switchTab
          uni.switchTab({ url: item.linkUrl })
        },
      })
    } else {
      // 无跳转链接则进入消息详情
      uni.navigateTo({
        url: `/pages/notify/detail/index?id=${item.id}`,
      })
    }
  }

  /**
   * 全部已读
   */
  async function handleReadAll() {
    try {
      await messageStore.clearUnread()
      // 本地列表全部标记已读
      messageList.value.forEach((item) => {
        item.isRead = true
      })
      uni.showToast({ title: '已全部标记为已读', icon: 'none' })
    } catch (e) {
      console.error('[NotifyList] handleReadAll failed:', e)
      uni.showToast({ title: '操作失败', icon: 'none' })
    }
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
