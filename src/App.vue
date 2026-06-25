<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from './util/theme'
import { useLanguageStore } from './util/language'

const themeStore = useThemeStore()
const languageStore = useLanguageStore()

onMounted(() => {
  themeStore.initTheme()
  languageStore.initLanguage()
})
</script>

<template>
  <RouterView />
</template>