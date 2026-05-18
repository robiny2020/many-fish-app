<template>
  <MfPopup
    :modelValue="modelValue"
    position="bottom"
    borderRadius="24rpx 24rpx 0 0"
    :safeBottom="false"
    closeable
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <view class="time-picker">
      <!-- 头部 -->
      <view class="time-picker__header">
        <text class="time-picker__title">预计上门时间</text>
      </view>

      <!-- 内容区：左侧日期 + 右侧时间段 -->
      <view class="time-picker__body flex">
        <!-- 日期列表 -->
        <scroll-view
          class="time-picker__date-list flex-shrink-0"
          scroll-y
        >
          <view
            v-for="(item, index) in dateList"
            :key="item.value"
            :class="[
              'time-picker__date-item',
              { 'time-picker__date-item--active': activeDate === item.value },
            ]"
            @click="handleDateSelect(item.value)"
          >
            <text
              :class="[
                'time-picker__date-text',
                { 'time-picker__date-text--active': activeDate === item.value },
              ]"
            >
              {{ item.label }}
            </text>
            <!-- 选中态外圆角 -->
            <view
              v-if="activeDate === item.value && index > 0"
              class="time-picker__corner time-picker__corner--top"
            />
            <view
              v-if="activeDate === item.value && index < dateList.length - 1"
              class="time-picker__corner time-picker__corner--bottom"
            />
          </view>
        </scroll-view>

        <!-- 时间段列表 -->
        <scroll-view
          class="time-picker__slot-list flex-1"
          scroll-y
        >
          <view
            v-for="slot in currentSlots"
            :key="slot.id"
            :class="[
              'time-picker__slot-item',
              {
                'time-picker__slot-item--active': activeSlotId === slot.id && !slot.disabled,
                'time-picker__slot-item--disabled': slot.disabled,
              },
            ]"
            @click="handleSlotSelect(slot)"
          >
            <text
              :class="[
                'time-picker__slot-text',
                {
                  'time-picker__slot-text--active': activeSlotId === slot.id && !slot.disabled,
                  'time-picker__slot-text--disabled': slot.disabled,
                },
              ]"
            >
              {{ slot.label }}
            </text>
          </view>
        </scroll-view>
      </view>

      <!-- 底部确认按钮 -->
      <view class="time-picker__footer">
        <view
          class="time-picker__confirm"
          @click="handleConfirm"
        >
          <text class="time-picker__confirm-text">确定</text>
        </view>
      </view>
    </view>
  </MfPopup>
</template>

