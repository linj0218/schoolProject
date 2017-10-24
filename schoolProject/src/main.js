// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import axios from 'axios'

import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

axios.defaults.timeout = 5000
axios.interceptors.response.use((res) => {
  console.log('接口返回：', res)
  return res
}, (err) => {
  console.log('接口异常：', err.response.status)
  return Promise.reject(err)
})
Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router
})
