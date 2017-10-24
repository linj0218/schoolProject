// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import axios from 'axios'
import qs from 'qs'

import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

// default
axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
// request
axios.interceptors.request.use((config) => {
  console.log('请求参数：', config)
  config.data = qs.stringify(config.data)
  return config
}, (err) => {
  console.log('axios异常：', err)
  return Promise.reject(err)
})
// response
axios.interceptors.response.use((res) => {
  console.log('接口返回：', res)
  return res
}, (err) => {
  debugger
  console.log('接口异常：', err)
  return Promise.reject(err)
})
Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router
})
