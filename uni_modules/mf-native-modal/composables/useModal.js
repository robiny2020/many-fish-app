/**
 * 原生弹窗 composable
 * App 端使用 plus.nativeObj.View 原生弹窗，其他端降级为 uni.showModal
 *
 * @example
 * import { useModal } from '@/uni_modules/mf-native-modal/composables/useModal'
 * const { showModal } = useModal()
 * const { confirm } = await showModal({ title: '提示', content: '确认删除？' })
 */
export function useModal() {
  // #ifdef APP-PLUS
  const { proxy } = getCurrentInstance()
  return {
    showModal: (options) => proxy.$modal(options),
  }
  // #endif

  // #ifndef APP-PLUS
  return {
    showModal: (options) => {
      return new Promise((resolve) => {
        uni.showModal({
          title: options.title || '',
          content: options.content || '',
          showCancel: options.showCancel !== false,
          cancelText: options.cancelText || '取消',
          confirmText: options.confirmText || '确定',
          cancelColor: options.cancelColor || '#000000',
          confirmColor: options.confirmColor || '#007AFF',
          success: (res) => {
            resolve({ confirm: res.confirm, cancel: res.cancel })
          },
        })
      })
    },
  }
  // #endif
}
