/**
 * mf-native-modal
 * iOS 风格原生弹窗 uni-app 插件
 *
 * @example
 * // main.js
 * import mfNativeModal from '@/uni_modules/mf-native-modal'
 * app.use(mfNativeModal)
 *
 * // 组件内
 * import { useModal } from '@/uni_modules/mf-native-modal/composables/useModal'
 * const { showModal } = useModal()
 * await showModal({ title: '提示', content: '确认删除？' })
 */



// #ifdef APP-PLUS
import showModal from './js_sdk/modal.js'
// #endif

export { useModal } from './composables/useModal'

export default {
	install(app) { 
		// #ifdef APP-PLUS
		app.config.globalProperties.$modal = showModal
		// #endif
	},
}