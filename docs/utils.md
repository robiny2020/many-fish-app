# 工具函数

工具函数位于 `utils/` 目录。

## 目录结构

```text
utils/
├── auth.js           # 鉴权模块（token 刷新 / 静默登录）
├── event-emitter.js  # 事件总线
├── storage.js        # 本地存储封装
├── uni-api.js        # uni-app 原生 API Promise 化
└── index.js          # 统一导出
```

## uni-api — uni-app API Promise 化

将常用的回调式 uni API 封装为 Promise，便于 async/await 使用。

### getLoginProvider

获取当前可用的登录 provider。

```js
import { getLoginProvider } from '@/utils/uni-api'

const provider = await getLoginProvider()        // 默认 service='oauth'
const provider = await getLoginProvider('push')  // 指定 service
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `service` | `String` | `'oauth'` | uni.getProvider 的 service 参数 |

**返回值：** `Promise<string>` — provider 名称（如 `weixin`）

### uniLogin

封装 `uni.login`，自动通过 `getLoginProvider` 获取 provider。

```js
import { uniLogin } from '@/utils/uni-api'

const code = await uniLogin()
```

**返回值：** `Promise<string>` — 微信 login code
