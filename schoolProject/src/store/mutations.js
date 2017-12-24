import {
  SET_TEST,
  SET_INITHOLIDAY,
  SET_SCHOOLYEARINFO
} from '@/store/mutation-types'

export default {
  [SET_TEST] (state, str) {
    state.test = str;
  },
  [SET_INITHOLIDAY] (state, flg) {
    state.initHoliday = flg;
  },
  [SET_SCHOOLYEARINFO] (state, list) {
    state.schoolYearInfo = list;
  }
}
