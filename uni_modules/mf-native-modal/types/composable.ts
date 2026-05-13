/**
 * Composable 相关类型定义
 */

import type { ModalOptions, ModalResult } from './modal'

/** useModal 返回值 */
export interface UseModalReturn {
  showModal: (options: ModalOptions) => Promise<ModalResult>
}
