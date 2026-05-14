import WxRequest from './core'
import storage from '@/utils/storage'
import emitter from '@/utils/event-emitter'
import {
  MF_USER_TOKEN,
  TOKEN_NEED_REFRESH_EVENT,
  TOKEN_REFRESHED_EVENT,
  TOKEN_REFRESH_FAILED_EVENT,
} from '@/config'

// 1) 创建实例
const http = new WxRequest({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  isLoading: true,
  header: { 'Content-Type': 'application/json' },
})

/** 是否正在等待 token 刷新 */
let isWaitingRefresh = false

/**
 * 通知鉴权层需要刷新 token
 * 请求层只负责发出事件，不关心刷新细节
 */
function notifyTokenNeedRefresh() {
  if (isWaitingRefresh) return
  isWaitingRefresh = true

  /**
   * 监听刷新结果，重置标记
   * 无论成功或失败都需要重置，以便下次 401 能重新触发
   */
  const resetOnComplete = () => {
    isWaitingRefresh = false
  }
  emitter.once(TOKEN_REFRESHED_EVENT, resetOnComplete)
  emitter.once(TOKEN_REFRESH_FAILED_EVENT, resetOnComplete)

  // 通知鉴权层：需要刷新 token
  emitter.emit(TOKEN_NEED_REFRESH_EVENT)
}

/**
 * 将失败请求挂起，等待鉴权层发出刷新结果后重试或拒绝
 * @param {Object} config 原始请求配置
 * @returns {Promise} 重试后的响应
 */
function waitForTokenAndRetry(config) {
  return new Promise((resolve, reject) => {
    // 订阅成功事件：用新 token 重试原请求
    const offSuccess = emitter.once(TOKEN_REFRESHED_EVENT, ({ token }) => {
      offFail()
      config.header = { ...(config.header || {}), Authorization: `Bearer ${token}` }
      resolve(http.request(config))
    })
    // 订阅失败事件：直接拒绝
    const offFail = emitter.once(TOKEN_REFRESH_FAILED_EVENT, ({ error }) => {
      offSuccess()
      reject(error)
    })
  })
}

// 2) 请求拦截器：注入 token
http.interceptors.request = (config) => {
  const token = storage.getStorageSync(MF_USER_TOKEN)
  if (token) {
    config.header = { ...(config.header || {}), Authorization: `Bearer ${token}` }
  }
  return config
}

// 3) 响应拦截器：处理 401 token 失效
http.interceptors.response = (res) => {
  // 非 401 正常返回
  if (res.statusCode !== 401) return res

  // 通知鉴权层需要刷新（首个 401 触发，后续跳过）
  notifyTokenNeedRefresh()
  // 所有 401 请求都挂起，等待鉴权层发出结果
  return waitForTokenAndRetry(res.config)
}

export default http
