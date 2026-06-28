<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('history_title') }}</h1>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ $t('manage_history') }}</p>
      </div>
    </div>

    <div class="rounded-xl bg-white dark:bg-[#1e293b] p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-3 text-gray-500 text-xl">search</span>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('search_history_placeholder')"
            :disabled="isLoading || isSaving"
            class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <select
          v-model="statusFilter"
          :disabled="isLoading || isSaving"
          class="px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">{{ $t('all_status') }}</option>
          <option value="current">{{ $t('current_stay') }}</option>
          <option value="past">{{ $t('past_guest') }}</option>
          <option value="upcoming">{{ $t('upcoming') }}</option>
          <option value="vip">{{ $t('vip_loyalty') }}</option>
        </select>

        <select
          v-model="loyaltyFilter"
          :disabled="isLoading || isSaving"
          class="px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">{{ $t('all_loyalty') }}</option>
          <option value="none">{{ $t('loyalty_none') }}</option>
          <option value="silver">{{ $t('loyalty_silver') }}</option>
          <option value="gold">{{ $t('loyalty_gold') }}</option>
          <option value="platinum">{{ $t('loyalty_platinum') }}</option>
        </select>
      </div>
    </div>

    <div class="rounded-xl bg-white dark:bg-[#1e293b] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div v-if="isLoading" class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end bg-gray-50/50 dark:bg-gray-800/50">
        <span class="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span class="material-symbols-outlined animate-spin text-[16px] text-blue-600">progress_activity</span>
          {{ $t('loading_history') }}
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-[#2d3b4e] text-gray-700 dark:text-gray-400">
            <tr>
              <th class="px-6 py-4 text-left">{{ $t('guest') }}</th>
              <th class="px-6 py-4 text-left">{{ $t('contact') }}</th>
              <th class="px-6 py-4 text-left">{{ $t('current_upcoming_stay') }}</th>
              <th class="px-6 py-4 text-left">{{ $t('loyalty') }}</th>
              <th class="px-6 py-4 text-left">{{ $t('total_stays') }}</th>
              <th class="px-6 py-4 text-left">{{ $t('status_header') }}</th>
              <th class="px-6 py-4 text-center">{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <template v-if="isLoading">
              <tr v-for="i in 5" :key="`sk-${i}`" class="animate-pulse bg-white dark:bg-[#1e293b]">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="size-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                    <div class="flex-1">
                      <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1.5"></div>
                      <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1.5"></div>
                  <div class="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1.5"></div>
                  <div class="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td class="px-6 py-4"><div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
                <td class="px-6 py-4"><div class="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td class="px-6 py-4"><div class="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
                <td class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <div class="size-9 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-else-if="paginatedHistorys.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <span class="material-symbols-outlined text-4xl mb-3">history</span>
                  <p class="text-lg font-medium">{{ $t('no_history_found') }}</p>
                  <p class="text-sm mt-1">{{ $t('try_adjusting_search_history') }}</p>
                </div>
              </td>
            </tr>

            <template v-else>
              <tr
                v-for="guest in paginatedHistorys"
                :key="guest.id"
                class="hover:bg-gray-50 dark:hover:bg-[#2d3b4e] transition-colors"
                :class="{'opacity-50 pointer-events-none': isSaving && deletingId === guest.id}"
              >
                <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="guest.avatar"
                    :alt="guest.name"
                    class="size-10 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
                    @error="guest.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(guest.name)}`"
                  />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-gray-100">{{ guest.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ guest.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm text-gray-900 dark:text-gray-100">{{ guest.email }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ guest.phone }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="guest.currentStay">
                  <p class="font-medium text-gray-900 dark:text-gray-100">{{ guest.currentStay.room }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ guest.currentStay.dates }}</p>
                </div>
                <p v-else class="text-sm text-gray-500 dark:text-gray-400">{{ $t('no_active_stay') }}</p>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="{
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': guest.loyalty === 'none',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': guest.loyalty === 'silver',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': guest.loyalty === 'gold',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400': guest.loyalty === 'platinum',
                  }"
                  class="px-3 py-1 text-xs font-medium rounded-full capitalize inline-flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-sm" v-if="guest.loyalty !== 'none'">
                    {{ guest.loyalty === 'platinum' ? 'workspace_premium' : guest.loyalty === 'gold' ? 'star' : 'military_tech' }}
                  </span>
                  {{ guest.loyalty }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="text-gray-900 dark:text-gray-100 font-medium">{{ guest.totalStays }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('stays') }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': guest.status === 'current',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': guest.status === 'upcoming',
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': guest.status === 'past',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400': guest.status === 'vip',
                  }"
                  class="px-3 py-1 text-xs font-medium rounded-full capitalize inline-flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-sm">
                    {{
                      guest.status === 'current' ? 'hotel' :
                      guest.status === 'upcoming' ? 'event_upcoming' :
                      guest.status === 'vip' ? 'workspace_premium' : 'history'
                    }}
                  </span>
                  {{ guest.statusLabel }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3d4b5e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :aria-label="$t('delete')"
                    :title="$t('delete')"
                    @click="deleteHistory(guest)"
                    :disabled="isLoading || isSaving"
                  >
                    <span
                      class="material-symbols-outlined text-lg"
                      :class="isSaving && deletingId === guest.id ? 'animate-spin' : 'text-red-600 dark:text-red-400'"
                    >
                      {{ isSaving && deletingId === guest.id ? 'progress_activity' : 'delete' }}
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div
        v-if="!isLoading && filteredHistorys.length > 0"
        class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700"
      >
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('showing_history_pagination', { start: startItem, end: endItem, total: totalItems }) }}</p>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] hover:bg-gray-200 dark:hover:bg-[#3d4b5e] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1 || isLoading"
            @click="prevPage"
          >
            {{ $t('previous') }}
          </button>
          <button
            class="px-3 py-1 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] hover:bg-gray-200 dark:hover:bg-[#3d4b5e] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages || isLoading || totalPages === 0"
            @click="nextPage"
          >
            {{ $t('next') }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmModalDelete
      ref="confirmDeleteModal"
      :title="$t('delete_history')"
      :message="$t('delete_history_confirm')"
      :confirmText="$t('yes_delete')"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import request from '@/util/request'
import configurl from '@/util/configurl'
import { showToast } from '@/util/toast'
import { resolveImageUrl } from '@/util/image'

import ConfirmModalDelete from '../components/ConfirmDeleteModel.vue'

const Historys = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const deletingId = ref(null)
const confirmDeleteModal = ref(null)

const isCreateOpen = ref(false)
const guests = ref([])
const rooms = ref([])
const reservations = ref([])
const isLoadingGuests = ref(true)
const isLoadingRooms = ref(true)
const isLoadingReservations = ref(true)

const createForm = ref({
  guest_id: '',
  room_id: '',
  reservation_id: '',
  total_stays: 0,
  status: 'current'
})

const isCreateValid = computed(() => {
  return createForm.value.guest_id && createForm.value.room_id && createForm.value.reservation_id && createForm.value.status
})

const loadGuests = async () => {
  try {
    isLoadingGuests.value = true
    const data = await request('/guests', 'GET')
    guests.value = Array.isArray(data) ? data : []
  } catch {
    guests.value = []
  } finally {
    isLoadingGuests.value = false
  }
}

const loadRooms = async () => {
  try {
    isLoadingRooms.value = true
    const data = await request('/rooms', 'GET')
    rooms.value = Array.isArray(data) ? data : []
  } catch {
    rooms.value = []
  } finally {
    isLoadingRooms.value = false
  }
}

const loadReservations = async () => {
  try {
    isLoadingReservations.value = true
    const data = await request('/reservations', 'GET')
    reservations.value = Array.isArray(data) ? data : []
  } catch {
    reservations.value = []
  } finally {
    isLoadingReservations.value = false
  }
}

const currentPage = ref(1)
const itemsPerPage = ref(10)

const searchQuery = ref('')
const statusFilter = ref('all')
const loyaltyFilter = ref('all')

const statusLabelMap = {
  current: 'Current Stay',
  upcoming: 'Upcoming',
  past: 'Past Guest',
  vip: 'VIP'
}

const mapHistory = (h) => {
  const guest = h.guest || {}
  const room = h.room || {}
  const reservation = h.reservation || {}

  const resolvedAvatar = resolveImageUrl(guest.image)
  const avatar = resolvedAvatar
    ? resolvedAvatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(guest.name || 'Guest')}&background=random`

  let loyalty = 'none'
  const totalStays = h.total_stays ?? 0
  if (totalStays >= 20) loyalty = 'platinum'
  else if (totalStays >= 10) loyalty = 'gold'
  else if (totalStays >= 5) loyalty = 'silver'

  let status = 'past'
  let statusLabel = 'Past Guest'
  
  if (reservation.status === 'Checked In') {
    status = 'current'
    statusLabel = 'Current Stay'
  } else if (reservation.status === 'Confirmed' || reservation.status === 'Pending') {
    status = 'upcoming'
    statusLabel = 'Upcoming'
  }

  if (loyalty === 'platinum') {
    status = 'vip'
    statusLabel = 'VIP Guest'
  }

  return {
    id: h.id,
    name: guest.name || 'Unknown Guest',
    email: guest.email || 'No email',
    phone: guest.phone || 'No phone',
    avatar,
    currentStay: room.type && reservation.check_in ? {
      room: `${room.type} #${room.number || ''}`.trim(),
      dates: `${reservation.check_in} – ${reservation.check_out || 'N/A'}`
    } : null,
    loyalty,
    totalStays,
    status,
    statusLabel,
    raw: h
  }
}

