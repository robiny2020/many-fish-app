// 微信小程序 uni.request 封装
// - 支持全局默认配置（baseURL、header、超时、是否展示全局 loading）
// - 支持请求/响应拦截钩子（与 axios 类似）
// - 内置全局 loading 队列：多请求合并展示，避免频繁闪烁
// - 支持上传分支（uni.uploadFile）与普通请求分支（uni.request）
// - 返回的 Promise 暴露 abort/cancel 方法：直接调用底层 RequestTask/UploadTask.abort() 中断请求
class UniRequest {
  constructor(params = {}) {
    // 默认配置，可在实例化时通过 params 覆盖
    this.defaults = Object.assign(
      {
        baseURL: '',
        url: '',
        data: null,
        method: 'GET',
        header: { 'Content-type': 'application/json' },
        timeout: 60000,
        isLoading: true,
      },
      params,
    )
    // 简单版拦截器：函数式，返回变更后的 config/response
    this.interceptors = {
      request: (config) => config,
      response: (response) => response,
    }
    // loading 队列：有请求入队时显示，无请求时隐藏
    this.queue = []
    this.timer = null
    this.UPLOAD_METHOD = 'UPLOAD'
  }
  request(options) {
    if (this.timer) clearTimeout(this.timer)
    // 拼接 baseURL
    options.url = this.defaults.baseURL + options.url
    // 合并本次请求与默认配置
    options = Object.assign({}, this.defaults, options)

    // 是否参与全局 loading 队列（文件上传默认不展示）
    const shouldQueue = options.isLoading && options.method !== this.UPLOAD_METHOD
    if (shouldQueue) {
      if (this.queue.length === 0) uni.showLoading({ title: '加载中...' })
      this.queue.push('request')
    }
    // 请求前拦截
    options = this.interceptors.request(options)
    // 记录取消函数，供外部调用 promise.abort() 使用
    let abortFn
    const promise = new Promise((resolve, reject) => {
      // 小程序返回的请求任务（RequestTask/UploadTask）
      let task
      // 控制短路，避免中断后再次 resolve/reject
      let aborted = false
      let finished = false
      const onAbort = () => {
        if (finished) return
        aborted = true
        finished = true
        if (task && typeof task.abort === 'function') task.abort()
        const err = Object.assign(new Error('canceled'), {
          isCanceled: true,
          code: 'ERR_CANCELED',
          config: options,
        })
        reject(err)
      }
      abortFn = onAbort
      // 上传分支
      if (options.method === this.UPLOAD_METHOD) {
        task = uni.uploadFile({
          ...options,
          success: (res) => {
            if (aborted || finished) return
            finished = true
            try {
              res.data = JSON.parse(res.data)
            } catch (e) {}
            const mergeRes = Object.assign({}, res, { config: options, isSuccess: true })
            resolve(this.interceptors.response(mergeRes))
          },
          fail: (err) => {
            if (aborted || finished) return
            finished = true
            const mergeMsg = Object.assign({}, err, { config: options, isSuccess: false })
            resolve(this.interceptors.response(mergeMsg))
          },
        })
      } else {
        // 普通请求分支
        task = uni.request({
          ...options,
          success: (res) => {
            if (aborted || finished) return
            finished = true
            const mergeRes = Object.assign({}, res, { config: options, isSuccess: true })
            resolve(this.interceptors.response(mergeRes))
          },
          fail: (err) => {
            if (aborted || finished) return
            finished = true
            const mergeErr = Object.assign({}, err, { config: options, isSuccess: false })
            reject(this.interceptors.response(mergeErr))
          },
          complete: () => {
            // 与上传分支相同的 loading 队列收尾处理
            if (shouldQueue) {
              this.queue.pop()
              this.timer = setTimeout(() => {
                this.queue.length === 0 && uni.hideLoading()
                clearTimeout(this.timer)
              }, 1)
            }
          },
        })
      }
    })
    // 暴露中断接口：与小程序任务 abort 对齐
    promise.abort = () => {
      if (typeof abortFn === 'function') abortFn()
    }
    // 兼容命名
    promise.cancel = promise.abort
    return promise
  }
  get(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'GET' }, config))
  }
  delete(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'DELETE' }, config))
  }
  post(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'POST' }, config))
  }
  put(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'PUT' }, config))
  }
  all(...promises) {
    return Promise.all(promises)
  }
  upload(url, filePath, name = 'file', config = {}) {
    return this.request(Object.assign({ url, filePath, name, method: this.UPLOAD_METHOD }, config))
  }
}

export default UniRequest
