<template>
  <view class="address-edit">
    <!-- ==================== 智能识别区域 ==================== -->
    <!-- 示例提示 -->
    <view class="smart-area__example">
      <text class="smart-area__example-text">
        示例：多小鱼，136xxxxxxxx，广东省深圳市南山区xx路xxx号
      </text>
    </view>
    <view :class="['smart-area', { 'smart-area--focused': smartFocused }]">
      <view class="smart-area__input">
        <textarea
          v-model="smartText"
          class="smart-area__textarea"
          placeholder="「粘贴识别」或输入文本，智能拆分姓名、电话和地址"
          placeholder-class="smart-area__placeholder"
          :maxlength="500"
          auto-height
          @focus="smartFocused = true"
          @blur="smartFocused = false"
        />
      </view>
      <!-- 工具栏 -->
      <view class="smart-area__toolbar flex-between">
        <text
          v-if="smartText"
          class="smart-area__clear-btn"
          @click="handleSmartClear"
        >
          清空
        </text>
        <view v-else />
        <view
          class="smart-area__paste-btn flex-center"
          @click="smartText ? parseSmartText(smartText) : handlePasteAndParse()"
        >
          <text class="smart-area__paste-text">{{ smartText ? '识别' : '粘贴并识别' }}</text>
        </view>
      </view>
    </view>

    <!-- ==================== 表单区域 ==================== -->
    <view class="form-area">
      <!-- 联系人信息标题行 -->
      <view class="form-area__header flex-between">
        <text class="form-area__title">联系人信息</text>
        <view
          class="form-area__wx-btn flex-center"
          @click="handleImportWxAddress"
        >
          <text class="form-area__wx-text">微信地址簿</text>
        </view>
      </view>

      <!-- 姓名 + 电话 -->
      <view class="form-item form-item--contact flex-between">
        <view class="form-item__name-wrap flex-1">
          <input
            v-model="form.name"
            class="form-item__input"
            placeholder="姓名"
            placeholder-class="form-item__placeholder"
            maxlength="8"
          />
        </view>
        <view class="form-item__phone-wrap flex-start flex-1">
          <input
            v-model="form.phone"
            class="form-item__input"
            type="number"
            placeholder="电话"
            placeholder-class="form-item__placeholder"
            :maxlength="11"
          />
        </view>
        <view
          class="form-item__contact-btn flex-center-col"
          @click="handleChooseContact"
        >
          <image
            class="form-item__contact-icon"
            src="/static/address/icon-contact.png"
            mode="aspectFit"
          />
          <text class="form-item__contact-text">通讯录</text>
        </view>
      </view>

      <!-- 省市区 -->
      <view
        class="form-item flex-between"
        @click="handleOpenRegionPicker"
      >
        <text :class="['form-item__value flex-1', { 'form-item__placeholder': !regionText }]">
          {{ regionText || '省市区' }}
        </text>
        <text class="web-arrow" />

        <view
          class="form-item__location-btn flex-center-col"
          @click.stop="handleLocate"
        >
          <image
            class="form-item__location-icon"
            src="/static/address/icon-location.png"
            mode="aspectFit"
          />
          <text class="form-item__location-text">定位</text>
        </view>
      </view>

      <!-- 详细地址 -->
      <view class="form-item">
        <textarea
          v-model="form.detailAddress"
          auto-height
          class="form-item__input flex-1"
          placeholder="详细地址（例如**街**号**）"
          placeholder-class="form-item__placeholder"
          maxlength="60"
        />
      </view>

      <!-- 门牌号 -->
      <view class="form-item">
        <input
          v-model="form.doorNumber"
          class="form-item__input flex-1"
          placeholder="门牌号（选填）（例如：xx栋xx室）"
          placeholder-class="form-item__placeholder"
          maxlength="15"
        />
      </view>

      <!-- 默认寄件地址 + 清空 -->
      <view class="form-item form-item--default flex-between">
        <view
          class="default-check flex-start"
          @click="form.isDefault = !form.isDefault"
        >
          <view
            :class="['default-check__radio', { 'default-check__radio--active': form.isDefault }]"
          >
            <view
              v-if="form.isDefault"
              class="default-check__radio-inner"
            />
          </view>
          <text class="default-check__text">默认寄件地址</text>
        </view>
        <text
          class="form-area__clear-btn"
          @click="handleClear"
        >
          清空
        </text>
      </view>
    </view>

    <!-- ==================== 底部确定按钮 ==================== -->
    <view class="footer safe-bottom">
      <button
        class="footer__btn"
        :class="{ 'footer__btn--active': isFormValid }"
        @click="handleSubmit"
      >
        确定
      </button>
    </view>
  </view>

  <!-- ==================== 省市区选择器 ==================== -->
  <RegionPicker
    v-model="showRegionPicker"
    @confirm="handleRegionConfirm"
  />
