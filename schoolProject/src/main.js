// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Moment from 'moment'
import { Table, TableColumn, Tooltip, Upload, Select, Option, TimePicker, TimeSelect, DatePicker, ColorPicker, Input, Pagination, Button } from 'element-ui'
import router from '@/router'
import Axios from '@/http'
import App from '@/App'
import store from '@/store/'
import i18n from '@/lang'

import config from '@/script/config'
import '@/styles/custom-element-ui.scss' // 覆盖element-ui样式

import 'babel-polyfill' // 向IE兼容promise
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false; // 项目启动时的提示

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
Vue.use(TimeSelect)
Vue.use(DatePicker)
Vue.use(ColorPicker)
Vue.use(Input)
Vue.use(Pagination)
Vue.use(Button)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
