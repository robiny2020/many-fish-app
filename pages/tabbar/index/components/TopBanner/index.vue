<template>
  <view class="top-banner">
    <!-- 多张：swiper 轮播 -->
    <swiper
      v-if="list.length > 1"
      class="top-banner__swiper"
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      :circular="true"
      indicator-color="rgba(255,255,255,0.4)"
      indicator-active-color="#FFFFFF"
    >
      <swiper-item
        v-for="(item, index) in list"
        :key="index"
        @click="onBannerClick(item)"
      >
        <image
          class="top-banner__image"
          :src="item.image"
          mode="aspectFill"
        />
      </swiper-item>
    </swiper>

    <!-- 单张：直接展示，无轮播 -->
    <view
      v-else
      class="top-banner__single"
      @click="onBannerClick(list[0])"
    >
      <image
        class="top-banner__image"
        :src="list[0].bannerImgUrl"
        mode="aspectFill"
      />
    </view>
  </view>
</template>

<script setup name="TopBanner">
  /**
   * TopBanner 顶部导航 Banner 组件
   * 多张图片时渲染为 swiper 轮播，单张图片时去除轮播直接展示
   *
   * @property {Array} list - banner 数据列表，每项至少包含 { image: string, link?: string }
   */

  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
  })


  /**
   * banner 点击事件
   * @param {Object} item 当前点击的 banner 数据
   */
  function onBannerClick(item) {}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
