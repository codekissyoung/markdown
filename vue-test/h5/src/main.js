import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入Vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入axios
import axios from './utils/request'

Vue.use(Vant)

// 将axios挂载到Vue原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')