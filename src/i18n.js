import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import km from '@/locales/km.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    km
  }
})

export default i18n
