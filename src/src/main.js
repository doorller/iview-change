import Vue from 'vue'
import App from './App.vue'
import { store } from './assets/js/vuex'
import router from './assets/js/router'
import plugins from './plugins'
import tools from './assets/js/config/tools'
import api from './assets/js/config/api'
import Socket from './assets/js/config/socket'

import './assets/css/common.css'
import './assets/css/iconfont.css'

Vue.config.productionTip = false
window.tools = tools
window.api = api
window.Socket = Socket
Vue.use(plugins)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')