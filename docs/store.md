# 状态管理（Store）

基于 Pinia + `pinia-plugin-persistedstate` 的状态管理，统一从 `store/index.js` 导出。

## 目录结构

```text
store/
├── index.js      # 创建 pinia 实例 + 统一导出
├── system.js     # 系统信息
├── user.js       # 用户信息
├── auth.js       # 鉴权相关
├── base.js       # 基础数据
├── address.js    # 地址管理
└── message.js    # 消息模块
```

## 持久化配置

存储键统一前缀 `__MANY-FISH_`，使用 `uni.getStorageSync` / `uni.setStorageSync` 作为存储引擎。

## useAddressStore

地址管理 store，管理用户地址列表和当前选中地址。

### 引入

```js
import { useAddressStore } from '@/store'
```

### State

| 状态        | 类型         | 说明               |
| ----------- | ------------ | ------------------ |
| addressList | Array        | 地址列表           |
| addressInfo | Object\|null | 当前选中的地址信息 |

### Actions

| 方法                 | 参数             | 说明                                       |
| -------------------- | ---------------- | ------------------------------------------ |
| setAddressList(list) | Array            | 设置地址列表                               |
| setAddressInfo(info) | Object\|null     | 设置当前选中地址                           |
| delAddressInfo(item) | Object (需含 id) | 删除指定地址，若删除的是当前选中地址则清空 |

### 使用示例

```js
import { useAddressStore } from '@/store'

const addressStore = useAddressStore()
const { addressList } = storeToRefs(addressStore)

// 设置地址列表
addressStore.setAddressList([{ id: 1, name: '张三', phone: '13800000000', ... }])

// 选中地址
addressStore.setAddressInfo(addressList.value[0])

// 删除地址
addressStore.delAddressInfo({ id: 1 })
```

## useMessageStore

消息模块 store，管理未读消息数和 TabBar 角标。

### 引入

```js
import { useMessageStore } from '@/store'
```

### State

| 状态          | 类型         | 持久化 | 说明             |
| ------------- | ------------ | ------ | ---------------- |
| unreadCount   | number       | ✅     | 未读消息总数     |
| latestMessage | Object\|null | ❌     | 最近一条消息摘要 |

### Actions

| 方法                  | 说明                                 |
| --------------------- | ------------------------------------ |
| fetchUnreadCount()    | 请求后端获取未读数并更新 TabBar 角标 |
| clearUnread()         | 调用全部已读接口并清除角标           |
| decreaseUnread(count) | 本地减少未读数（标记已读后调用）     |
| setLatestMessage(msg) | 设置最新消息摘要                     |

### 使用示例

```js
import { useMessageStore } from '@/store'

const messageStore = useMessageStore()

// 拉取未读数（通常在首页 onShow 调用）
messageStore.fetchUnreadCount()

// 标记单条已读后本地减少
messageStore.decreaseUnread(1)

// 全部已读
await messageStore.clearUnread()
```
