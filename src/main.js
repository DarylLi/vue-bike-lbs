import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './vuex';
import axios from 'axios'
import errorMessage from './components/requestError'

Vue.prototype.$ajax = axios
Vue.use(VueRouter)
    // Vue.component('footGuide', footGuide)
Vue.component('errorMessage', errorMessage)
const router = new VueRouter({
    // routes
    // mode: 'history',
    routes: routes
})

new Vue({
    router,
    store
}).$mount('#app')