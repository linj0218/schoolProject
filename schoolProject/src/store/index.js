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
  initHoliday: false, // 节假日是否初始化
  schoolYearInfo: [], // 学期信息list
  autoLoginFinish: false // 自动登录完毕
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: process.env.NODE_ENV !== 'production'
})

export default store
