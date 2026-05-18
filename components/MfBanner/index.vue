<template>
  <view
    class="mf-banner"
    :style="[containerStyle, customStyle]"
  >
    <!-- 多张：swiper 轮播 -->
    <swiper
      v-if="list.length > 1"
      class="mf-banner__swiper"
      :style="sizeStyle"
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
      :circular="circular"
      indicator-color="rgba(255,255,255,0.4)"
      indicator-active-color="#FFFFFF"
    >
      <swiper-item
        v-for="(item, index) in list"
        :key="index"
        @click="onBannerClick(item, index)"
      >
        <image
          class="mf-banner__image"
          :style="sizeStyle"
          :src="item.image || item.bannerImgUrl"
          mode="aspectFill"
        />
      </swiper-item>
    </swiper>

    <!-- 单张：直接展示，无轮播 -->
    <view
      v-else-if="list.length === 1"
      class="mf-banner__single"
      :style="sizeStyle"
      @click="onBannerClick(list[0], 0)"
    >
      <image
        class="mf-banner__image"
        :style="sizeStyle"
        :src="list[0].image || list[0].bannerImgUrl"
        mode="aspectFill"
      />
    </view>
  </view>
</template>

<script setup name="MfBanner">
  /**
   * MfBanner 通用导航 Banner 组件
   * 多张图片时渲染为 swiper 轮播，单张图片时去除轮播直接展示
   *
   * @property {Array}          list        - banner 数据列表，每项包含 { image|bannerImgUrl: string, link?: string }
   * @property {String|Number}  width       - 宽度，支持 rpx/px/%，默认 '100%'
   * @property {String|Number}  height      - 高度，支持 rpx/px/%，默认 '300rpx'
   * @property {Object}         customStyle - 最外层自定义样式对象（外边距、背景等）
   * @property {Boolean}        indicatorDots - 是否显示指示点，默认 true
   * @property {Boolean}        autoplay    - 是否自动播放，默认 true
   * @property {Number}         interval    - 自动播放间隔（ms），默认 3000
   * @property {Number}         duration    - 滑动动画时长（ms），默认 500
   * @property {Boolean}        circular    - 是否循环播放，默认 true
   */

  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
    width: {
      type: [String, Number],
      default: '100%',
    },
    height: {
      type: [String, Number],
      default: '300rpx',
    },
    customStyle: {
      type: Object,
      default: () => ({}),
    },
    indicatorDots: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    duration: {
      type: Number,
      default: 500,
    },
    circular: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits(['item-click'])

  /**
   * 格式化尺寸值，纯数字自动加 rpx
   * @param {String|Number} val 尺寸值
   * @returns {String} 格式化后的 CSS 值
   */
  const formatSize = (val) => {
    if (typeof val === 'number') return `${val}rpx`
    if (/^\d+$/.test(val)) return `${val}rpx`
    return val
  }

  /** 容器宽度样式 */
  const containerStyle = computed(() => ({
    width: formatSize(props.width),
  }))

  /** 内部元素统一尺寸 */
  const sizeStyle = computed(() => ({
    width: formatSize(props.width),
    height: formatSize(props.height),
  }))

  const attrs = useAttrs()

  /**
   * banner 点击事件
   * 传了 @click 走回调，未传默认走页面跳转
   * @param {Object} item 当前点击的 banner 数据
   * @param {Number} index 当前点击的索引
   */
  const onBannerClick = (item, index) => {
    if (attrs.onBannerClick) {
      emit('banner-click', { item, index })
      return
    }
    const url = item.link || item.bannerJumpPath
    if (url) {
      uni.navigateTo({ url })
    }
  }
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
