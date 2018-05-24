import * as types from '@/store/mutation-types'

export default {
  [types.SET_TEST] (state, str) {
    state.test = str;
  },
  // 节假日初始化标识
  [types.GET_INITHOLIDAY] (state, flg) {
    state.initHoliday = flg;
  },
  // 学期信息list
  [types.GET_SCHOOLYEARINFO] (state, list) {
    state.schoolYearInfo = list;
  },

  // 获取用户信息
  [types.GET_USERINFO] (state, { userInfo }) {
    state.userInfo = userInfo;
  },
  // 多语言
  [types.GET_LANGUAGE] (state, { lang }) {
    state.lang = lang;
  },
  // 自动登录
  [types.GET_AUTOLOGINFINISH] (state, flg) {
    state.autoLoginFinish = flg;
  },
  // 备忘录侧边栏显示状态
  [types.SET_MEMOSIDE] (state, flg) {
    state.memoSide = flg;
  },
  // 侧边栏备忘录数据
  [types.SET_MEMOSIDELIST] (state, list) {
    state.memoSideList = list;
  }
}
