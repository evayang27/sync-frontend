import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import store from './store'
import FirebaseAuth from '@/utils/firebase.js'
import router from './router'
// vite-plugin-svg-icons setup
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import '@/assets/scss/main.scss'

Vue.component('SyncIcon', SvgIcon)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.config.productionTip = false
Vue.prototype.$firebaseAuth = FirebaseAuth

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  beforeCreate() {
    this.$firebaseAuth.setupFirebase()
  },
  template: '<App/>',
  render: h => h(App)
}).$mount('#app')
