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
└── address.js    # 地址管理
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

| 状态 | 类型 | 说明 |
| --- | --- | --- |
| addressList | Array | 地址列表 |
| addressInfo | Object\|null | 当前选中的地址信息 |

### Actions

| 方法 | 参数 | 说明 |
| --- | --- | --- |
| setAddressList(list) | Array | 设置地址列表 |
| setAddressInfo(info) | Object\|null | 设置当前选中地址 |
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
