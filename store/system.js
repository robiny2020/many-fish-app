export const useSystemStore = defineStore(
  'system',
  () => {
    // 是否初始化系统信息
    const isInit = ref(false)
    // 在竖屏正方向下的安全区域插入位置
    const safeAreaInsets = ref({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    })
    // 手机状态栏的高度
    const statusBarHeight = ref(0)
    // 屏幕宽度
    const screenWidth = ref(375)
    // 屏幕高度
    const screenHeight = ref(812)
    // 设备型号 Web平台部分设备无法获取
    const deviceModel = ref('')
    // 设备类型。如phone、pad、pc、unknow
    const deviceType = ref('')
    // 设备品牌。如：apple、huawei
    const deviceBrand = ref('')
    // 设备像素比
    const devicePixelRatio = ref(1)

    function initSystemInfoSync() {
      if (isInit.value) return
      try {
        const data = uni.getSystemInfoSync()
        safeAreaInsets.value = data.safeAreaInsets
        statusBarHeight.value = data.statusBarHeight
        screenWidth.value = data.screenWidth
        screenHeight.value = data.screenHeight
        deviceModel.value = data.deviceModel
        deviceType.value = data.deviceType
        deviceBrand.value = data.deviceBrand
        devicePixelRatio.value = data.devicePixelRatio
        isInit.value = true
      } catch (_) {}
    }

    return {
      initSystemInfoSync,
      safeAreaInsets,
      statusBarHeight,
      screenWidth,
      screenHeight,
      deviceModel,
      deviceType,
      deviceBrand,
      devicePixelRatio,
    }
  },
  {
    persist: true,
  },
)
