<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('settings') }}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ $t('settings_desc') }}</p>
    </div>

    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-[green] text-[green] dark:text-[green]-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <div class="rounded-xl bg-white dark:bg-[#1e293b] shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div v-if="activeTab === 'general'">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('general_settings') }}</h2>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('language') }}</label>
            <select 
              :value="languageStore.locale" 
              @change="languageStore.setLanguage($event.target.value)"
              class="mt-1 w-full max-w-md px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="en">English</option>
              <option value="km">Khmer</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('timezone') }}</label>
            <select class="mt-1 w-full max-w-md px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none">
              <option>UTC-05:00 Eastern Time</option>
              <option>UTC+00:00 Greenwich Mean Time</option>
              <option>UTC+01:00 Central European Time</option>
            </select>
          </div>
          <div class="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="darkMode" 
              :checked="themeStore.isDark"
              @change="themeStore.toggleTheme()"
              class="size-5 rounded text-[green] focus:ring-[green]" 
            />
            <label for="darkMode" class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('enable_dark_mode') }}</label>
          </div>
          <div class="pt-4">
            <button class="px-6 py-2.5 bg-[green] text-white rounded-lg hover:bg-[green]/90 transition-colors">{{ $t('save_changes') }}</button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'hotel'">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('hotel_info') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('hotel_name') }}</label>
            <input type="text" value="Battambang Hotel" class="mt-1 w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('contact_email') }}</label>
            <input type="email" value="viphathphang7@gmail.com" class="mt-1 w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('phone_number') }}</label>
            <input type="tel" value="+855963612863" class="mt-1 w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('address') }}</label>
            <input type="text" value="Battambang province, Cambodia" class="mt-1 w-full px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('currency') }}</label>
            <select class="mt-1 w-full max-w-md px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none">
              <option>USD - US Dollar</option>
              <option>KHR - Cambodian Riel</option>
            </select>
          </div>
        </div>
        <div class="pt-6">
          <button class="px-6 py-2.5 bg-[green] text-white rounded-lg hover:bg-[green]/90 transition-colors">{{ $t('update_hotel_info') }}</button>
        </div>
      </div>

      <div v-if="activeTab === 'notifications'">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('notification_prefs') }}</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ $t('new_reservation_alerts') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('new_reservation_alerts_desc') }}</p>
            </div>
            <button class="relative inline-flex items-center h-6 rounded-full w-11 bg-[green] transition-colors">
              <span class="translate-x-6 size-4 bg-white rounded-full transition-transform"></span>
            </button>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ $t('checkin_checkout_reminders') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('checkin_checkout_reminders_desc') }}</p>
            </div>
            <button class="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300 dark:bg-gray-600 transition-colors">
              <span class="translate-x-1 size-4 bg-white rounded-full transition-transform"></span>
            </button>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ $t('low_occupancy_alerts') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('low_occupancy_alerts_desc') }}</p>
            </div>
            <button class="relative inline-flex items-center h-6 rounded-full w-11 bg-[green] transition-colors">
              <span class="translate-x-6 size-4 bg-white rounded-full transition-transform"></span>
            </button>
          </div>
        </div>
        <div class="pt-6">
          <button class="px-6 py-2.5 bg-[green] text-white rounded-lg hover:bg-[green]/90 transition-colors">{{ $t('save_preferences') }}</button>
        </div>
      </div>

      <div v-if="activeTab === 'security'">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('security_account') }}</h2>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('current_password') }}</label>
            <input type="password" class="mt-1 w-full max-w-md px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('new_password') }}</label>
            <input type="password" class="mt-1 w-full max-w-md px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('confirm_new_password') }}</label>
            <input type="password" class="mt-1 w-full max-w-md px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div class="flex items-center gap-3">
            <input type="checkbox" id="2fa" class="size-5 rounded text-[green] focus:ring-[green]" />
            <label for="2fa" class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('enable_2fa') }}</label>
          </div>
          <div>
            <button class="px-6 py-2.5 bg-[green] text-white rounded-lg hover:bg-[green]/90 transition-colors">{{ $t('update_password') }}</button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'integrations'">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{{ $t('tab_integrations') }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('integrations_desc') }}</p>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
            <span class="material-symbols-outlined text-4xl text-gray-400">link</span>
            <p class="mt-2 font-medium">Stripe Payments</p>
            <button class="mt-4 text-sm text-[green]">{{ $t('connect') }}</button>
          </div>
          <div class="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
            <span class="material-symbols-outlined text-4xl text-gray-400">link</span>
            <p class="mt-2 font-medium">Booking.com</p>
            <button class="mt-4 text-sm text-[green]">{{ $t('connect') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/util/language'
import { useThemeStore } from '@/util/theme'

const { t } = useI18n()
const languageStore = useLanguageStore()
const themeStore = useThemeStore()

const tabs = computed(() => [
  { id: 'general', name: t('tab_general') },
  { id: 'hotel', name: t('tab_hotel') },
  { id: 'notifications', name: t('tab_notifications') },
  { id: 'security', name: t('tab_security') },
  { id: 'integrations', name: t('tab_integrations') },
])

const activeTab = ref('general')
</script>