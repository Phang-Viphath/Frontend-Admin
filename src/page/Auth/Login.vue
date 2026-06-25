<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <!-- Top-right Theme/Lang Actions -->
    <div class="absolute top-4 right-4 flex items-center gap-2">
      <button @click="languageStore.setLanguage(languageStore.locale === 'en' ? 'km' : 'en')"
        class="flex items-center justify-center h-10 px-3 rounded-lg text-sm font-semibold bg-green-600/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors uppercase">
        {{ languageStore.locale === 'en' ? 'EN' : 'KH' }}
      </button>
      <button @click="themeStore.toggleTheme()"
        class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <span class="material-symbols-outlined text-2xl">
          {{ themeStore.isDark ? 'dark_mode' : 'light_mode' }}
        </span>
      </button>
    </div>

    <div class="w-full max-w-md">
      <div class="rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">{{ $t('login') }}</h2>

        <!-- Error message -->
        <div v-if="errorMessage" class="mb-6 p-3 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-center text-sm">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="onLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ $t('email') }}</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">person</span>
              <input
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="w-full pl-11 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-gray-900 dark:text-white placeholder-gray-500"
                :placeholder="$t('email_placeholder')"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ $t('password') }}</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">lock</span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full pl-11 pr-12 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-gray-900 dark:text-white placeholder-gray-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="rememberMe" class="size-4 rounded text-green-600" />
              <span class="text-gray-600 dark:text-gray-300">{{ $t('remember_me') }}</span>
            </label>
            <a href="#" class="text-green-600 hover:text-green-500">{{ $t('forgot_password') }}</a>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500/40 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ loading ? $t('signing_in') : $t('sign_in') }}
          </button>
        </form>

        <!-- Register Link -->
        <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          {{ $t('no_account') }}
          <router-link to="/register" class="text-green-600 hover:text-green-500 font-medium">
            {{ $t('register') }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import request from '../../util/request'
import { useProfileStore } from '../../util/profile'
import { useThemeStore } from '../../util/theme'
import { useLanguageStore } from '../../util/language'

const router = useRouter()
const profileStore = useProfileStore()
const { t } = useI18n()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const onLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await request('/login', 'POST', {
      email: email.value.trim(),
      password: password.value
    })

    if (response?.user && response?.token) {
      profileStore.setProfile(response.user)
      profileStore.setToken(response.token)
      const roleNames = response.roles?.map(r => r.name || r.role) || []
      profileStore.setRoles(roleNames)
      profileStore.setPermissions(response.permissions.map(p => p.name || p.permission))

      if (rememberMe.value) {
        sessionStorage.setItem('rememberMe', 'true')
      }

      await router.push('/dashboard')
    } else {
      errorMessage.value = response?.message || t('login_invalid_credentials')
    }
  } catch (err) {
    errorMessage.value = err?.response?.data?.error || t('login_failed')
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>