// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 项目架构没做好，没时间重构，代码很乱
import Vue from 'vue'
import Moment from 'moment'
import { Table, TableColumn, Tooltip, Upload, Select, Option, TimePicker } from 'element-ui'
import router from '@/router'
import Axios from '@/http'
import App from '@/App'
import store from '@/store/'
import config from '@/script/config'

// 向IE兼容promise
import 'babel-polyfill'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.prototype.$http = Axios;
Vue.prototype.$moment = Moment;
Vue.prototype.$config = config;

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Upload)
Vue.use(Select)
Vue.use(Option)
Vue.use(TimePicker)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
