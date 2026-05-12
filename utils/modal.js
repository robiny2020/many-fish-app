/**
 * iOS 风格原生弹窗
 * 基于 plus.nativeObj.View 实现，仅支持 App 端（iOS / Android）
 *
 * @module utils/modal
 * @example
 * // 1. 全局挂载（main.js 已配置）
 * // app.config.globalProperties.$modal = showModal
 *
 * // 2. 组件内使用（<script setup>，推荐通过 composable）
 * import { useModal } from '@/composables/useModal'
 * const { showModal } = useModal()
 * const { confirm } = await showModal({ title: '提示', content: '确认删除？' })
 *
 * // 3. 纯提示（无取消按钮）
 * await showModal({ title: '成功', content: '操作已完成', showCancel: false })
 *
 * // 4. 危险操作（红色确认按钮）
 * await showModal({
 *   title: '警告',
 *   content: '此操作不可撤销',
 *   confirmText: '删除',
 *   confirmColor: '#FF3B30',
 * })
 */

/* ==================== iOS 设计规范常量 ==================== */

const IOS_COLORS = {
  mask: 'rgba(0,0,0,0.25)',
  background: '#FFFFFF',
  title: '#000000',
  content: '#000000',
  separator: '#C8C8CA',
  buttonText: '#007AFF',
}

const LAYOUT = {
  widthRatio: 0.72, // 弹窗宽度占屏幕比例（≈ 270pt / 375pt）
  radius: '14px',
  titleSize: '17px',
  contentSize: '13px',
  buttonSize: '17px',
  buttonHeight: 44,
  paddingH: 16,
  paddingTop: 20,
  separatorWidth: 0.5,
  titleLineHeight: 22,
  contentLineHeight: 18,
  gapTitleContent: 4,
  gapContentBottom: 20,
}

/* ==================== 模块内部状态 ==================== */

let maskLayer = null
let popupView = null
let backButtonHandler = null
let isShowing = false
let maskVisible = false
let maskHideTimer = null

// 缓存屏幕尺寸（不会变化，避免每次读取原生属性）
let screenW = 0
let screenH = 0

// 预编译正则，避免循环内反复创建
const CJK_RE = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/
const LATIN_RE = /[a-zA-Z0-9]/

// 当前弹窗上下文（供持久化点击处理器引用，避免每次 addEventListener 累加）
let _resolve = null
let _buttonY = 0
let _popupH = 0
let _popupW = 0
let _showCancel = true

/* ==================== 动画工具 ==================== */

const ANIM = { showMs: 300, hideMs: 50, frameMs: 16 }
let animTimers = []

/**
 * 清除所有进行中的动画
 */
function clearAnimations() {
  animTimers.forEach((t) => clearInterval(t))
  animTimers = []
}

/**
 * 透明度渐变动画
 * @param {Object} view plus.nativeObj.View 实例
 * @param {number} from 起始透明度
 * @param {number} to 目标透明度
 * @param {number} duration 动画时长（ms）
 * @param {Function} [done] 完成回调
 */
function fadeView(view, from, to, duration, done) {
  const total = Math.max(Math.round(duration / ANIM.frameMs), 1)
  let frame = 0
  view.setStyle({ opacity: from })
  const timer = setInterval(() => {
    frame++
    const t = frame / total
    const ease = from < to ? 1 - Math.pow(1 - t, 3) : t * t
    view.setStyle({ opacity: from + (to - from) * ease })
    if (frame >= total) {
      clearInterval(timer)
      animTimers = animTimers.filter((id) => id !== timer)
      view.setStyle({ opacity: to })
      done?.()
    }
  }, ANIM.frameMs)
  animTimers.push(timer)
}

/**
 * 初始化弹窗点击事件（仅调用一次）
 * 通过模块变量引用当前上下文，避免每次 showModal 累加 listener
 */
