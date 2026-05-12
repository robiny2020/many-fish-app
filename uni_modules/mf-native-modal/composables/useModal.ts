/**
 * 原生弹窗 composable
 * App 端使用 plus.nativeObj.View 原生弹窗，其他端降级为 uni.showModal
 *
 * @example
 * import { useModal } from '@/uni_modules/mf-native-modal/composables/useModal'
 * const { showModal } = useModal()
 * const { confirm } = await showModal({ title: '提示', content: '确认删除？' })
 */

import { getCurrentInstance } from 'vue'
import type { ModalOptions, ModalResult } from '../js_sdk/modal'

export type { ModalOptions, ModalResult }

export interface UseModalReturn {
  showModal: (options: ModalOptions) => Promise<ModalResult>
}

export function useModal(): UseModalReturn {
  // #ifdef APP-PLUS
  const { proxy } = getCurrentInstance()!
  return {
    showModal: (options: ModalOptions) => proxy!.$modal(options),
  }
  // #endif

  // #ifndef APP-PLUS
  return {
    showModal: (options: ModalOptions): Promise<ModalResult> => {
      return new Promise<ModalResult>((resolve) => {
        uni.showModal({
          title: options.title || '',
          content: options.content || '',
          showCancel: options.showCancel !== false,
          cancelText: options.cancelText || '取消',
          confirmText: options.confirmText || '确定',
          cancelColor: options.cancelColor || '#000000',
          confirmColor: options.confirmColor || '#007AFF',
          success: (res: any) => {
            resolve({ confirm: res.confirm, cancel: res.cancel })
          },
        })
      })
    },
  }
  // #endif
}
