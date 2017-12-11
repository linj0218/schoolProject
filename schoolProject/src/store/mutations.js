import {
  SET_TEST
} from '@/store/mutation-types'

export default {
  [SET_TEST] (state, str) {
    state.test = str;
  }
}