function initClickHandler() {
  popupView.addEventListener('click', (e) => {
    if (!isShowing || !_resolve) return
    if (e.clientY < _buttonY || e.clientY > _popupH) return

    const result = { confirm: false, cancel: false }
    if (_showCancel) {
      const halfW = Math.floor(_popupW / 2)
      if (e.clientX < halfW) result.cancel = true
      else result.confirm = true
    } else {
      result.confirm = true
    }

    const done = _resolve
    _resolve = null
    isShowing = false
    clearAnimations()

    // 仅淡出弹窗，遮罩延迟隐藏（连续调用时避免闪烁）
    fadeView(popupView, 1, 0, ANIM.hideMs, () => {
      popupView.hide()
      popupView.setStyle({ opacity: 1 })
      setBackEnabled(true)
      done(result)
      // 延迟隐藏遮罩，若下一个 showModal 立即调用则取消
      maskHideTimer = setTimeout(() => {
        maskHideTimer = null
        fadeView(maskLayer, 1, 0, ANIM.hideMs, () => {
          maskLayer.hide()
          maskLayer.setStyle({ opacity: 1 })
          maskVisible = false
        })
      }, 50)
    })
  })
}

/* ==================== 文字换行计算 ==================== */

/**
 * 按像素宽度将文本拆分为多行
 * @param {string} text 原始文本
 * @param {number} maxWidth 行最大像素宽度
 * @param {number} [cjkW=13] CJK 字符宽度估值
 * @param {number} [latinW=7] 拉丁字符宽度估值
 * @returns {Array<{type: 'text'|'break', content: string}>}
 */
function wrapText(text, maxWidth, cjkW = 13, latinW = 7) {
  if (!text) return []

  const chars = text.split('')
  const lines = []
  let start = 0
  let width = 0
  let latinBuf = 0

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]

    // 换行符
    if (ch === '\n' || (ch === '\\' && chars[i + 1] === 'n')) {
      lines.push({ type: 'break', content: text.substring(start, i) })
      const skip = ch === '\n' ? 1 : 2
      start = i + skip
      if (skip === 2) i++
      width = 0
      latinBuf = 0
      continue
    }

    // CJK 字符
    if (CJK_RE.test(ch)) {
      const total = width + latinBuf * latinW + cjkW
      if (total > maxWidth && i > start) {
        lines.push({ type: 'text', content: text.substring(start, i) })
        start = i
        width = cjkW
      } else {
        width += latinBuf * latinW + cjkW
      }
      latinBuf = 0
    }
    // 拉丁字符 / 数字
    else if (LATIN_RE.test(ch)) {
      latinBuf++
      if (width + latinBuf * latinW > maxWidth && i > start) {
        const wordStart = i + 1 - latinBuf
        lines.push({ type: 'text', content: text.substring(start, wordStart) })
        start = wordStart
        width = latinBuf * latinW
        latinBuf = 0
      }
    }
    // 其他字符（标点等）
    else {
      const total = width + latinBuf * latinW + latinW
      if (total > maxWidth && i > start) {
        lines.push({ type: 'text', content: text.substring(start, i) })
        start = i
        width = latinW
      } else {
        width += latinBuf * latinW + latinW
      }
      latinBuf = 0
    }
  }

  if (start < chars.length) {
    lines.push({ type: 'text', content: text.substring(start) })
  }

  return lines
}

/* ==================== 返回键控制 ==================== */

/**
 * 控制物理返回键和 iOS 侧滑返回
 * @param {boolean} enabled 是否允许返回操作
 */
function setBackEnabled(enabled) {
  try {
    if (!enabled) {
      backButtonHandler = () => {}
      plus.key.addEventListener('backbutton', backButtonHandler)
      if (plus.os.name === 'iOS') {
        const pages = getCurrentPages()
        const page = pages[pages.length - 1]
        const webview = page?.$getAppWebview?.() || page?.$vm?.$mp?.page?.$getAppWebview?.()
        webview?.setStyle({ popGesture: 'none' })
      }
    } else {
      if (backButtonHandler) {
        plus.key.removeEventListener('backbutton', backButtonHandler)
        backButtonHandler = null
      }
      if (plus.os.name === 'iOS') {
        const pages = getCurrentPages()
        const page = pages[pages.length - 1]
        const webview = page?.$getAppWebview?.() || page?.$vm?.$mp?.page?.$getAppWebview?.()
        webview?.setStyle({ popGesture: 'close' })
      }
    }
  } catch (e) {
    console.warn('[modal] setBackEnabled error:', e)
  }
}

