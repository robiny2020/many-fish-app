<template>
	<view class="content">
		<view class="text-area">
			<text
				class="title"
				@click="handleShowModel"
			>
				showModal
			</text>
		</view>
	</view>
</template>

<script setup>
	import { useModal } from '@/composables'
	const { showModal } = useModal()

	async function handleShowModel() {
		const { confirm } = await showModal({ title: '提示', content: '确认删除？' })
		console.log(confirm)
			confirm&&await showModal({ title: '提示1', content: '确认1删除？' })
		
	}
	onLoad(() => {})
</script>

<style></style>
