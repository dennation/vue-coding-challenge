// import Vue.js
import Vue from 'vue'

// import bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import root component 
import App from './App.vue'

// import store
import store from './store'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

// Create Vue instance with store
new Vue({
    store,
    render: h => h(App),
}).$mount('#app')