/**
 * mf-native-modal 类型统一入口
 */

export type { ModalOptions, ModalResult } from './modal'
export type { UseModalReturn } from './composable'

// Vue 全局属性增强（side-effect import，确保类型生效）
import './vue.d'
