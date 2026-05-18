/**
 * 消息模块 API
 */
import http from './request'

/**
 * 获取消息列表（游标分页）
 * @param {Object} params
 * @param {string} [params.lastId] - 上一页最后一条消息ID，首次不传
 * @param {number} [params.pageSize=20] - 每页条数
 * @param {string} [params.type] - 消息类型筛选，不传则返回全部
 * @returns {Promise<{list: Array, hasMore: boolean}>}
 */
export function getMessageList(params = {}) {
  return http.get('/message/list', {
    params: {
      pageSize: 20,
      ...params,
    },
  })
}

/**
 * 获取消息详情
 * @param {string} id - 消息ID
 * @returns {Promise<Object>}
 */
export function getMessageDetail(id) {
  return http.get(`/message/detail/${id}`)
}

/**
 * 标记消息已读（支持单条或批量）
 * @param {string|string[]} ids - 消息ID或ID数组
 * @returns {Promise}
 */
export function markAsRead(ids) {
  const idList = Array.isArray(ids) ? ids : [ids]
  return http.post('/message/read', { ids: idList })
}

/**
 * 全部标记为已读
 * @returns {Promise}
 */
export function markAllAsRead() {
  return http.post('/message/read-all')
}

/**
 * 获取未读消息数量
 * @returns {Promise<{count: number}>}
 */
export function getUnreadCount() {
  return http.get('/message/unread-count')
}