<script setup name="TimePickerPopup">
  import { MfPopup } from '@/components'
  import { uniToast } from '@/utils/uni-api'

  /**
   * TimePickerPopup 预约上门时间选择弹窗
   *
   * 规则说明：
   * 1. "当前两小时"仅在当天 9:00-17:00 可选
   * 2. 当天已过的时间段提前 5 分钟置灰不可选
   * 3. 非今天的日期不显示"当前两小时"
   * 4. 日期范围：从今天开始共 7 天
   * 5. 当天超过 16:55 (17:00 提前 5 分钟) 后日期默认选中明天
   * 6. 切换日期后刷新可选时间段
   * 7. 传入 defaultDate + defaultSlotId 可自动匹配上次选中
   *
   * @property {Boolean} modelValue    - v-model 控制显示/隐藏
   * @property {String}  defaultDate   - 默认选中日期 (YYYY-MM-DD)
   * @property {Number}  defaultSlotId - 默认选中时间段 ID（-1 表示无）
   *
   * @event {Function} confirm - 确认选择，返回 { date, dateLabel, slotId, slotLabel }
   */

  const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  /** 置灰提前量（分钟） */
  const BUFFER = 5

  /** 全部时间段定义 */
  const ALL_SLOTS = [
    { id: 0, label: '当前两小时', todayOnly: true },
    { id: 1, label: '09:00-11:00', startHour: 9 },
    { id: 2, label: '11:00-13:00', startHour: 11 },
    { id: 3, label: '13:00-15:00', startHour: 13 },
    { id: 4, label: '15:00-17:00', startHour: 15 },
    { id: 5, label: '17:00-19:00', startHour: 17 },
  ]

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    defaultDate: {
      type: String,
      default: '',
    },
    defaultSlotId: {
      type: Number,
      default: -1,
    },
  })

  const emit = defineEmits(['update:modelValue', 'confirm'])

  /** 日期列表 */
  const dateList = ref([])
  /** 当前选中日期 */
  const activeDate = ref('')
  /** 当前可选时间段 */
  const currentSlots = ref([])
  /** 当前选中时间段 ID */
  const activeSlotId = ref(null)

  /**
   * 获取当前时间的分钟数（0-1440）
   * @returns {Number}
   */
  const getNowMinutes = () => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  }

  /**
   * 生成未来 7 天日期列表（含今天）
   * @returns {Array<{value: String, label: String, isToday: Boolean}>}
   */
  const generateDates = () => {
    const list = []
    const now = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      let suffix
      if (i === 0) suffix = '今日'
      else if (i === 1) suffix = '明日'
      else suffix = WEEK_DAYS[d.getDay()]
      list.push({
        value: `${d.getFullYear()}-${mm}-${dd}`,
        label: `${mm}-${dd} (${suffix})`,
        isToday: i === 0,
      })
    }
    return list
  }

  /**
   * 根据日期计算可选时间段及禁用状态
   * @param {String} dateValue - YYYY-MM-DD
   * @returns {Array}
   */
  const buildSlots = (dateValue) => {
    const isToday = dateValue === dateList.value[0]?.value
    const nowMin = getNowMinutes()
    return ALL_SLOTS.filter((s) => !s.todayOnly || isToday).map((s) => {
      let disabled = false
      if (isToday) {
        if (s.todayOnly) {
          // 当前两小时：9:00 前或 16:55 后不可选
          disabled = nowMin < 540 || nowMin + BUFFER >= 1020
        } else {
          // 常规时段：当前时间 + 提前量 >= 开始时间 → 置灰
          disabled = nowMin + BUFFER >= s.startHour * 60
        }
      }
      return { ...s, disabled }
    })
  }

  /**
   * 刷新当前日期对应的时间段
   */
  const refreshSlots = () => {
    currentSlots.value = buildSlots(activeDate.value)
  }

  /**
   * 弹窗打开时初始化状态
   */
  const initState = () => {
    dateList.value = generateDates()
    const nowMin = getNowMinutes()

    // 确定默认选中日期
    if (props.defaultDate) {
      const found = dateList.value.find((d) => d.value === props.defaultDate)
      activeDate.value = found ? found.value : dateList.value[0].value
    } else {
      // 超过 16:55 默认选中明天
      activeDate.value =
        nowMin + BUFFER >= 1020 && dateList.value.length > 1
          ? dateList.value[1].value
          : dateList.value[0].value
    }

    refreshSlots()

    // 匹配默认时间段
    if (props.defaultSlotId >= 0) {
      const found = currentSlots.value.find((s) => s.id === props.defaultSlotId)
      activeSlotId.value = found ? found.id : null
    } else {
      // 默认选中第一个可选的常规时间段（排除"当前两小时"）
      const firstAvailable = currentSlots.value.find((s) => !s.disabled && !s.todayOnly)
      activeSlotId.value = firstAvailable ? firstAvailable.id : null
    }
  }

  /**
   * 选择日期
   * @param {String} dateValue - YYYY-MM-DD
   */
  const handleDateSelect = (dateValue) => {
    activeDate.value = dateValue
    refreshSlots()
    // 切换日期后，若之前选中的时段不存在或已禁用则重置
    const prev = currentSlots.value.find((s) => s.id === activeSlotId.value)
    if (!prev || prev.disabled) {
      activeSlotId.value = null
    }
  }

  /**
   * 选择时间段
   * @param {Object} slot - 时间段对象
   */
  const handleSlotSelect = (slot) => {
    if (slot.disabled) return
    activeSlotId.value = slot.id
  }

  /** 确认选择 */
  const handleConfirm = () => {
    if (activeSlotId.value == null) {
      uniToast('请选择上门时间段')
      return
    }
    const dateItem = dateList.value.find((d) => d.value === activeDate.value)
    const slotItem = currentSlots.value.find((s) => s.id === activeSlotId.value)
    emit('confirm', {
      date: activeDate.value,
      dateLabel: dateItem?.label || '',
      slotId: slotItem.id,
      slotLabel: slotItem.label,
    })
    emit('update:modelValue', false)
  }

  // 弹窗打开时初始化
  watch(
    () => props.modelValue,
    (val) => {
      if (val) initState()
    },
  )
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
