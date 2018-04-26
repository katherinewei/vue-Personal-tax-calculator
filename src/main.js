import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router/index'
import App from './App'
import {ToastPlugin} from 'vux'

Vue.use(ToastPlugin)
FastClick.attach(document.body)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
