import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import * as actions from '@/store/actions'
import * as getters from '@/store/getters'

Vue.use(Vuex)

const state = {
  test: null,
  userInfo: {}, // 用户信息
  lang: '', // 多语言
  profileStatus: 0, // Profile状态 0 关闭 1 开启
  appSettingStatus: 0, // App Setting状态 0 关闭 1 开启
  configStatus: 0, // Config状态 0 关闭 1 开启
  eventStatus: 0, // Event状态 0 关闭 1 开启
  initHoliday: false, // 是否初始化
  schoolYearInfo: null // 学期信息
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: process.env.NODE_ENV !== 'production'
})

export default store
