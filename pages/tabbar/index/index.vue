<template>
	<view class="page-index">
		<TopBanner :list="bannerList" />
		<MainAction />
		<MoreServices :list="serviceList" />
	</view>
</template>

<script setup>
	import { TopBanner, MainAction, MoreServices } from './components'
	

	const bannerList = ref([{
    bannerImgUrl: 'https://oss.fmy90.cn/applet/2025/09/wx-index-top-banner.png?x-oss-process=style/wechat_image_YS',
    bannerJumpPath: '',
    bannerJumpType: 1,
  }])

	/** 更多回收服务列表 */
	const serviceList = ref([
		{ icon: '', label: '旧衣回收', link: '/pages/recycle/clothes/index', tag: '热门', tagType: 'hot' },
		{ icon: '', label: '书籍回收', link: '/pages/recycle/book/index' },
		{ icon: '', label: '大家电回收', link: '/pages/recycle/appliance/index' },
		{ icon: '', label: '手机回收', link: '/pages/recycle/digital/index', tag: '全网高价', tagType: 'highlight' },
		{ icon: '', label: '家具清运', link: '/pages/recycle/furniture/index' },
		{ icon: '', label: '毛绒玩具', link: '/pages/recycle/toy/index' },
		{ icon: '', label: '小家电回收', link: '/pages/recycle/appliance/index' },
		{ icon: '', label: '黄金珠宝', link: '' },
		{ icon: '', label: '奢侈品', link: '' },
		{ icon: '', label: '墨盒回收', link: '' },
	])
</script>

<style lang="scss" scoped>
	.page-index {
		min-height: 100vh;
		background-color: $uni-bg-color-grey;
	}
</style>
