<script setup>
  import { useSystemStore } from '@/store'
  const { initSystemInfoSync } = useSystemStore()

  onLaunch((options) => {
    console.log('App Launch', options)
    initSystemInfoSync()
    initStartParams(options)
  })
  onShow(() => {})
  onHide(() => {})
  onPageNotFound(() => {
    uni.switchTab({
      url: '/pages/index/index',
    })
  })

  function initStartParams(params) {
    const { query } = params
    if (query) {
    }
  }
</script>

<style lang="scss">
  /*每个页面公共css */
</style>
