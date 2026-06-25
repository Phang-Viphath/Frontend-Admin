import { defineStore } from 'pinia'
import i18n from '../i18n'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    locale: 'en', // Default locale
  }),

  actions: {
    setLanguage(lang) {
      this.locale = lang
      i18n.global.locale.value = lang
    },
    
    initLanguage() {
      // Sync i18n with the persisted state on load
      i18n.global.locale.value = this.locale
    }
  },

  persist: {
    storage: localStorage,
    paths: ['locale']
  }
})