</template>

<script setup>
  import RegionPicker from './components/RegionPicker.vue'

  /** 页面参数 —— id 存在时为编辑模式 */
  const addressId = ref('')
  const isEdit = computed(() => !!addressId.value)

  /** 表单数据 */
  const form = reactive({
    name: '',
    phone: '',
    province: '',
    provinceCode: '',
    city: '',
    cityCode: '',
    district: '',
    districtCode: '',
    detailAddress: '',
    doorNumber: '',
    isDefault: false,
  })

  /** 智能识别文本 */
  const smartText = ref('')
  /** textarea 聚焦状态 */
  const smartFocused = ref(false)

  /** 省市区文本 */
  const regionText = computed(() => {
    if (form.province && form.city && form.district) {
      return `${form.province} ${form.city} ${form.district}`
    }
    return ''
  })

  /** 表单校验 */
  const isFormValid = computed(() => {
    return !!(form.name && form.phone && form.province && form.detailAddress.length > 5)
  })

  // ==================== 省市区选择器 ====================
  const showRegionPicker = ref(false)

  /** 打开省市区选择器 */
  const handleOpenRegionPicker = () => {
    showRegionPicker.value = true
  }

  /** 确认省市区选择 */
  const handleRegionConfirm = ({ province, city, district }) => {
    if (province) {
      form.province = province.name
      form.provinceCode = province.code
    }
    if (city) {
      form.city = city.name
      form.cityCode = city.code
    }
    if (district) {
      form.district = district.name
      form.districtCode = district.code
    }
  }

  // ==================== 事件处理 ====================

  /** 清空智能识别文本 */
  const handleSmartClear = () => {
    smartText.value = ''
  }

  /** 粘贴并识别 */
  const handlePasteAndParse = () => {
    uni.getClipboardData({
      success: (res) => {
        smartText.value = res.data || ''
        parseSmartText(smartText.value)
      },
    })
  }

  /**
   * 智能解析文本提取姓名、电话、地址
   * @param {String} text 待解析文本
   */
  const parseSmartText = (text) => {
    if (!text) return

    // 提取手机号
    const phoneReg = /1[3-9]\d{9}/
    const phoneMatch = text.match(phoneReg)
    if (phoneMatch) {
      form.phone = phoneMatch[0]
    }

    // 去除空白和常见分隔符，统一用于地址匹配
    const normalized = text.replace(/[\s,，、;；]+/g, '')

    // 直辖市匹配：处理 "上海上海市浦东新区" / "北京市朝阳区" 等格式
    // 允许直辖市名重复出现（如 "上海 上海市"）
    const municipalityReg =
      /(北京|上海|天津|重庆)(?:市)?(?:(?:北京|上海|天津|重庆)(?:市)?)?([\u4e00-\u9fa5]+?[区县])(.*)/
    // 普通省份匹配：XX省/自治区 + XX市/自治州/地区/盟 + XX区/县/市/旗 + 详细地址
    const provinceReg =
      /([\u4e00-\u9fa5]+?(?:省|自治区))([\u4e00-\u9fa5]+?(?:市|自治州|地区|盟))([\u4e00-\u9fa5]+?(?:区|县|市|旗))(.*)/

    let addressContent = ''
    const municipalityMatch = normalized.match(municipalityReg)
    if (municipalityMatch) {
      form.province = municipalityMatch[1]
      form.city = municipalityMatch[1] + '市'
      form.district = municipalityMatch[2]
      form.detailAddress = municipalityMatch[3]
      addressContent = municipalityMatch[0]
    } else {
      const provinceMatch = normalized.match(provinceReg)
      if (provinceMatch) {
        form.province = provinceMatch[1]
        form.city = provinceMatch[2]
        form.district = provinceMatch[3]
        form.detailAddress = provinceMatch[4]
        addressContent = provinceMatch[0]
      }
    }

    // 提取姓名：去除手机号和地址后，匹配2-4个中文字符
    let nameSource = normalized
    if (phoneMatch) nameSource = nameSource.replace(phoneMatch[0], '')
    if (addressContent) nameSource = nameSource.replace(addressContent, '')
    const nameMatch = nameSource.match(/[\u4e00-\u9fa5]{2,4}/)
    if (nameMatch) {
      form.name = nameMatch[0]
    }
  }

  /** 导入微信地址 */
  const handleImportWxAddress = () => {
    // #ifdef MP-WEIXIN
    uni.chooseAddress({
      success: (res) => {
        form.name = res.userName || ''
        form.phone = res.telNumber || ''
        form.province = res.provinceName || ''
        form.city = res.cityName || ''
        form.district = res.countyName || ''
        form.detailAddress = res.detailInfo || ''
      },
      fail: (err) => {
        console.warn('chooseAddress fail:', err)
      },
    })
    // #endif
  }

  /** 选择通讯录联系人 */
  const handleChooseContact = () => {
    // #ifdef APP-PLUS
    plus.contacts.getContact(
      (contact) => {
        if (contact.displayName) {
          form.name = contact.displayName
        }
        if (contact.phoneNumbers?.length) {
          form.phone = contact.phoneNumbers[0].value.replace(/\s|-/g, '')
        }
      },
      (err) => {
        console.warn('getContact fail:', err)
      },
    )
    // #endif
    // #ifdef MP-WEIXIN
    uni.showToast({ title: '小程序暂不支持', icon: 'none' })
    // #endif
  }

  /** 定位获取当前位置 */
  const handleLocate = () => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        uni.chooseLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          success: (locRes) => {
            if (locRes.address) {
              form.detailAddress = locRes.address + (locRes.name || '')
            }
          },
        })
      },
      fail: () => {
        uni.showToast({ title: '获取定位失败', icon: 'none' })
      },
    })
  }

  /** 清空表单 */
  const handleClear = () => {
    form.name = ''
    form.phone = ''
    form.province = ''
    form.provinceCode = ''
    form.city = ''
    form.cityCode = ''
    form.district = ''
    form.districtCode = ''
    form.detailAddress = ''
    form.doorNumber = ''
    form.isDefault = false
    smartText.value = ''
  }

  /** 表单校验 */
  const validateForm = () => {
    if (!form.name) {
      uni.showToast({ title: '请输入姓名', icon: 'none' })
      return false
    }
    if (!form.phone) {
      uni.showToast({ title: '请输入电话', icon: 'none' })
      return false
    }
    if (!/^1[3-9]\d{9}$/.test(form.phone)) {
      uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return false
    }
    if (!form.province || !form.city || !form.district) {
      uni.showToast({ title: '请选择省市区', icon: 'none' })
      return false
    }
    if (!form.detailAddress) {
      uni.showToast({ title: '请输入详细地址', icon: 'none' })
      return false
    }
    return true
  }

  /** 提交表单 */
  const handleSubmit = () => {
    if (!validateForm()) return

    const params = {
      name: form.name,
      phone: form.phone,
      province: form.province,
      provinceCode: form.provinceCode,
      city: form.city,
      cityCode: form.cityCode,
      district: form.district,
      districtCode: form.districtCode,
      detailAddress: form.detailAddress,
      doorNumber: form.doorNumber,
      isDefault: form.isDefault,
    }

    if (isEdit.value) {
      params.id = addressId.value
    }

    // TODO: 调用接口保存地址，接口接入后替换
    uni.showToast({ title: isEdit.value ? '修改成功' : '新增成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }

  /** 页面加载 —— 接收地址 id */
  onLoad((options) => {
    if (options?.id) {
      addressId.value = options.id
      // TODO: 根据 id 请求地址详情，回填表单
    }
  })
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
