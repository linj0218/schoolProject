import * as types from '@/store/mutation-types'

export default {
  [types.SET_TEST] (state, str) {
    state.test = str;
  },
  [types.SET_INITHOLIDAY] (state, flg) {
    state.initHoliday = flg;
  },
  [types.SET_SCHOOLYEARINFO] (state, list) {
    state.schoolYearInfo = list;
  },

  // 获取用户信息
  [types.GET_USERINFO] (state, { userInfo }) {
    state.userInfo = userInfo;
  },
  // 多语言
  [types.GET_LANGUAGE] (state, { lang }) {
    state.lang = lang;
  }
}
