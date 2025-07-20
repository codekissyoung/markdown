import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入axios
import axios from './utils/request'

Vue.use(ElementUI)

// 将axios挂载到Vue原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')