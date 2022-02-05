import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import './assets/css/customize.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus, {locale})
app.mount('#app')