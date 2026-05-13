/**
 * 弹窗相关类型定义
 */

/** 弹窗配置选项 */
export interface ModalOptions {
  /** 标题 */
  title?: string
  /** 内容 */
  content?: string
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 取消按钮文字 */
  cancelText?: string
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮颜色 */
  cancelColor?: string
  /** 确认按钮颜色 */
  confirmColor?: string
}

/** 弹窗返回结果 */
export interface ModalResult {
  /** 是否点击了确认 */
  confirm: boolean
  /** 是否点击了取消 */
  cancel: boolean
}
