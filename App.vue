<script setup>
  import { useSystemStore } from '@/store'
  import { setupAuth } from '@/utils/auth'

  const { initSystemInfoSync } = useSystemStore()

  onLaunch((options) => {
    console.log('App Launch', options)
    initSystemInfoSync()
    setupAuth()
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
