import Vue from 'vue'
import Locale from 'element-ui/lib/locale';
import VueI18n from 'vue-i18n'
import ZH from '@/lang/zh-CH'
import EN from '@/lang/en-US'
import FR from '@/lang/fr-FR'

Vue.use(VueI18n)

const messages = {
  'zh-CH': ZH,
  'en-US': EN,
  'fr-FR': FR
}

const i18n = new VueI18n({
  locale: localStorage.getItem('LANGUAGE') || 'en-US',
  messages
})

// element-ui多语言
Locale.i18n((key, value) => i18n.t(key, value))

export default i18n
