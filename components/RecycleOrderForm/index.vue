<template>
  <view class="order-form">
    <!-- 标题行 -->
    <view class="order-form__header flex-between">
      <text class="order-form__title">上门取件回收</text>
      <view class="order-form__express flex-center">
        <text class="order-form__express-text">全程包邮</text>
      </view>
    </view>

    <!-- 提示条（插槽） -->
    <slot name="tip">
      <view class="order-form__tip flex items-center">
        <text class="order-form__tip-text">可将衣物打包后放置在门口，无需等待快递上门</text>
      </view>
    </slot>

    <!-- 取件地址 -->
    <view
      class="order-form__section"
      @click="handleAddressClick"
    >
      <view class="order-form__row flex-start">
        <image
          class="order-form__icon"
          src="https://oss.fmy90.cn/applet/fmy/2024/clothes/addr.png?x-oss-process=style/wechat_image_YS"
          mode="aspectFit"
        />
        <text class="order-form__label">取件地址</text>
        <view
          v-if="addressInfo.name"
          class="order-form__address-info flex items-center flex-1"
        >
          <text class="order-form__address-contact">
            {{ addressInfo.name }} {{ addressInfo.phone }}
          </text>
        </view>
        <text
          v-else
          class="order-form__placeholder flex-1"
        >
          请选择取件地址
        </text>
        <text class="web-arrow" />
      </view>
      <view
        v-if="addressInfo.address"
        class="order-form__address-detail"
      >
        <text class="order-form__address-text">{{ addressInfo.address }}</text>
      </view>
    </view>

    <!-- 上门时间 -->
    <view
      class="order-form__section"
      @click="handleTimeClick"
    >
      <view class="order-form__row flex-start">
        <image
          class="order-form__icon"
          src="https://oss.fmy90.cn/applet/fmy/2024/clothes/addr.png?x-oss-process=style/wechat_image_YS"
          mode="aspectFit"
        />
        <text class="order-form__label">上门时间</text>
        <text
          :class="['flex-1', timeInfo.date ? 'order-form__time-value' : 'order-form__placeholder']"
        >
          {{ timeDisplayText || '预约上门时间（可选未来7天）' }}
        </text>
        <text class="web-arrow" />
      </view>
    </view>

    <!-- 预估重量 -->
    <view
      v-if="showWeight"
      class="order-form__section order-form__section--weight"
    >
      <view class="order-form__row flex-start">
        <image
          class="order-form__icon"
          src="https://oss.fmy90.cn/applet/fmy/2024/clothes/addr.png?x-oss-process=style/wechat_image_YS"
          mode="aspectFit"
        />
        <text class="order-form__label">预估重量</text>
      </view>
      <view class="order-form__weight-list flex-between">
        <view
          v-for="(item, index) in weightOptions"
          :key="index"
          :class="[
            'order-form__weight-item flex-center-col',
            { 'order-form__weight-item--active': selectedWeightIndex === index },
          ]"
          @click="handleWeightSelect(index)"
        >
          <text class="order-form__weight-range">{{ item.range }}</text>
          <text class="order-form__weight-desc">{{ item.desc }}</text>
          <view
            v-if="selectedWeightIndex === index"
            class="order-form__weight-check"
          />
        </view>
      </view>
    </view>

    <!-- 回收物品照片 -->
    <view
      v-if="showPhoto"
      class="order-form__section order-form__section--photo"
    >
      <view class="order-form__row flex-start">
        <image
          class="order-form__icon"
          src="https://oss.fmy90.cn/applet/fmy/2024/clothes/addr.png?x-oss-process=style/wechat_image_YS"
          mode="aspectFit"
        />
        <text class="order-form__label">回收物品照片</text>
      </view>
      <view class="order-form__photo-list flex-start">
        <!-- 示例图 -->
        <view
          v-if="exampleImage"
          class="order-form__photo-example"
          @click="handlePreviewExample"
        >
          <image
            class="order-form__photo-example-img"
            :src="exampleImage"
            mode="aspectFill"
          />
          <view class="order-form__photo-example-mask flex items-center flex-col justify-center">
            <text>示例:</text>
            <text>点击查看大图</text>
          </view>
        </view>
        <!-- 添加照片按钮 -->
        <view
          v-if="photoList.length < maxPhotos"
          class="order-form__photo-add flex-center-col"
          @click="handleAddPhoto"
        >
          <view class="order-form__photo-add-icon" />
          <text class="order-form__photo-add-text">上传物品照片</text>
        </view>
        <!-- 已上传的照片 -->
        <view
          v-for="(photo, index) in photoList"
          :key="index"
          class="order-form__photo-item"
        >
          <image
            class="order-form__photo-img"
            :src="photo"
            mode="aspectFill"
            @click="handlePreviewPhoto(index)"
          />
          <view
            class="order-form__photo-delete"
            @click.stop="handleDeletePhoto(index)"
          />
        </view>
      </view>
    </view>
  </view>

  <!-- 示例图预览弹窗 -->
  <MfPopup
    v-model="showExamplePopup"
    position="center"
    bgColor="transparent"
  >
    <view class="order-form__example-dialog flex flex-col items-center">
      <view class="order-form__example-dialog-header flex flex-col items-center">
        <text class="order-form__example-dialog-title">拍照示例</text>
        <text class="order-form__example-dialog-desc">请参考以下示例拍摄回收物品</text>
      </view>
      <image
        class="order-form__example-dialog-img"
        :src="exampleImage"
        mode="widthFix"
      />
      <view
        class="order-form__example-dialog-btn flex-center"
        @click="showExamplePopup = false"
      >
        <text class="order-form__example-dialog-btn-text">我知道了</text>
      </view>
    </view>
  </MfPopup>
