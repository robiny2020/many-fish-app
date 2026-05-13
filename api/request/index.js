import WxRequest from './core'
import storage from '@/utils/storage'
import emitter from '@/utils/event-emitter'
import { MF_USER_TOKEN, TOKEN_REFRESHED_EVENT, TOKEN_REFRESH_FAILED_EVENT } from '@/config'

// 1) 创建实例
const http = new WxRequest({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  isLoading: true,
  header: { 'Content-Type': 'application/json' },
})

/** 是否正在刷新 token */
let isRefreshing = false

/**
 * 刷新 token（或重新静默登录）
 * 成功后 emit TOKEN_REFRESHED_EVENT，失败 emit TOKEN_REFRESH_FAILED_EVENT
 */
async function handleTokenRefresh() {
  if (isRefreshing) return
  isRefreshing = true
  try {
    // TODO: 替换为实际的 token 刷新 / 静默登录接口
    // const res = await http.post('/auth/refresh', { refreshToken })
    // const newToken = res.data.token
    const newToken = ''
    storage.setStorageSync(MF_USER_TOKEN, newToken)
    emitter.emit(TOKEN_REFRESHED_EVENT, { token: newToken })
  } catch (error) {
    storage.removeStorageSync(MF_USER_TOKEN)
    emitter.emit(TOKEN_REFRESH_FAILED_EVENT, { error })
    // 跳转登录页
    uni.navigateTo({ url: '/pages/common/login/index' }).catch(() => {})
  } finally {
    isRefreshing = false
  }
}

/**
 * 将失败请求挂起，等待 token 刷新结果后重试或拒绝
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

  // 第一个 401 请求触发刷新
  handleTokenRefresh()
  // 当前请求 + 后续 401 请求都挂起等待
  return waitForTokenAndRetry(res.config)
}

export default http
