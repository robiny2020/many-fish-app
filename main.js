import App from './App'
import store from './store'
import mfNativeModal from '@/uni_modules/mf-native-modal'

import '@/style/index.scss'

import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.use(mfNativeModal)
	return {
		app,
	}
}