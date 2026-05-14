/**
 * 鉴权模块
 * 订阅 TOKEN_NEED_REFRESH_EVENT，执行实际的 token 刷新 / 静默登录
 * 刷新成功后 emit TOKEN_REFRESHED_EVENT，失败 emit TOKEN_REFRESH_FAILED_EVENT
 *
 * 与请求层完全解耦：
 * - 请求层只关心「需要刷新」和「刷新结果」
 * - 鉴权层只关心「怎么刷新」和「失败后怎么处理」
 */
import emitter from '@/utils/event-emitter'
import storage from '@/utils/storage'
import {
  MF_USER_TOKEN,
  TOKEN_NEED_REFRESH_EVENT,
  TOKEN_REFRESHED_EVENT,
  TOKEN_REFRESH_FAILED_EVENT,
} from '@/config'

/**
 * 执行 token 刷新 / 静默登录
 * 由 TOKEN_NEED_REFRESH_EVENT 事件触发
 */
async function onTokenNeedRefresh() {
  try {
    // TODO: 替换为实际的 token 刷新 / 静默登录接口
    // const http = (await import('@/api/request')).default
    // const res = await http.post('/auth/refresh', { refreshToken })
    // const newToken = res.data.token
    const newToken = ''

    storage.setStorageSync(MF_USER_TOKEN, newToken)
    emitter.emit(TOKEN_REFRESHED_EVENT, { token: newToken })
  } catch (error) {
    storage.removeStorageSync(MF_USER_TOKEN)
    emitter.emit(TOKEN_REFRESH_FAILED_EVENT, { error })

    // 刷新失败，跳转登录页
    uni.navigateTo({ url: '/pages/common/login/index' }).catch(() => {})
  }
}

/**
 * 初始化鉴权监听
 * 应在应用启动时调用一次（如 App.vue 的 onLaunch）
 */
export function setupAuth() {
  emitter.on(TOKEN_NEED_REFRESH_EVENT, onTokenNeedRefresh)
}
