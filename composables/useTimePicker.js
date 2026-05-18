/**
 * useTimePicker - 时间选择弹窗 composable
 *
 * 封装 TimePickerPopup 的状态管理与交互逻辑，
 * 返回响应式状态和方法，供页面直接绑定到模板。
 *
 * @param {Object} [initialTimeInfo] - 初始时间信息（用于编辑回显）
 * @returns {Object} { showTimePicker, timeInfo, openTimePicker, handleTimeConfirm, resetTimeInfo }
 *
 * @example
 * const { showTimePicker, timeInfo, openTimePicker, handleTimeConfirm } = useTimePicker()
 *
 * // 模板绑定
 * <RecycleOrderForm :timeInfo="timeInfo" @time-click="openTimePicker" />
 * <TimePickerPopup v-model="showTimePicker" :defaultDate="timeInfo.date" :defaultSlotId="timeInfo.slotId" @confirm="handleTimeConfirm" />
 */
export function useTimePicker(initialTimeInfo) {
  const defaultState = {
    date: '',
    dateLabel: '',
    slotId: -1,
    slotLabel: '',
  }

  /** 弹窗显示状态 */
  const showTimePicker = ref(false)

  /** 已选时间信息 */
  const timeInfo = ref({ ...defaultState, ...initialTimeInfo })

  /** 打开时间选择弹窗 */
  const openTimePicker = () => {
    showTimePicker.value = true
  }

  /**
   * 时间选择确认回调
   * @param {Object} data - { date, dateLabel, slotId, slotLabel }
   */
  const handleTimeConfirm = (data) => {
    timeInfo.value = { ...data }
  }

  /** 重置时间信息 */
  const resetTimeInfo = () => {
    timeInfo.value = { ...defaultState }
  }

  return {
    showTimePicker,
    timeInfo,
    openTimePicker,
    handleTimeConfirm,
    resetTimeInfo,
  }
}
