import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // 数据持久化
const STORAGE_PREFIX = '__MANY-FISH_'

const store = createPinia()
store.use(
  createPersistedState({
    key: (id) => `${STORAGE_PREFIX}${id}`, // 统一前缀
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
)

export default store

// 模块统一导出
export * from './system'
export * from './user'
export * from './auth'
export * from './base'
export * from './address'
