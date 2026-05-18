<template>
  <web-view :src="webViewUrl" />
</template>

<script setup>
  import { useBaseStore } from '@/store'

  const { startAppTime, platformKey } = storeToRefs(useBaseStore)

  const webViewUrl = ref('')

  onLoad((options) => {
    let webUrl = options.webUrl
    if (webUrl.indexOf('?') > -1) {
      webUrl += `&mf_pk=${platformKey.value}&mf_st=${startAppTime.value}`
    } else {
      webUrl += `?mf_pk=${platformKey.value}&mf_st=${startAppTime.value}`
    }

    webViewUrl.value = webUrl
  })
</script>

<style></style>
