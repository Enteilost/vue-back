// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 导入elememt
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入图标
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

// 使用element
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})