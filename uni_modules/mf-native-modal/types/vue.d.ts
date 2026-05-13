/**
 * Vue 全局属性类型增强
 */

import type { ModalOptions, ModalResult } from './modal'

declare module 'vue' {
  interface ComponentCustomProperties {
    $modal: (options: ModalOptions) => Promise<ModalResult>
  }
}
