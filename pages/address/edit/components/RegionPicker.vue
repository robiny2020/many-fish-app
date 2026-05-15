<template>
  <MfPopup
    v-model="visible"
    position="bottom"
    :round="true"
  >
    <view class="region-picker safe-bottom">
      <view class="region-picker__header flex-between">
        <text
          class="region-picker__cancel"
          @click="handleCancel"
        >
          取消
        </text>
        <text class="region-picker__title">选择地区</text>
        <text
          class="region-picker__confirm"
          @click="handleConfirm"
        >
          确定
        </text>
      </view>
      <picker-view
        class="region-picker__view"
        :value="pickerValue"
        @change="handleChange"
      >
        <picker-view-column>
          <view
            v-for="item in provinces"
            :key="item.code"
            class="region-picker__item"
          >
            {{ item.name }}
          </view>
        </picker-view-column>
        <picker-view-column>
          <view
            v-for="item in cities"
            :key="item.code"
            class="region-picker__item"
          >
            {{ item.name }}
          </view>
        </picker-view-column>
        <picker-view-column>
          <view
            v-for="item in districts"
            :key="item.code"
            class="region-picker__item"
          >
            {{ item.name }}
          </view>
        </picker-view-column>
      </picker-view>
    </view>
  </MfPopup>
</template>

<script setup>
  import { MfPopup } from '@/components'

  /**
   * RegionPicker 省市区选择器组件
   *
   * @property {Boolean} modelValue - 控制显隐（v-model）
   *
   * @event confirm - 确认选择，返回 { province, city, district } 各含 code / name
   * @event cancel - 取消选择
   */

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

  /** 弹窗显隐双向绑定 */
  const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  /** 选择器当前索引 */
  const pickerValue = ref([0, 0, 0])

  /** 省份数据（实际项目中应从接口或本地数据获取） */
  const provinces = ref([
    { code: '110000', name: '北京市' },
    { code: '120000', name: '天津市' },
    { code: '130000', name: '河北省' },
    { code: '140000', name: '山西省' },
    { code: '150000', name: '内蒙古自治区' },
    { code: '210000', name: '辽宁省' },
    { code: '220000', name: '吉林省' },
    { code: '230000', name: '黑龙江省' },
    { code: '310000', name: '上海市' },
    { code: '320000', name: '江苏省' },
    { code: '330000', name: '浙江省' },
    { code: '340000', name: '安徽省' },
    { code: '350000', name: '福建省' },
    { code: '360000', name: '江西省' },
    { code: '370000', name: '山东省' },
    { code: '410000', name: '河南省' },
    { code: '420000', name: '湖北省' },
    { code: '430000', name: '湖南省' },
    { code: '440000', name: '广东省' },
    { code: '450000', name: '广西壮族自治区' },
    { code: '460000', name: '海南省' },
    { code: '500000', name: '重庆市' },
    { code: '510000', name: '四川省' },
    { code: '520000', name: '贵州省' },
    { code: '530000', name: '云南省' },
    { code: '540000', name: '西藏自治区' },
    { code: '610000', name: '陕西省' },
    { code: '620000', name: '甘肃省' },
    { code: '630000', name: '青海省' },
    { code: '640000', name: '宁夏回族自治区' },
    { code: '650000', name: '新疆维吾尔自治区' },
  ])
  const cities = ref([{ code: '110100', name: '北京市' }])
  const districts = ref([{ code: '110101', name: '东城区' }])

  /** 选择器值改变 */
  const handleChange = (e) => {
    pickerValue.value = e.detail.value
  }

  /** 取消 */
  const handleCancel = () => {
    visible.value = false
    emit('cancel')
  }

  /** 确认选择 */
  const handleConfirm = () => {
    const pIdx = pickerValue.value[0]
    const cIdx = pickerValue.value[1]
    const dIdx = pickerValue.value[2]
    const province = provinces.value[pIdx]
    const city = cities.value[cIdx]
    const district = districts.value[dIdx]

    emit('confirm', {
      province: province ? { code: province.code, name: province.name } : null,
      city: city ? { code: city.code, name: city.name } : null,
      district: district ? { code: district.code, name: district.name } : null,
    })

    visible.value = false
  }
</script>

<style lang="scss" scoped>
  @import './RegionPicker.scss';
</style>
