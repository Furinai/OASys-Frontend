import {createApp} from 'vue'
import App from '/@/App.vue'
import router from '/@/router'
import store from '/@/store'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/lib/theme-chalk/index.css'
import '/@/assets/css/customize.css'
import 'dayjs/locale/zh-cn.js'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus, {locale})
app.mount('#app')