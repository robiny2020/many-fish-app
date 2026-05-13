// 字典 Dictionaries    expire过期时间key    permanent永久不过期
export const Dictionaries = {
  expire: '__expire__',
  permanent: 'permanent',
}

class Storage {
  setStorage(options) {
    const { key, data, expire = Dictionaries.permanent, ...rest } = options
    if (!key || !data) {
      console.error('key and value are required')
      return
    }
    const value = {
      data,
      [Dictionaries.expire]: expire,
    }
    uni.setStorage({
      key,
      data: value,
      fail: (err) => {
        console.error('Failed to set storage:', err)
      },
      ...rest,
    })
  }

  setStorageSync(options) {
    const { key, data, expire = Dictionaries.permanent } = options
    if (!key || !data) {
      console.error('key and value are required')
      return
    }
    const value = {
      data,
      [Dictionaries.expire]: expire,
    }
    try {
      uni.setStorageSync(key, value)
    } catch (err) {
      console.error('Failed to set storage synchronously:', err)
    }
  }

  getStorage(options) {
    const { key, success } = options
    uni.getStorage({
      key,
      success: (res) => {
        const result = this._handleStorageResponse(res.data, key)
        success && success(result)
      },
      fail: (err) => {
        const result = this._handleStorageResponse()
        success && success(result)
      },
    })
  }

  getStorageSync(key) {
    try {
      const value = uni.getStorageSync(key)
      return this._handleStorageResponse(value, key)
    } catch (err) {
      return {
        message: `key值无效`,
        value: null,
      }
    }
  }

  _handleStorageResponse(value, key) {
    if (value) {
      const obj = value
      const now = parseInt(new Date().getTime() / 1000)
      if (typeof obj[Dictionaries.expire] === 'number' && obj[Dictionaries.expire] < now) {
        this.removeStorageSync(key)
        return {
          message: `您的${key}已过期`,
          value: null,
        }
      } else {
        return {
          message: '成功读取',
          value: obj.data,
        }
      }
    } else {
      console.warn('key值无效')
      return {
        message: `key值无效`,
        value: null,
      }
    }
  }

  removeStorage(options) {
    const { key, ...rest } = options
    if (!key) {
      console.error('key is required')
      return
    }
    uni.removeStorage({
      key,
      fail: (err) => {
        console.error('Failed to remove storage:', err)
      },
      ...rest,
    })
  }

  removeStorageSync(key) {
    if (!key) {
      console.error('key is required')
      return
    }
    try {
      uni.removeStorageSync(key)
    } catch (err) {
      console.error('Failed to remove storage synchronously:', err)
    }
  }

  clearStorageSync() {
    try {
      uni.clearStorageSync()
    } catch (err) {
      console.error('Failed to clear storage synchronously:', err)
    }
  }
}

export default new Storage()
