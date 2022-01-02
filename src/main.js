import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './api/index'
import store from './store'
Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue();

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
