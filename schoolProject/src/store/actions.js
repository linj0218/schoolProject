import * as types from '@/store/mutation-types';
import { getSStorage } from '@/script/util'

// 用户信息
export const getUserInfo = ({ commit }) => {
  const userInfo = getSStorage('userinfo');
  commit(types.GET_USERINFO, { userInfo });
}
