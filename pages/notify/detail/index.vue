<template>
  <view class="notify-detail">
    <NavBar title="消息详情" />

    <!-- 消息卡片 -->
    <view
      v-if="detail"
      class="notify-detail__card"
    >
      <!-- 类型标签 -->
      <view
        class="notify-detail__tag"
        :style="tagStyle"
      >
        {{ typeConfig.label }}
      </view>

      <!-- 标题 -->
      <view class="notify-detail__title">{{ detail.title }}</view>

      <!-- 时间 -->
      <view class="notify-detail__time">{{ formatTime(detail.createdAt) }}</view>

      <!-- 分割线 -->
      <view class="notify-detail__divider" />

      <!-- 正文 -->
      <view class="notify-detail__content">{{ detail.content }}</view>

      <!-- 扩展信息（如订单号、金额等） -->
      <view
        v-if="extraList.length > 0"
        class="notify-detail__extra"
      >
        <view
          v-for="(row, idx) in extraList"
          :key="idx"
          class="notify-detail__extra-row"
        >
          <text class="notify-detail__extra-label">{{ row.label }}</text>
          <text class="notify-detail__extra-value">{{ row.value }}</text>
        </view>
      </view>
    </view>

    <!-- 底部跳转按钮 -->
    <view
      v-if="detail && detail.linkUrl"
      class="notify-detail__footer"
    >
      <view
        class="notify-detail__btn"
        @click="handleNavigate"
      >
        查看详情
      </view>
    </view>
  </view>
</template>

<script setup>
  /**
   * 消息详情页
   * - 展示消息完整内容
   * - 底部可跳转关联业务页面
   */

  import { NavBar } from '@/components'
  import { useMessageStore } from '@/store'
  import { getMessageDetail, markAsRead } from '@/api/message'
  import { MESSAGE_TYPE_MAP } from '@/config'

  const messageStore = useMessageStore()

  /** 消息详情数据 */
  const detail = ref(null)

  /** 获取类型配置 */
  const typeConfig = computed(() => {
    if (!detail.value) return { label: '通知', color: '#8E8E93' }
    return (
      MESSAGE_TYPE_MAP[detail.value.type] || {
        label: '通知',
        icon: 'system',
        color: '#8E8E93',
      }
    )
  })

  /** 标签样式 */
  const tagStyle = computed(() => {
    const color = typeConfig.value.color
    return {
      color,
      backgroundColor: `${color}15`,
    }
  })

  /**
   * 解析 extra 字段为展示列表
   * extra 结构示例：{ orderId: 'xxx', amount: '¥50.00' }
   */
  const EXTRA_LABEL_MAP = {
    orderId: '订单编号',
    orderNo: '订单编号',
    amount: '金额',
    weight: '重量',
    expressNo: '快递单号',
    remark: '备注',
  }

  const extraList = computed(() => {
    if (!detail.value?.extra) return []
    const extra = detail.value.extra
    return Object.entries(extra)
      .filter(([, value]) => value != null && value !== '')
      .map(([key, value]) => ({
        label: EXTRA_LABEL_MAP[key] || key,
        value: String(value),
      }))
  })

  /** 页面加载 */
  onLoad((options) => {
    if (options?.id) {
      loadDetail(options.id)
    }
  })

  /**
   * 加载消息详情
   * @param {string} id - 消息ID
   */
  async function loadDetail(id) {
    try {
      const res = await getMessageDetail(id)
      detail.value = res.data || null

      // 自动标记已读
      if (detail.value && !detail.value.isRead) {
        await markAsRead(id)
        detail.value.isRead = true
        messageStore.decreaseUnread(1)
      }
    } catch (e) {
      console.error('[NotifyDetail] loadDetail failed:', e)
      uni.showToast({ title: '加载失败', icon: 'none' })
    }
  }

  /**
   * 跳转到关联业务页面
   */
  function handleNavigate() {
    if (!detail.value?.linkUrl) return
    uni.navigateTo({
      url: detail.value.linkUrl,
      fail: () => {
        uni.switchTab({ url: detail.value.linkUrl })
      },
    })
  }

  /**
   * 格式化时间为完整展示格式
   * @param {string} timeStr
   * @returns {string}
   */
  function formatTime(timeStr) {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    if (isNaN(date.getTime())) return ''
    const Y = date.getFullYear()
    const M = String(date.getMonth() + 1).padStart(2, '0')
    const D = String(date.getDate()).padStart(2, '0')
    const h = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')
    return `${Y}-${M}-${D} ${h}:${m}`
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
