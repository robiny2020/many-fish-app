# WxRequest（微信小程序请求封装）

基于微信小程序原生能力（wx.request / wx.uploadFile）的轻量请求封装，提供默认配置、请求/响应拦截、全局 Loading 队列、上传支持和可中断的请求任务，API 风格贴近 axios，适合中小型项目快速集成。

## 特性

- 全局默认配置：baseURL、header、timeout、isLoading
- 请求/响应拦截：在发送前/收到后统一处理
- 全局 Loading 队列：合并多请求展示，避免频繁闪烁
- 上传能力：支持 wx.uploadFile 分支
- 中断请求：返回的 Promise 暴露 abort/cancel，内部调用 RequestTask.abort()
- 与业务解耦：只包含网络与 Loading 管理，可自由接入日志、埋点、上报

## 安装与引入

将源码复制到项目中并引入：

```js
import WxRequest from "./request"
```

源码位置： [request.js](file:///Users/robin/Desktop/wx-request-sdk/request.js)

## 快速开始

```js
import WxRequest from "./request"

// 1) 创建实例
const http = new WxRequest({
  baseURL: "https://api.example.com",
  timeout: 15000,
  isLoading: true,
  header: { "Content-Type": "application/json" },
})

// 2) 注册拦截器（可选）
http.interceptors.request = (config) => {
  const token = wx.getStorageSync("token")
  if (token) {
    config.header = { ...(config.header || {}), Authorization: `Bearer ${token}` }
  }
  return config
}

http.interceptors.response = (res) => {
  // 统一处理返回结构或错误提示
  return res
}

// 3) 发起请求
const res = await http.get("/users", { page: 1 })
```

## API

- 实例化
  - `new WxRequest(options)`
  - options
    - `baseURL`：接口前缀，默认空串
    - `header`：默认请求头，默认 `{ "Content-type": "application/json" }`
    - `timeout`：超时毫秒数，默认 60000
    - `isLoading`：是否启用全局 Loading，默认 `true`

- 方法
  - `request(config)`：基础请求，config 同 wx.request 参数并支持上述全局字段
  - `get(url, data?, config?)`
  - `post(url, data?, config?)`
  - `put(url, data?, config?)`
  - `delete(url, data?, config?)`
  - `upload(url, filePath, name = "file", config?)`：走 wx.uploadFile 分支
  - `all(...promises)`：Promise.all 封装

- 返回值
  - Promise，额外暴露 `abort()` 和 `cancel()` 方法，可中断该次请求（内部调用 RequestTask/UploadTask.abort）

## 中断请求

```js
const p = http.get("/slow", { page: 1 })
// 任意时刻调用
p.abort() // 或 p.cancel()

try {
  await p
} catch (e) {
  if (e && e.code === "ERR_CANCELED") {
    // 已中断
  }
}
```

## 上传文件

```js
await http.upload("/file/upload", tempFilePath, "file", {
  formData: { biz: "avatar" },
  isLoading: true,
})
```

## 全局 Loading 策略

- 首个请求开始展示 Loading，请求计数递增；
- 每个请求完成/失败/中断后计数递减；
- 计数归零时延迟 80ms 隐藏，减少闪烁；
- 通过 `isLoading: false` 可对单个请求禁用 Loading。

## 拦截器

```js
http.interceptors.request = (config) => {
  // 例如：注入 token、统一查询参数
  return config
}

http.interceptors.response = (response) => {
  // 例如：统一解包 response.data、错误提示等
  return response
}
```

## 错误处理建议

- 网络失败、服务器异常等进入 `Promise.reject` 分支；
- 上传分支失败默认 `resolve` 以便统一处理（可按需调整拦截器逻辑）；
- 中断时抛出 `{ isCanceled: true, code: 'ERR_CANCELED', config }`。

## 与 axios 风格的对比

- 接口风格相似（方法别名、拦截器思想一致），但实现基于小程序原生 API；
- 不提供自动重试、并发池等策略，可在拦截器或业务层自行扩展。

## 目录

- [request.js](file:///Users/robin/Desktop/wx-request-sdk/request.js)：核心实现

---

如需扩展「按标签取消一组请求」或「重试/退避策略」，可基于当前实现维护任务表与重试控制器继续拓展。
