export const useAddressStore = defineStore('address', () => {
  const addressList = ref([])
  const addressInfo = ref(null)

  function setAddressList(params) {
    addressList.value = params
  }

  function setAddressInfo(params) {
    addressInfo.value = params
  }

  function delAddressInfo(params) {
    addressList.value = addressList.value.filter((i) => i.id !== params.id)
    if (addressInfo.value && params.id == addressInfo.value.id) {
      setAddressInfo(null)
    }
  }

  return {
    addressList,
    setAddressList,
    addressInfo,
    setAddressInfo,
    delAddressInfo,
  }
})
