import {
  SET_TEST,
  SET_HOLIDAY,
  SET_INITHOLIDAY
} from '@/store/mutation-types'

export default {
  [SET_TEST] (state, str) {
    state.test = str;
  },
  [SET_HOLIDAY] (state, list) {
    state.holidays = list;
  },
  [SET_INITHOLIDAY] (state, flg) {
    state.initHoliday = flg;
  }
}