const loadHistorys = async () => {
  try {
    isLoading.value = true
    const data = await request('/historys', 'GET')
    Historys.value = Array.isArray(data) ? data.map(mapHistory) : []
  } catch (err) {
    showToast(err?.response?.data?.message || 'Failed to load historys', 'error')
    Historys.value = []
  } finally {
    isLoading.value = false
  }
}

const deleteHistory = async (history) => {
  const confirmed = await confirmDeleteModal.value?.open()
  if (!confirmed) return

  isSaving.value = true
  deletingId.value = history.id
  
  try {
    await request(`/historys/${history.id}`, 'DELETE')
    showToast('History deleted successfully', 'success')
    await loadHistorys()
  } catch (err) {
    showToast(err?.response?.data?.message || 'Failed to delete history', 'error')
  } finally {
    isSaving.value = false
    deletingId.value = null
  }
}

const filteredHistorys = computed(() => {
  return Historys.value.filter(guest => {
    const q = (searchQuery.value || '').toLowerCase().trim()
    
    const matchesSearch = !q || 
      guest.name.toLowerCase().includes(q) ||
      guest.email.toLowerCase().includes(q) ||
      guest.phone.includes(searchQuery.value) ||
      guest.id.toString().includes(q)

    const matchesStatus = statusFilter.value === 'all' || guest.status === statusFilter.value
    const matchesLoyalty = loyaltyFilter.value === 'all' || guest.loyalty === loyaltyFilter.value

    return matchesSearch && matchesStatus && matchesLoyalty
  })
})

const totalItems = computed(() => filteredHistorys.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value) || 0)

const paginatedHistorys = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredHistorys.value.slice(start, start + itemsPerPage.value)
})

const startItem = computed(() => (totalItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1))
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value))

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

watch([searchQuery, statusFilter, loyaltyFilter], () => {
  currentPage.value = 1
})

watch(totalPages, (tp) => {
  if (tp > 0 && currentPage.value > tp) currentPage.value = tp
  if (tp === 0) currentPage.value = 1
})

onMounted(async () => {
  await loadHistorys()
})
</script>