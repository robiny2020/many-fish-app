export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)

  function setUserInfo(params) {
    userInfo.value = params
  }

  return {
    userInfo,
    setUserInfo,
  }
})
