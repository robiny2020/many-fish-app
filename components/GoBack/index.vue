<template>
  <view
    class="go-back flex-center"
    :class="{ 'go-back--float': float }"
    :style="rootStyle"
    @click="handleBack"
  >
    <image
      class="go-back__icon"
      :src="iconSrc"
      :style="iconStyle"
      mode="aspectFit"
    />
  </view>
</template>

<script setup>
  /**
   * GoBack 返回组件
   * 根据页面栈自动判断：有上一页则返回上一页，否则跳转首页
   *
   * @property {Boolean} float - 是否浮动定位（fixed），默认 true
   * @property {String|Number} top - 距顶部距离，默认使用状态栏高度 + 安全距离
   * @property {String|Number} left - 距左侧距离，默认 24rpx
   * @property {String|Number} right - 距右侧距离（设置后 left 失效）
   * @property {String|Number} bottom - 距底部距离（设置后 top 失效）
   * @property {String|Number} size - 图标容器尺寸，默认 72rpx
   * @property {String|Number} iconSize - 图标尺寸，默认 40rpx
   * @property {String} homePath - 首页路径，默认 /pages/tabbar/index/index
   * @property {Number} zIndex - 层级，默认 999
   */

  const props = defineProps({
    float: {
      type: Boolean,
      default: true,
    },
    top: {
      type: [String, Number],
      default: '',
    },
    left: {
      type: [String, Number],
      default: '',
    },
    right: {
      type: [String, Number],
      default: '',
    },
    bottom: {
      type: [String, Number],
      default: '',
    },
    size: {
      type: [String, Number],
      default: 72,
    },
    iconSize: {
      type: [String, Number],
      default: 60,
    },
    homePath: {
      type: String,
      default: '/pages/tabbar/index/index',
    },
    zIndex: {
      type: Number,
      default: 999,
    },
  })

  const emit = defineEmits(['click'])

  /** 是否可以返回上一页（页面栈深度 > 1） */
  const canGoBack = computed(() => {
    const pages = getCurrentPages()
    return pages.length > 1
  })

  /** 根据页面栈状态决定显示返回图标还是首页图标 */
  const iconSrc = computed(() => {
    return canGoBack.value ? '/static/icons/go-back.png' : '/static/icons/go-home.png'
  })

  /**
   * 将数值转为 rpx 单位字符串
   * 如果传入字符串且已包含单位则直接返回
   * @param {String|Number} val
   * @returns {String}
   */
  function toUnit(val) {
    if (val === '' || val === undefined || val === null) return ''
    if (typeof val === 'string' && /[a-zA-Z%]/.test(val)) return val
    return `${val}rpx`
  }

  /** 容器样式 */
  const rootStyle = computed(() => {
    const style = {}
    const sizeVal = toUnit(props.size)

    if (sizeVal) {
      style.width = sizeVal
      style.height = sizeVal
    }

    if (props.float) {
      style.zIndex = props.zIndex

      // 垂直定位：bottom 优先于 top
      if (props.bottom !== '') {
        style.bottom = toUnit(props.bottom)
        style.top = 'auto'
      } else if (props.top !== '') {
        style.top = toUnit(props.top)
      }
      // 如果 top 和 bottom 都未传，使用默认安全区域定位（CSS 变量兜底）

      // 水平定位：right 优先于 left
      if (props.right !== '') {
        style.right = toUnit(props.right)
        style.left = 'auto'
      } else if (props.left !== '') {
        style.left = toUnit(props.left)
      }
    }

    return style
  })

  /** 图标样式 */
  const iconStyle = computed(() => {
    const iconSizeVal = toUnit(props.iconSize)
    return iconSizeVal ? { width: iconSizeVal, height: iconSizeVal } : {}
  })

  /**
   * 点击返回处理
   * 有上一页 → navigateBack
   * 无上一页 → reLaunch 到首页
   */
  function handleBack() {
    emit('click', { canGoBack: canGoBack.value })

    if (canGoBack.value) {
      uni.navigateBack({ delta: 1 }).catch(() => {
        uni.switchTab({ url: props.homePath })
      })
    } else {
      uni.switchTab({ url: props.homePath })
    }
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
