import {
	defineConfig
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
// ---- 导入插件 ----
import AutoImport from 'unplugin-auto-import/vite'


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [

		uni(),
		// ---- 配置自动引入 ----
		AutoImport({
			imports: ['vue', 'uni-app', 'pinia'],
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	build: {
		// minify: 'terser',
		// terserOptions: {
		//   compress: {
		//     drop_console: true,
		//   },
		// },
	},
})