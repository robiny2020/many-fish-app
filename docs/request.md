# 请求模块（api/request）

基于微信小程序原生能力（`wx.request` / `wx.uploadFile`）的轻量请求封装，API 风格贴近 axios。内置全局 Loading 队列、请求/响应拦截器、Token 自动刷新队列，开箱即用。

## 目录结构

```text
api/
├── index.js                  # API 统一出口（按业务模块聚合）
└── request/
    ├── core.js               # WxRequest 核心类
    └── index.js              # 实例创建、拦截器、Token 刷新队列
config/
└── constant.js               # 常量定义（存储键、事件名）
utils/
├── event-emitter.js          # 发布订阅事件总线
└── storage.js                # 本地存储工具
```

## 特性

- **全局默认配置** — baseURL、header、timeout、isLoading
- **请求/响应拦截器** — 函数式，在发送前/收到后统一处理
- **全局 Loading 队列** — 多请求合并展示，避免频繁闪烁
- **上传能力** — 支持 `wx.uploadFile` 分支
- **中断请求** — Promise 暴露 `abort()` / `cancel()`，内部调用 `RequestTask.abort()`
- **401 Token 刷新队列** — 基于发布订阅，首个 401 触发刷新，并发请求自动挂起等待重试
- **与业务解耦** — 只包含网络、Loading、鉴权管理，可自由接入日志、埋点、上报

## 快速开始

业务代码中直接导入已配置好的实例：

```js
import http from '@/api/request'

// GET
const res = await http.get('/users', { page: 1 })

// POST
const res = await http.post('/users', { name: '张三' })
```

### 新增业务 API

在 `api/` 目录下按模块创建文件，统一从 `api/index.js` 导出：

```js
// api/user.js
import http from '@/api/request'

/** 获取用户信息 */
export const getUserInfo = () => http.get('/user/info')

/** 更新用户资料 */
export const updateProfile = (data) => http.put('/user/profile', data)
```

```js
// api/index.js
export * from './user'
```

```js
// 页面中使用
import { getUserInfo } from '@/api'
const res = await getUserInfo()
```

## API 参考

### 实例化

```js
import WxRequest from '@/api/request/core'

const http = new WxRequest(options)
```

| 参数        | 类型      | 默认值                                   | 说明                       |
| ----------- | --------- | ---------------------------------------- | -------------------------- |
| `baseURL`   | `string`  | `''`                                     | 接口前缀，所有请求自动拼接 |
| `header`    | `object`  | `{ 'Content-type': 'application/json' }` | 默认请求头                 |
| `timeout`   | `number`  | `60000`                                  | 超时毫秒数                 |
| `isLoading` | `boolean` | `true`                                   | 是否启用全局 Loading       |

### 请求方法

| 方法      | 签名                              | 说明                                |
| --------- | --------------------------------- | ----------------------------------- |
| `get`     | `(url, data?, config?)`           | GET 请求                            |
| `post`    | `(url, data?, config?)`           | POST 请求                           |
| `put`     | `(url, data?, config?)`           | PUT 请求                            |
| `delete`  | `(url, data?, config?)`           | DELETE 请求                         |
| `upload`  | `(url, filePath, name?, config?)` | 文件上传（wx.uploadFile）           |
| `request` | `(config)`                        | 基础请求，config 同 wx.request 参数 |
| `all`     | `(...promises)`                   | `Promise.all` 封装                  |

### 返回值

所有方法返回 `Promise`，额外暴露：

- `abort()` — 中断请求，内部调用 `RequestTask.abort()`
- `cancel()` — `abort()` 的别名

## 拦截器

### 请求拦截

在请求发出前统一处理，如注入 Token、添加公共参数：

```js
http.interceptors.request = (config) => {
  const token = storage.getStorageSync(MF_USER_TOKEN)
  if (token) {
    config.header = { ...(config.header || {}), Authorization: `Bearer ${token}` }
  }
  return config
}
```

### 响应拦截

在收到响应后统一处理，如解包数据、错误提示、401 鉴权：

```js
http.interceptors.response = (res) => {
  if (res.statusCode !== 401) return res

  // 通知鉴权层需要刷新（首个 401 触发，后续跳过）
  notifyTokenNeedRefresh()
  // 所有 401 请求都挂起，等待鉴权层发出结果
  return waitForTokenAndRetry(res.config)
}
```

## Token 刷新队列

当接口返回 **401**（Token 失效）时，基于发布订阅模式实现无感刷新。请求层与鉴权层完全解耦：

| 层级       | 职责                                            | 文件                   |
| ---------- | ----------------------------------------------- | ---------------------- |
| **请求层** | 检测 401、发出"需要刷新"事件、挂起请求等待结果  | `api/request/index.js` |
| **鉴权层** | 订阅"需要刷新"事件、执行刷新/登录、发出结果事件 | `utils/auth.js`        |

