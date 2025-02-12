import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import "@/assets/css/reset.css"
import axios from 'axios';
Vue.config.productionTip = false

Vue.prototype.$axios = axios;  // 将 Axios 挂载到 Vue 实例

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
