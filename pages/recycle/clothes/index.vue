<template>
  <view class="recycle-clothes">
    <MfBanner :list="bannerList" />
    <RecycleOrderForm
      ref="orderFormRef"
      :addressInfo="addressInfo"
      :timeInfo="timeInfo"
      exampleImage="https://oss.fmy90.cn/applet/2024/fmyapp/1021/risk22.png?x-oss-process=style/wechat_image_YS"
      @address-click="handleAddressClick"
      @time-click="openTimePicker"
      @submit="handleSubmit"
    />

    <!-- 时间选择弹窗 -->
    <TimePickerPopup
      v-model="showTimePicker"
      :defaultDate="timeInfo.date"
      :defaultSlotId="timeInfo.slotId"
      @confirm="handleTimeConfirm"
    />
  </view>
</template>

<script setup>
  import { MfBanner, RecycleOrderForm, TimePickerPopup } from '@/components'
  import { useTimePicker } from '@/composables'

  const bannerList = ref([
    {
      image: '',
      link: '',
    },
  ])

  const orderFormRef = ref(null)

  /** 取件地址 */
  const addressInfo = ref({
    name: '',
    phone: '',
    address: '',
  })

  /** 上门时间 */
  const { showTimePicker, timeInfo, openTimePicker, handleTimeConfirm } = useTimePicker()

  /** 选择取件地址 */
  const handleAddressClick = () => {
    uni.navigateTo({ url: '/pages/address/list/index' })
  }

  /**
   * 表单校验通过回调
   * @param {Object} formData 完整表单数据
   */
  const handleSubmit = (formData) => {
    // TODO: 提交订单
  }
</script>

<style lang="scss" scoped>
  .recycle-clothes {
    min-height: 100vh;
    background-color: #f5f5f5;
  }
</style>
