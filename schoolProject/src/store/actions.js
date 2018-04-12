import * as types from '@/store/mutation-types';
import { getSStorage } from '@/script/util'

// 用户信息
export const getUserInfo = ({ commit }) => {
  const userInfo = getSStorage('userinfo') || {};
  commit(types.GET_USERINFO, { userInfo });
}

// 多语言
export const getLanguage = ({ commit }) => {
  const lang = localStorage.getItem('LANGUAGE') || 'en-US';
  commit(types.GET_LANGUAGE, { lang });
}

// 节假日初始化标识
export const getInitHoliday = ({ commit }) => {
  commit(types.GET_INITHOLIDAY, true);
}

// 学期信息list
export const getSchoolYearInfo = ({ commit }, list) => {
  commit(types.GET_SCHOOLYEARINFO, list);
}
