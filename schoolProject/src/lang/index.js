import Vue from 'vue'
import VueI18n from 'vue-i18n'
import * as ZH from '@/lang/zh-CH'
import * as EN from '@/lang/en-US'
import * as FR from '@/lang/fr-FR'

Vue.use(VueI18n)

const messages = {
  'zh-CH': ZH,
  'en-US': EN,
  'fr-FR': FR
}

export default new VueI18n({
  locale: localStorage.getItem('LANGUAGE') || 'fr-FR',
  messages
})
