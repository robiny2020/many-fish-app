/**
 * 轻量级发布订阅事件总线
 * 支持 on / once / off / emit
 */
class EventEmitter {
  /** @type {Map<string, Set<Function>>} */
  #listeners = new Map()

  /**
   * 订阅事件
   * @param {string} eventName 事件名
   * @param {Function} listener 回调函数
   * @returns {Function} 取消订阅函数
   */
  on(eventName, listener) {
    if (!this.#listeners.has(eventName)) {
      this.#listeners.set(eventName, new Set())
    }
    this.#listeners.get(eventName).add(listener)
    // 返回取消函数，方便调用方解绑
    return () => this.off(eventName, listener)
  }

  /**
   * 订阅一次（触发后自动解绑）
   * @param {string} eventName 事件名
   * @param {Function} listener 回调函数
   * @returns {Function} 取消订阅函数
   */
  once(eventName, listener) {
    const wrapper = (...args) => {
      this.off(eventName, wrapper)
      listener(...args)
    }
    wrapper._original = listener
    return this.on(eventName, wrapper)
  }

  /**
   * 取消订阅
   * @param {string} eventName 事件名
   * @param {Function} listener 回调函数
   */
  off(eventName, listener) {
    const set = this.#listeners.get(eventName)
    if (!set) return
    set.delete(listener)
    // 同时检查 once 包装
    set.forEach((fn) => {
      if (fn._original === listener) set.delete(fn)
    })
    if (set.size === 0) this.#listeners.delete(eventName)
  }

  /**
   * 触发事件
   * @param {string} eventName 事件名
   * @param {...any} args 传递给回调的参数
   */
  emit(eventName, ...args) {
    const set = this.#listeners.get(eventName)
    if (!set) return
    set.forEach((listener) => listener(...args))
  }
}

export default new EventEmitter()