### 事件流

```text
请求层                          鉴权层
──────                          ──────
请求 A 返回 401
  ├─ emit(TOKEN_NEED_REFRESH) ──→ onTokenNeedRefresh()
  └─ once(TOKEN_REFRESHED)        ├─ 调用刷新接口 / 静默登录
                                  │
请求 B 返回 401（刷新进行中）     │
  └─ once(TOKEN_REFRESHED)        │
                                  │
                                  ├─ 成功 → emit(TOKEN_REFRESHED, { token })
                                  │    ├─ 请求 A 用新 Token 重试 → resolve
                                  │    └─ 请求 B 用新 Token 重试 → resolve
                                  │
                                  └─ 失败 → emit(TOKEN_REFRESH_FAILED, { error })
                                       ├─ 请求 A reject
                                       ├─ 请求 B reject
                                       └─ 跳转登录页
```

### 初始化

在 `App.vue` 的 `onLaunch` 中调用 `setupAuth()` 注册鉴权监听：

```js
import { setupAuth } from '@/utils/auth'

onLaunch(() => {
  setupAuth()
})
```

### 相关常量

定义在 `config/constant.js`：

| 常量                         | 值                       | 发出方 | 用途                                 |
| ---------------------------- | ------------------------ | ------ | ------------------------------------ |
| `TOKEN_NEED_REFRESH_EVENT`   | `'TOKEN:NEED_REFRESH'`   | 请求层 | 通知鉴权层需要刷新 Token             |
| `TOKEN_REFRESHED_EVENT`      | `'TOKEN:REFRESHED'`      | 鉴权层 | Token 刷新成功，payload: `{ token }` |
| `TOKEN_REFRESH_FAILED_EVENT` | `'TOKEN:REFRESH_FAILED'` | 鉴权层 | Token 刷新失败，payload: `{ error }` |
| `MF_USER_TOKEN`              | `'__MF_userToken'`       | —      | 本地存储 Token 的键名                |

### 事件总线

`utils/event-emitter.js` 提供轻量发布订阅：

| 方法                    | 说明                                   |
| ----------------------- | -------------------------------------- |
| `on(event, listener)`   | 订阅事件，返回取消函数                 |
| `once(event, listener)` | 订阅一次，触发后自动解绑，返回取消函数 |
| `off(event, listener)`  | 取消订阅                               |
| `emit(event, ...args)`  | 触发事件                               |

- 鉴权层使用 `on` 持久订阅 `TOKEN_NEED_REFRESH_EVENT`（应用生命周期内始终监听）
- 请求层使用 `once` 订阅刷新结果，确保每个挂起请求只重试一次，触发后自动清理

## 中断请求

```js
const p = http.get('/slow-api', { page: 1 })

// 任意时刻中断
p.abort() // 或 p.cancel()

try {
  await p
} catch (e) {
  if (e.code === 'ERR_CANCELED') {
    console.log('请求已中断')
  }
}
```

中断时抛出的错误对象：

```js
{
  message: 'canceled',
  isCanceled: true,
  code: 'ERR_CANCELED',
  config: { /* 原始请求配置 */ }
}
```

## 上传文件

```js
const res = await http.upload('/file/upload', tempFilePath, 'file', {
  formData: { biz: 'avatar' },
  isLoading: false,
})
```

- 上传走 `wx.uploadFile` 分支，响应 `data` 自动 `JSON.parse`
- 上传请求默认不参与全局 Loading 队列

## 全局 Loading 策略

1. 首个请求入队时调用 `wx.showLoading({ title: '加载中...' })`
2. 每个请求完成后出队
3. 队列清空后延迟隐藏，减少闪烁
4. 单个请求可通过 `isLoading: false` 禁用：

```js
await http.get('/silent-api', {}, { isLoading: false })
```

## 错误处理

| 场景                  | 行为                                               |
| --------------------- | -------------------------------------------------- |
| 网络失败 / 服务器异常 | 进入 `Promise.reject`，可在 `.catch` 中处理        |
| 上传失败              | 默认 `resolve`（`isSuccess: false`），便于统一处理 |
| 请求中断              | 抛出 `ERR_CANCELED` 错误                           |
| 401 Token 失效        | 自动触发刷新队列，挂起请求等待重试或跳转登录       |

## 扩展建议

- **按标签取消请求** — 维护 `Map<tag, AbortController[]>` 请求表，按标签批量中断
- **重试/退避策略** — 在响应拦截器中实现指数退避重试
- **并发控制** — 基于信号量限制同时发出的请求数量