</template>

<script setup name="RecycleOrderForm">
  import { MfPopup } from '@/components'
  import { uniToast } from '@/utils/uni-api'

  /**
   * RecycleOrderForm 预约回收下单表单
   *
   * @property {Object}  addressInfo   - 地址信息 { name, phone, address }（必填，父组件控制）
   * @property {Object}  timeInfo      - 已选时间 { date, dateLabel, slotId, slotLabel }（必填，父组件控制）
   * @property {Boolean} showWeight    - 是否显示预估重量模块，默认 true
   * @property {Boolean} showPhoto     - 是否显示照片上传模块，默认 true
   * @property {Array}   weightOptions - 重量选项列表
   * @property {String}  exampleImage  - 示例图 URL，为空则不显示示例图
   * @property {Number}  maxPhotos     - 最大照片数量，默认 2
   */

  const props = defineProps({
    addressInfo: {
      type: Object,
      default: () => ({ name: '', phone: '', address: '' }),
    },
    timeInfo: {
      type: Object,
      default: () => ({ date: '', dateLabel: '', slotId: -1, slotLabel: '' }),
    },
    showWeight: {
      type: Boolean,
      default: true,
    },
    showPhoto: {
      type: Boolean,
      default: true,
    },
    weightOptions: {
      type: Array,
      default: () => [
        { range: '3 – 10kg', desc: '约20件' },
        { range: '10 – 20kg', desc: '约40件' },
        { range: '20 – 40kg', desc: '约50件' },
      ],
    },
    exampleImage: {
      type: String,
      default: '',
    },
    maxPhotos: {
      type: Number,
      default: 2,
    },
    requirePhoto: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['address-click', 'time-click', 'submit'])

  /** 时间显示文本 */
  const timeDisplayText = computed(() => {
    if (!props.timeInfo.date) return ''
    return `${props.timeInfo.dateLabel} ${props.timeInfo.slotLabel}`
  })

  /** 组件内部状态 */
  const selectedWeightIndex = ref(1)
  const photoList = ref([])

  /** 点击取件地址 */
  const handleAddressClick = () => {
    emit('address-click')
  }

  /** 点击上门时间 */
  const handleTimeClick = () => {
    emit('time-click')
  }

  /**
   * 选择重量
   * @param {Number} index 选中的索引
   */
  const handleWeightSelect = (index) => {
    selectedWeightIndex.value = index
  }

  /** 添加照片 */
  const handleAddPhoto = () => {
    const remaining = props.maxPhotos - photoList.value.length
    if (remaining <= 0) return
    uni.chooseImage({
      count: remaining,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        photoList.value.push(...res.tempFilePaths)
      },
    })
  }

  /**
   * 删除照片
   * @param {Number} index 照片索引
   */
  const handleDeletePhoto = (index) => {
    photoList.value.splice(index, 1)
  }

  /** 示例图弹窗状态 */
  const showExamplePopup = ref(false)

  /** 预览示例图 */
  const handlePreviewExample = () => {
    if (!props.exampleImage) return
    showExamplePopup.value = true
  }

  /**
   * 预览已上传照片
   * @param {Number} index 照片索引
   */
  const handlePreviewPhoto = (index) => {
    uni.previewImage({
      urls: photoList.value,
      current: index,
    })
  }

  /**
   * 收集表单数据
   * @returns {Object} 完整表单数据
   */
  const getFormData = () => {
    const data = {
      addressInfo: props.addressInfo,
      timeInfo: { ...props.timeInfo },
    }
    if (props.showWeight) {
      data.weightIndex = selectedWeightIndex.value
      data.weightOption =
        selectedWeightIndex.value >= 0 ? props.weightOptions[selectedWeightIndex.value] : null
    }
    if (props.showPhoto) {
      data.photoList = [...photoList.value]
    }
    return data
  }

  /**
   * 校验表单必填项
   * 校验通过返回 true 并 emit submit，否则提示并返回 false
   * @returns {Boolean} 是否通过校验
   */
  const validate = () => {
    if (!props.addressInfo.name || !props.addressInfo.phone) {
      uniToast('请选择取件地址')
      return false
    }
    if (!props.timeInfo.date || props.timeInfo.slotId < 0) {
      uniToast('请选择上门时间')
      return false
    }
    if (props.showWeight && selectedWeightIndex.value < 0) {
      uniToast('请选择预估重量')
      return false
    }
    if (props.showPhoto && props.requirePhoto && photoList.value.length === 0) {
      uniToast('请上传回收物品照片')
      return false
    }
    const formData = getFormData()
    emit('submit', formData)
    return true
  }

  defineExpose({ validate, getFormData })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
