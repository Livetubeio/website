// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueFire from 'vuefire'

import Frontpage from './components/Frontpage'
import About from './components/About'
import Profile from './components/Profile'
import Feedback from './components/Feedback'
import Player from './components/Player'

import VueRouter from 'vue-router'

Vue.use(VueRouter)
Vue.use(VueFire)

let mode = 'hash'
if (window.location.host === 'livetube.io') {
  mode = 'history'
}

const router = new VueRouter({
  mode: mode,
  base: __dirname,
  routes: [{
    path: '/',
    component: Frontpage
  }, {
    path: '/player/:channel',
    component: Player
  }, {
    path: '/player/:owner/:channel',
    component: Player
  }, {
    path: '/feedback',
    component: Feedback
  }, {
    path: '/about',
    component: About
  }, {
    path: '/profile',
    component: Profile
  }]
})

import User from './helpers/User'
var loggedin = false
router.beforeEach(function (from, to, next) {
  if (loggedin) {
    next()
  } else {
    loggedin = true
    User.init().then(() => {
      next()
    })
  }
})

new Vue(Vue.util.extend({
  router
}, App)).$mount('#app')
