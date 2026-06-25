<template>
  <div
    class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg transform transition-all scale-100 max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <div class="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ $t('reservation_details') }}</h3>
      </div>

      <div class="p-4 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('reservation_id') }}</label>
            <p class="text-base font-semibold text-gray-900 dark:text-white">#{{ data.id }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('status_header') }}</label>
            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                statusBadgeClasses[data.status] || statusBadgeClasses.pending
              ]"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              {{ $t('status_' + (data.status || 'pending').replace(/[- ]/g, '_')) }}
            </span>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-5">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">{{ $t('guest_information') }}</h4>
          <div class="space-y-3">
            <div class="flex items-center gap-4">
              <div
                class="size-16 rounded-full bg-cover bg-center border-2 border-gray-200 dark:border-gray-600 shrink-0"
                :style="{ backgroundImage: `url(${getGuestImage(data)})` }"
              ></div>
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('guest_name') }}</label>
                <p class="text-base font-medium text-gray-900 dark:text-white">{{ data.guest }}</p>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 mt-2">{{ $t('email') }}</label>
                <p class="text-base text-gray-900 dark:text-white">{{ data.email || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-5">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">{{ $t('room_information') }}</h4>
          <div>
            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('room_label') }}</label>
            <p class="text-base text-gray-900 dark:text-white">{{ data.room }}</p>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-5">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">{{ $t('reservation_dates') }}</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('check_in_date') }}</label>
              <p class="text-base text-gray-900 dark:text-white">{{ formatDate(data.checkIn) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('check_out_date') }}</label>
              <p class="text-base text-gray-900 dark:text-white">{{ formatDate(data.checkOut) }}</p>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-5">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">{{ $t('payment_information') }}</h4>
          <div class="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('total_amount') }}</span>
              <span class="text-xl font-semibold text-gray-900 dark:text-white">${{ data.total }}</span>
            </div>
            <div v-if="data.raw.payment_status" class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('payment_status') }}</span>
                <span class="text-sm font-medium capitalize text-gray-900 dark:text-white">{{ data.raw.payment_status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sm:justify-end gap-3 px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-900/50 rounded-b-2xl">
        <button
          type="button"
          class="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition text-sm"
          @click="$emit('close')"
        >
          {{ $t('close') }}
        </button>
        <button
          type="button"
          class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center gap-2 font-medium shadow-sm text-sm"
          @click="$emit('print')"
        >
          <span class="material-symbols-outlined text-lg">print</span>
          {{ $t('print_invoice') }}
        </button>
        <button
          type="button"
          class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition flex items-center justify-center gap-2 font-medium shadow-sm text-sm"
          @click="$emit('edit')"
        >
          <span class="material-symbols-outlined text-lg">edit</span>
          {{ $t('edit_reservation') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import configurl from '../../util/configurl'
import avatar from '../../assets/user_avatar.png'
import { resolveImageUrl } from '@/util/image'

defineProps({
  data: Object,
  statusBadgeClasses: Object
})

defineEmits(['edit', 'close', 'print'])

const getGuestImage = (reservationData) => {
  const resolved = resolveImageUrl(reservationData.raw?.guest?.image)
  if (resolved) return resolved
  return avatar
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>
