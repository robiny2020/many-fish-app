<template>
  <!-- 导航栏主体 -->
  <view
    class="nav-bar"
    :style="navBarStyle"
    v-if="visible"
  >
    <!-- 状态栏占位 -->
    <view
      class="nav-bar__status-bar"
      :style="{ height: statusBarHeightPx }"
    />
    <!-- 内容区：左 | 中 | 右 -->
    <view
      class="nav-bar__content"
      :style="contentStyle"
    >
      <!-- ====== 模式 A：显示 GoBack（左 + 中 + 右） ====== -->
      <template v-if="showBack">
        <!-- 左侧：GoBack -->
        <view class="nav-bar__left">
          <GoBack
            :float="false"
            :size="size"
            :icon-size="iconSize"
          />
        </view>
        <!-- 中间：标题 / 图片 / 插槽 -->
        <view class="nav-bar__center">
          <slot name="center">
            <image
              v-if="titleImage"
              class="nav-bar__title-image"
              :src="titleImage"
              mode="heightFix"
            />
            <text
              v-else-if="title"
              class="nav-bar__title"
              :style="titleStyle"
            >
              {{ title }}
            </text>
          </slot>
        </view>
        <!-- 右侧插槽 -->
        <view class="nav-bar__right">
          <slot name="right" />
        </view>
      </template>

      <!-- ====== 模式 B：不显示 GoBack（左中合并 + 右） ====== -->
      <template v-else>
        <view class="nav-bar__merged">
          <slot name="merged">
            <image
              v-if="titleImage"
              class="nav-bar__merged-image"
              :src="titleImage"
              mode="heightFix"
            />
            <text
              v-else
              class="nav-bar__merged-title"
              :style="titleStyle"
            >
              {{ title }}
            </text>
          </slot>
        </view>
        <!-- 右侧插槽 -->
        <view class="nav-bar__right">
          <slot name="right" />
        </view>
      </template>
    </view>
  </view>

  <!-- 占位元素：撑起与导航栏等高的空间，防止内容被遮挡 -->
  <view
    v-if="placeholder && visible"
    class="nav-bar__placeholder"
    :style="{ height: placeholderHeight }"
  />
</template>

<script setup>
  /**
   * NavBar 顶部导航栏组件
   *
   * 功能：
   * - 左 | 中 | 右 三栏布局，fixed 浮动定位
   * - 左侧集成 GoBack 组件，可控制显隐
   * - 不显示 GoBack 时左中合并为 merged 插槽
   * - 支持背景色 / 渐变背景
   * - 支持根据页面滚动距离动态控制显隐和透明度
   * - 左右两端 24rpx 内边距
   *
   * @property {String} title - 标题文字
   * @property {String} titleImage - 标题图片（优先于 title）
   * @property {String} titleColor - 标题文字颜色
   * @property {Boolean} showBack - 是否显示 GoBack 组件，默认 true
   * @property {String|Number} size - GoBack 容器尺寸，默认 72rpx
   * @property {String|Number} iconSize - GoBack 图标尺寸，默认 60rpx
   * @property {String} background - 背景色（支持渐变，如 linear-gradient(...)）
   * @property {Boolean} placeholder - 是否生成等高占位元素，默认 true
   * @property {Number} zIndex - 层级，默认 990
   * @property {Boolean} scrollShow - 是否开启滚动显隐模式，默认 false
   * @property {Number} scrollThreshold - 滚动多少 px 后完全显示，默认 100
   * @property {Number} opacity - 手动控制透明度 0~1（优先于滚动计算），默认 -1 不启用
   */

  import { GoBack } from '@/components'
  import { useSystemStore } from '@/store'

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    titleImage: {
      type: String,
      default: '',
    },
    titleColor: {
      type: String,
      default: '',
    },
    showBack: {
      type: Boolean,
      default: true,
    },
    size: {
      type: [String, Number],
      default: 72,
    },
    iconSize: {
      type: [String, Number],
      default: 60,
    },
    background: {
      type: String,
      default: '#ffffff',
    },
    placeholder: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 990,
    },
    scrollShow: {
      type: Boolean,
      default: false,
    },
    scrollThreshold: {
      type: Number,
      default: 150,
    },
    opacity: {
      type: Number,
      default: -1,
    },
  })

  const systemStore = useSystemStore()

  /** 状态栏高度（px 字符串） */
  const statusBarHeightPx = computed(() => {
    return `${systemStore.statusBarHeight || 0}px`
  })

  /** 当前滚动距离（由父页面通过 ref 调用 updateScrollTop 传入） */
  const scrollTop = ref(0)

  /** 计算最终透明度 */
  const finalOpacity = computed(() => {
    // 手动指定 opacity 优先
    if (props.opacity >= 0) {
      return Math.min(1, Math.max(0, props.opacity))
    }
    // 滚动显隐模式
    if (props.scrollShow) {
      if (props.scrollThreshold <= 0) return 1
      return Math.min(1, Math.max(0, scrollTop.value / props.scrollThreshold))
    }
    // 默认完全可见
    return 1
  })

  /** 是否可见（透明度为 0 时隐藏以提升性能） */
  const visible = computed(() => {
    if (props.scrollShow && finalOpacity.value <= 0) return false
    return true
  })

  /** 导航栏容器样式 */
  const navBarStyle = computed(() => {
    const style = {
      zIndex: props.zIndex,
      opacity: finalOpacity.value,
    }

    // 背景：检测是否为渐变
    const bg = props.background
    if (bg.includes('gradient') || bg.includes('url(')) {
      style.backgroundImage = bg
    } else {
      style.backgroundColor = bg
    }

    return style
  })

  /** 内容区域样式 */
  const contentStyle = computed(() => {
    return {}
  })

  /** 标题文字样式 */
  const titleStyle = computed(() => {
    const style = {}
    if (props.titleColor) {
      style.color = props.titleColor
    }
    return style
  })

  /** 占位元素高度 = 状态栏 + 导航内容区 88rpx */
  const placeholderHeight = computed(() => {
    return `calc(${statusBarHeightPx.value} + 88rpx)`
  })

  /**
   * 暴露方法：允许父组件手动更新滚动距离
   * 适用于自定义 scroll-view 场景
   */
  defineExpose({
    updateScrollTop(top) {
      scrollTop.value = top
    },
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
