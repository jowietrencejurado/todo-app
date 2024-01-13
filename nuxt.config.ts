import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import { fileURLToPath } from "url";

export default defineNuxtConfig({
	css: ['vuetify/lib/styles/main.sass', '@/assets/style.css'],
	app: {
		head: {
			"title": "To Do App",
		}
	},
	alias: {
		"@": fileURLToPath(new URL("./", import.meta.url))
	},
	modules: [
		'@vee-validate/nuxt',
		'nuxt3-vuex-module',
		(_options, nuxt) => {
			nuxt.hooks.hook('vite:extendConfig', (config) => {
				// @ts-expect-error
				config.plugins.push(vuetify({ autoImport: true }))
			})
		},
	],
	build: {
		transpile: ['vuetify'],
	},
	vite: {
		vue: {
			template: {
				transformAssetUrls,
			},
		},
	},
})