/* ==================== 公开 API ==================== */

/**
 * 关闭当前弹窗
 */
export function hideModal() {
  if (maskHideTimer) {
    clearTimeout(maskHideTimer)
    maskHideTimer = null
  }
  _resolve = null
  clearAnimations()
  if (maskLayer) {
    maskLayer.hide()
    maskLayer.setStyle({ opacity: 1 })
    maskVisible = false
  }
  if (popupView) {
    popupView.hide()
    popupView.setStyle({ opacity: 1 })
  }
  if (isShowing) {
    isShowing = false
    setBackEnabled(true)
  }
}

/**
 * 显示 iOS 风格原生弹窗
 * @param {Object} options
 * @param {string} [options.title=''] 标题
 * @param {string} [options.content=''] 内容
 * @param {boolean} [options.showCancel=true] 是否显示取消按钮
 * @param {string} [options.cancelText='取消'] 取消按钮文字
 * @param {string} [options.confirmText='确定'] 确认按钮文字
 * @param {string} [options.cancelColor='#007AFF'] 取消按钮颜色
 * @param {string} [options.confirmColor='#007AFF'] 确认按钮颜色
 * @returns {Promise<{confirm: boolean, cancel: boolean}>}
 */
export function showModal(options = {}) {
  if (isShowing) hideModal()
  if (maskHideTimer) {
    clearTimeout(maskHideTimer)
    maskHideTimer = null
  }

  const config = {
    title: options.title ?? '',
    content: options.content ?? '',
    showCancel: options.showCancel !== false,
    cancelText: options.cancelText || '取消',
    confirmText: options.confirmText || '确定',
    cancelColor: options.cancelColor || IOS_COLORS.buttonText,
    confirmColor: options.confirmColor || IOS_COLORS.buttonText,
  }

  return new Promise((resolve) => {
    // 缓存屏幕尺寸
    if (!screenW) {
      screenW = plus.screen.resolutionWidth
      screenH = plus.screen.resolutionHeight
    }
    const popupW = Math.round(screenW * LAYOUT.widthRatio)
    const contentW = popupW - LAYOUT.paddingH * 2

    /* ---- 计算布局高度 ---- */

    let y = LAYOUT.paddingTop

    // 标题
    let titleH = 0
    if (config.title) {
      const lineCount = Math.max(1, Math.ceil(config.title.length / Math.floor(contentW / 17)))
      titleH = lineCount * LAYOUT.titleLineHeight
      y += titleH
    }

    // 标题-内容间距
    if (config.title && config.content) {
      y += LAYOUT.gapTitleContent
    }

    // 内容
    const contentStartY = y
    const lines = wrapText(config.content, contentW)
    let contentH = 0
    lines.forEach((line) => {
      contentH += LAYOUT.contentLineHeight
      if (line.type === 'break') contentH += 4
    })
    y += contentH

    // 底部间距 + 按钮
    y += LAYOUT.gapContentBottom
    const buttonAreaY = y
    y += LAYOUT.separatorWidth + LAYOUT.buttonHeight
    const popupH = y

    /* ---- 构建绘制元素 ---- */

    const draws = []

    // 标题
    if (config.title) {
      draws.push({
        tag: 'font',
        id: 'title',
        text: config.title,
        textStyles: {
          size: LAYOUT.titleSize,
          color: IOS_COLORS.title,
          weight: 'bold',
          whiteSpace: 'normal',
          align: 'center',
        },
        position: {
          top: LAYOUT.paddingTop + 'px',
          left: LAYOUT.paddingH + 'px',
          width: contentW + 'px',
          height: titleH + 'px',
        },
      })
    }

    // 内容各行
    let lineY = contentStartY
    lines.forEach((line, i) => {
      draws.push({
        tag: 'font',
        id: 'content_' + i,
        text: line.content,
        textStyles: {
          size: LAYOUT.contentSize,
          color: IOS_COLORS.content,
          align: 'center',
          lineSpacing: '40%',
        },
        position: {
          top: lineY + 'px',
          left: LAYOUT.paddingH + 'px',
          width: contentW + 'px',
          height: LAYOUT.contentLineHeight + 'px',
        },
      })
      lineY += LAYOUT.contentLineHeight
      if (line.type === 'break') lineY += 4
    })

    // 横向分割线
    draws.push({
      tag: 'rect',
      id: 'sep_h',
      rectStyles: { color: IOS_COLORS.separator },
      position: {
        top: buttonAreaY + 'px',
        left: '0px',
        width: popupW + 'px',
        height: LAYOUT.separatorWidth + 'px',
      },
    })

    // 按钮
    const buttonY = buttonAreaY + LAYOUT.separatorWidth

    if (config.showCancel) {
      const halfW = Math.floor(popupW / 2)

      // 取消按钮（常规字重）
      draws.push({
        tag: 'font',
        id: 'cancelText',
        text: config.cancelText,
        textStyles: {
          size: LAYOUT.buttonSize,
          color: config.cancelColor,
          align: 'center',
        },
        position: {
          top: buttonY + 'px',
          left: '0px',
          width: halfW + 'px',
          height: LAYOUT.buttonHeight + 'px',
        },
      })

      // 竖向分割线
      draws.push({
        tag: 'rect',
        id: 'sep_v',
        rectStyles: { color: IOS_COLORS.separator },
        position: {
          top: buttonY + 'px',
          left: halfW + 'px',
          width: LAYOUT.separatorWidth + 'px',
          height: LAYOUT.buttonHeight + 'px',
        },
      })

      // 确认按钮（加粗）
      draws.push({
        tag: 'font',
        id: 'confirmText',
        text: config.confirmText,
        textStyles: {
          size: LAYOUT.buttonSize,
          color: config.confirmColor,
          weight: 'bold',
          align: 'center',
        },
        position: {
          top: buttonY + 'px',
          left: halfW + 'px',
          width: halfW + 'px',
          height: LAYOUT.buttonHeight + 'px',
        },
      })
    } else {
      // 单按钮
      draws.push({
        tag: 'font',
        id: 'confirmText',
        text: config.confirmText,
        textStyles: {
          size: LAYOUT.buttonSize,
          color: config.confirmColor,
          weight: 'bold',
          align: 'center',
        },
        position: {
          top: buttonY + 'px',
          left: '0px',
          width: popupW + 'px',
          height: LAYOUT.buttonHeight + 'px',
        },
      })
    }

    /* ---- 创建/复用视图 ---- */

    const popupLeft = Math.round((screenW - popupW) / 2)
    const popupTop = Math.round((screenH - popupH) / 2)
    const popupStyle = {
      top: popupTop + 'px',
      left: popupLeft + 'px',
      width: popupW + 'px',
      height: popupH + 'px',
    }

    // 遮罩层：首次创建，后续复用
    if (!maskLayer) {
      maskLayer = new plus.nativeObj.View('maskLayer', {
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        backgroundColor: IOS_COLORS.mask,
      })
    }

    // 弹窗主体：首次创建，后续 reset + setStyle 复用
    if (!popupView) {
      popupView = new plus.nativeObj.View('popupView', popupStyle)
      initClickHandler()
    } else {
      popupView.reset()
      popupView.setStyle(popupStyle)
    }

    // 白色圆角背景
    popupView.drawRect(
      { color: IOS_COLORS.background, radius: LAYOUT.radius },
      { top: '0px', left: '0px', width: '100%', height: '100%' },
    )

    popupView.draw(draws)

    /* ---- 更新上下文 & 显示 ---- */

    _resolve = resolve
    _buttonY = buttonY
    _popupH = popupH
    _popupW = popupW
    _showCancel = config.showCancel

    isShowing = true

    // 遮罩：已可见则保持，否则淡入
    if (maskVisible) {
      maskLayer.setStyle({ opacity: 1 })
      maskLayer.show()
    } else {
      maskLayer.setStyle({ opacity: 0 })
      maskLayer.show()
      fadeView(maskLayer, 0, 1, ANIM.showMs)
      maskVisible = true
    }

    // 弹窗始终淡入
    popupView.setStyle({ opacity: 0 })
    popupView.show()
    fadeView(popupView, 0, 1, ANIM.showMs)
    setBackEnabled(false)
  })
}

export default showModal
