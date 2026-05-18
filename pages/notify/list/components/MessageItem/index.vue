<template>
  <view
    class="message-item"
    :class="{ 'message-item--unread': !item.isRead }"
    @click="handleClick"
  >
    <!-- 左侧类型图标 -->
    <view
      class="message-item__icon"
      :style="{ backgroundColor: typeConfig.color }"
    >
      <text class="message-item__icon-text">{{ typeConfig.label[0] }}</text>
      <!-- 未读红点 -->
      <view
        v-if="!item.isRead"
        class="message-item__badge"
      />
    </view>

    <!-- 右侧内容 -->
    <view class="message-item__body">
      <!-- 标题 + 时间 -->
      <view class="message-item__header">
        <text class="message-item__title">{{ item.title }}</text>
        <text class="message-item__time">{{ displayTime }}</text>
      </view>

      <!-- 内容摘要 -->
      <text class="message-item__content">{{ item.content }}</text>

      <!-- 消息类型标签 -->
      <view
        class="message-item__tag"
        :style="tagStyle"
      >
        {{ typeConfig.label }}
      </view>
    </view>
  </view>
</template>

<script setup>
  /**
   * MessageItem 消息列表单条消息组件
   *
   * @property {Object} item - 消息数据对象
   *   - id {string} 消息ID
   *   - type {string} 消息大类
   *   - event {string} 子事件标识
   *   - title {string} 标题
   *   - content {string} 内容摘要
   *   - extra {Object} 业务扩展字段
   *   - linkUrl {string} 跳转路径
   *   - isRead {boolean} 是否已读
   *   - createdAt {string} 创建时间
   */

  import { MESSAGE_TYPE_MAP, MESSAGE_TYPE } from '@/config'

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(['click'])

  /** 获取类型配置（图标、颜色、标签） */
  const typeConfig = computed(() => {
    return (
      MESSAGE_TYPE_MAP[props.item.type] || {
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
   * 格式化显示时间
   * - 今天：显示 HH:mm
   * - 昨天：显示 "昨天"
   * - 今年内：显示 MM-DD
   * - 跨年：显示 YYYY-MM-DD
   */
  const displayTime = computed(() => {
    if (!props.item.createdAt) return ''
    return formatMessageTime(props.item.createdAt)
  })

  /**
   * 时间格式化工具
   * @param {string} timeStr - ISO 时间字符串或时间戳
   * @returns {string}
   */
  function formatMessageTime(timeStr) {
    const date = new Date(timeStr)
    const now = new Date()

    if (isNaN(date.getTime())) return ''

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()

    if (isToday) {
      return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`
    }

    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday =
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate()

    if (isYesterday) return '昨天'

    const isThisYear = date.getFullYear() === now.getFullYear()
    if (isThisYear) {
      return `${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`
    }

    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`
  }

  function padZero(n) {
    return n < 10 ? `0${n}` : `${n}`
  }

  /**
   * 点击消息：通知父组件处理已读 + 跳转
   */
  function handleClick() {
    emit('click', props.item)
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
