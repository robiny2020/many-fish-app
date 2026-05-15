/**
 * uni-app 原生 API Promise 化封装
 * 将常用的回调式 API 转为 Promise，便于 async/await 使用
 */

/**
 * 获取当前可用的登录 provider
 * @param {String} [service='oauth'] - 服务类型
 * @returns {Promise<string>} provider 名称（如 weixin）
 */
export function getLoginProvider(service = 'oauth') {
  return new Promise((resolve, reject) => {
    uni.getProvider({
      service,
      success: (res) => {
        if (res.provider && res.provider.length > 0) {
          resolve(res.provider[0])
        } else {
          reject(new Error('无可用的登录 provider'))
        }
      },
      fail: (err) => reject(err),
    })
  })
}

/**
 * uni.login Promise 化
 * 自动通过 getProvider 获取 provider
 * @returns {Promise<string>} login code
 */
export async function uniLogin() {
  const provider = await getLoginProvider()
  return new Promise((resolve, reject) => {
    uni.login({
      provider,
      success: (res) => resolve(res.code),
      fail: (err) => reject(err),
    })
  })
}

/**
 * 显示成功提示
 * @param {String} title - 提示文字
 * @param {Object} [options] - 额外配置，透传给 uni.showToast
 */
export function uniToast(title, options = {}) {
  uni.showToast({
    title,
    icon: 'none',
    ...options,
  })
}

export function uniSetClipboardData(data, options = {}) {
  uni.setClipboardData({
    data,
    success: () => {
      uniToast('复制成功！')
    },
    ...options,
  })
}
