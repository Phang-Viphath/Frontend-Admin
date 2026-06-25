<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
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

    <div class="w-full max-w-xl">
      <div class="rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">{{ $t('register') }}</h2>

        <!-- Error message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-center text-sm">
          {{ errorMessage }}
        </div>

        <!-- Success message -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg text-center text-sm">
          {{ successMessage }}
        </div>

        <form @submit.prevent="onRegister" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('name') }}</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">person</span>
                <input
                  v-model="name"
                  type="text"
                  required
                  class="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-gray-900 dark:text-white placeholder-gray-500 text-sm"
                  :placeholder="$t('name_placeholder')"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('email') }}</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">mail</span>
                <input
                  v-model="email"
                  type="email"
                  required
                  autocomplete="email"
                  class="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-gray-900 dark:text-white placeholder-gray-500 text-sm"
                  :placeholder="$t('email_placeholder')"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('password') }}</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">lock</span>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="6"
                  autocomplete="new-password"
                  class="w-full pl-9 pr-10 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-gray-900 dark:text-white placeholder-gray-500 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center"
                >
                  <span class="material-symbols-outlined text-sm">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('confirm_password') }}</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">lock</span>
                <input
                  v-model="password_confirmation"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="6"
                  class="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-gray-900 dark:text-white placeholder-gray-500 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <!-- Profile Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('profile_image_optional') }}</label>
            <div class="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <div v-if="imagePreview" class="shrink-0">
                <img :src="imagePreview" alt="Preview" class="h-10 w-10 object-cover rounded-lg shadow" />
              </div>
            </div>
          </div>

          <!-- Phone & Address -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('phone_optional') }}</label>
              <input
                v-model="phone"
                type="text"
                class="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-gray-900 dark:text-white text-sm"
                :placeholder="$t('phone_placeholder')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('address_optional') }}</label>
              <input
                v-model="address"
                type="text"
                class="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-gray-900 dark:text-white text-sm"
                :placeholder="$t('address_placeholder')"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full mt-2 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500/40 transition disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ loading ? $t('creating_account') : $t('sign_up') }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          {{ $t('already_have_account') }}
          <router-link to="/login" class="text-green-600 hover:text-green-500 font-medium">{{ $t('sign_in') }}</router-link>
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
import { useThemeStore } from '../../util/theme'
import { useLanguageStore } from '../../util/language'

const router = useRouter()
const { t } = useI18n()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const phone = ref('')
const address = ref('')
const image = ref(null)
const imagePreview = ref('')

const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    image.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const onRegister = async () => {
  if (password.value !== password_confirmation.value) {
    errorMessage.value = t('passwords_do_not_match')
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('name', name.value.trim())
    formData.append('email', email.value.trim())
    formData.append('password', password.value)
    formData.append('password_confirmation', password_confirmation.value)
    if (phone.value) formData.append('phone', phone.value)
    if (address.value) formData.append('address', address.value)
    if (image.value) formData.append('image', image.value)

    const response = await request('/register', 'POST', formData)

    successMessage.value = response?.message || t('registration_successful')
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    const errors = err?.response?.data?.errors
    if (errors) {
      errorMessage.value = Object.values(errors).flat().join(' ')
    } else {
      errorMessage.value = err?.response?.data?.message || t('registration_failed')
    }
    console.error('Register error:', err)
  } finally {
    loading.value = false
  }
}
</script>