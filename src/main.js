// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueFire from 'vuefire'

import Frontpage from './components/Frontpage'
import Player from './components/Player'

import VueRouter from 'vue-router'

Vue.use(VueRouter)
Vue.use(VueFire)

const router = new VueRouter({
  // mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Frontpage },
    { path: '/player/:channel', component: Player }
  ]
})

new Vue(Vue.util.extend({ router }, App)).$mount('#app')