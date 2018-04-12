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
