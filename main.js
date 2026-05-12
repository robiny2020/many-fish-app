import App from './App'
import store from './store'
// #ifdef APP-PLUS
import showModal from './utils/modal'
// #endif

import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  // #ifdef APP-PLUS
  app.config.globalProperties.$modal = showModal
  // #endif
  return {
    app,
  }
}
