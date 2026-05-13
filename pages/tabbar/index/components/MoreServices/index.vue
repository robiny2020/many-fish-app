<template>
  <view class="more-services" v-if="list.length">
    <view class="more-services__grid flex flex-wrap">
      <view
        class="more-services__item flex flex-col items-center"
        v-for="(item, index) in list"
        :key="index"
        @click="onItemClick(item)"
      >
        <view class="more-services__icon-wrap">
          <image class="more-services__icon" :src="item.icon" mode="aspectFill" />
          <text
            v-if="item.tag"
            class="more-services__tag"
            :class="tagClass(item.tagType)"
          >{{ item.tag }}</text>
        </view>
        <text class="more-services__label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup name="MoreServices">
  /**
   * MoreServices 更多回收服务导航组件
   * 宫格布局展示服务入口，支持角标标签
   *
   * @property {Array} list - 服务列表
   *   每项: { icon: string, label: string, link?: string, tag?: string, tagType?: 'hot' | 'highlight' }
   */

  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
  })



  /**
   * 根据标签类型返回对应样式类名
   * @param {string} type 标签类型
   * @returns {string} CSS 类名
   */
  function tagClass(type) {
    const map = {
      hot: 'more-services__tag--hot',
      highlight: 'more-services__tag--highlight',
    }
    return map[type] || 'more-services__tag--hot'
  }

  /**
   * 服务项点击事件
   * @param {Object} item 当前点击的服务数据
   */
  function onItemClick(item) {
    
  }
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
