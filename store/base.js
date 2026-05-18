export const useBaseStore = defineStore('base', () => {
  const startAppTime = ref(0)

  function setStartAppTime() {
    startAppTime.value = parseInt(new Date().getTime() / 1000)
  }
  const platformKey = ref('12CD372A48771B9EC5B382F685BD43A0')

  function setPlatformKey(params) {
    platformKey.value = params
  }

  return {
    platformKey,
    setPlatformKey,
    startAppTime,
    setStartAppTime,
  }
})
