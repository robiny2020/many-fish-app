/**
 * 消息模块 Store
 * 管理未读数、最新消息摘要等全局状态
 */
import { getUnreadCount, markAllAsRead } from '@/api/message'

export const useMessageStore = defineStore(
  'message',
  () => {
    /** 未读消息总数 */
    const unreadCount = ref(0)

    /** 最近一条消息摘要（用于首页展示） */
    const latestMessage = ref(null)

    /**
     * 拉取未读消息数量并更新角标
     */
    async function fetchUnreadCount() {
      try {
        const res = await getUnreadCount()
        unreadCount.value = res.data?.count || 0
        updateTabBarBadge()
      } catch (e) {
        console.error('[MessageStore] fetchUnreadCount failed:', e)
      }
    }

    /**
     * 更新 TabBar 角标
     */
    function updateTabBarBadge() {
      if (unreadCount.value > 0) {
        uni.setTabBarBadge({
          index: 0,
          text: unreadCount.value > 99 ? '99+' : String(unreadCount.value),
        })
      } else {
        uni.removeTabBarBadge({ index: 0 })
      }
    }

    /**
     * 全部已读并清除角标
     */
    async function clearUnread() {
      try {
        await markAllAsRead()
        unreadCount.value = 0
        uni.removeTabBarBadge({ index: 0 })
      } catch (e) {
        console.error('[MessageStore] clearUnread failed:', e)
      }
    }

    /**
     * 单条/批量已读后减少未读数
     * @param {number} count - 标记已读的数量
     */
    function decreaseUnread(count = 1) {
      unreadCount.value = Math.max(0, unreadCount.value - count)
      updateTabBarBadge()
    }

    /**
     * 设置最新消息摘要
     * @param {Object|null} message
     */
    function setLatestMessage(message) {
      latestMessage.value = message
    }

    return {
      unreadCount,
      latestMessage,
      fetchUnreadCount,
      clearUnread,
      decreaseUnread,
      setLatestMessage,
    }
  },
  {
    persist: {
      pick: ['unreadCount'],
    },
  },
)
