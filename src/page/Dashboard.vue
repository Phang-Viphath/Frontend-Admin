<template>
  <div class="space-y-6">
    <!-- Page Title -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      <div class="flex items-center gap-3">
        <span v-if="isRefreshing" class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <span class="material-symbols-outlined animate-spin text-base">progress_activity</span>
          Refreshing...
        </span>
        <p v-else class="text-sm text-gray-500 dark:text-gray-400">Last updated: {{ lastUpdatedLabel }}</p>
        <div class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Sync
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- Revenue Card -->
      <div class="rounded-xl bg-white dark:bg-[#1e293b] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
            <!-- Skeleton -->
            <div v-if="isLoadingReports" class="mt-2 h-9 w-28 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <p v-else class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">${{ kpis.total_revenue }}</p>
            <div v-if="isLoadingReports" class="mt-2 h-3 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <p v-else class="text-xs text-gray-500 dark:text-gray-400 mt-2">Based on reservations in selected period</p>
          </div>
          <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 ml-4 flex-shrink-0">
            <span class="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">payments</span>
          </div>
        </div>
      </div>

      <!-- Occupancy Card -->
      <div class="rounded-xl bg-white dark:bg-[#1e293b] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Occupancy Rate</p>
            <div v-if="isLoadingReports" class="mt-2 h-9 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <p v-else class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ kpis.occupancy_rate }}%</p>
            <div v-if="isLoadingReports" class="mt-2 h-3 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <p v-else class="text-xs text-gray-500 dark:text-gray-400 mt-2">Calculated from room-nights</p>
          </div>
          <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 ml-4 flex-shrink-0">
            <span class="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">trending_up</span>
          </div>
        </div>
      </div>

      <!-- Total Bookings Card -->
      <div class="rounded-xl bg-white dark:bg-[#1e293b] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
            <div v-if="isLoadingReservations" class="mt-2 h-9 w-14 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <p v-else class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ totalBookingsThisMonth }}</p>
            <div v-if="isLoadingReservations" class="mt-2 h-3 w-44 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <p v-else class="text-xs text-gray-500 dark:text-gray-400 mt-2">Count of reservations (non-cancelled)</p>
          </div>
          <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 ml-4 flex-shrink-0">
            <span class="material-symbols-outlined text-3xl text-purple-600 dark:text-purple-400">calendar_month</span>
          </div>
        </div>
      </div>

      <!-- Available Rooms Card -->
      <div class="rounded-xl bg-white dark:bg-[#1e293b] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Available Rooms</p>
            <div v-if="isLoadingRooms" class="mt-2 h-9 w-14 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <p v-else class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ roomCounts.available }}</p>
            <div v-if="isLoadingRooms" class="mt-2 h-3 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <p v-else class="text-xs text-gray-500 dark:text-gray-400 mt-2">Out of {{ totalRooms }} total rooms</p>
          </div>
          <div class="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 ml-4 flex-shrink-0">
            <span class="material-symbols-outlined text-3xl text-orange-600 dark:text-orange-400">bed</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Table Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Reservations Table -->
      <div class="lg:col-span-2 rounded-xl bg-white dark:bg-[#1e293b] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Reservations</h2>
          <span v-if="isLoadingReservations" class="flex items-center gap-1 text-xs text-gray-400">
            <span class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
            Loading...
          </span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#2d3b4e] dark:text-gray-400">
              <tr>
                <th class="px-6 py-3">Guest Name</th>
                <th class="px-6 py-3">Room</th>
                <th class="px-6 py-3">Check-in</th>
                <th class="px-6 py-3">Check-out</th>
                <th class="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">

              <!-- Skeleton rows -->
              <template v-if="isLoadingReservations">
                <tr v-for="i in 5" :key="`sk-${i}`" class="animate-pulse">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="size-9 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                      <div class="h-3.5 w-28 rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </td>
                  <td class="px-6 py-4"><div class="h-3.5 w-20 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                  <td class="px-6 py-4"><div class="h-3.5 w-20 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                  <td class="px-6 py-4"><div class="h-3.5 w-20 rounded bg-gray-200 dark:bg-gray-700"></div></td>
                  <td class="px-6 py-4"><div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div></td>
                </tr>
              </template>

              <!-- Actual rows -->
              <tr
                v-else
                v-for="r in recentReservations"
                :key="r.id"
                class="hover:bg-gray-50 dark:hover:bg-[#2d3b4e] transition-colors"
              >
                <td class="px-6 py-4 font-medium">
                  <div class="flex items-center gap-3">
                    <img
                      class="size-9 rounded-full object-cover border border-gray-200 dark:border-gray-600 flex-shrink-0"
                      :src="getGuestImageSrc(r)"
                      :alt="r.guest"
                      @error="onGuestImageError"
                    />
                    <span class="truncate">{{ r.guest }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">{{ r.room }}</td>
                <td class="px-6 py-4">{{ formatDate(r.check_in) }}</td>
                <td class="px-6 py-4">{{ formatDate(r.check_out) }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded-full" :class="statusBadgeClass(r.status)">
                    {{ r.status }}
                  </span>
                </td>
              </tr>

              <!-- Empty -->
              <tr v-if="!isLoadingReservations && !recentReservations.length">
                <td colspan="5" class="px-6 py-10 text-center text-gray-400 dark:text-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <span class="text-sm">No reservations found</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Room Status -->
      <div class="rounded-xl bg-white dark:bg-[#1e293b] shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Room Status (Today)</h2>

        <!-- Skeleton -->
        <div v-if="isLoadingRooms" class="space-y-4 animate-pulse">
          <div v-for="i in 5" :key="`rsk-${i}`" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div class="h-3.5 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="h-5 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div class="h-px bg-gray-200 dark:bg-gray-700 mt-4"></div>
          <div class="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700 mt-4"></div>
        </div>

        <!-- Actual Data -->
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-yellow-500"></div>
              <span class="text-sm font-medium">Occupied</span>
            </div>
            <span class="text-lg font-bold">{{ roomCounts.occupied }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-blue-500"></div>
              <span class="text-sm font-medium">Reserved</span>
            </div>
            <span class="text-lg font-bold">{{ roomCounts.reserved }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-gray-400"></div>
              <span class="text-sm font-medium">Cleaning</span>
            </div>
            <span class="text-lg font-bold">{{ roomCounts.cleaning }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-red-500"></div>
              <span class="text-sm font-medium">Maintenance</span>
            </div>
            <span class="text-lg font-bold">{{ roomCounts.maintenance }}</span>
          </div>
          <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-green-500"></div>
              <span class="text-sm font-medium">Available</span>
            </div>
            <span class="text-lg font-bold text-green-600 dark:text-green-400">{{ roomCounts.available }}</span>
          </div>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 mt-6">
          <span v-if="isLoadingRooms" class="inline-block h-3 w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></span>
          <span v-else>Out of {{ totalRooms }} total rooms</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import request from '@/util/request'
import { resolveImageUrl } from '@/util/image'
import userAvatar from '@/assets/user_avatar.png'

// ── Loading states ──────────────────────────────────────────
const isLoadingReports      = ref(false)
const isLoadingReservations = ref(false)
const isLoadingRooms        = ref(false)
const isRefreshing          = computed(() =>
  isLoadingReports.value || isLoadingReservations.value || isLoadingRooms.value
)

// ── Data ────────────────────────────────────────────────────
const lastUpdated = ref(null)
const kpis = ref({ occupancy_rate: 0, adr: 0, revpar: 0, total_revenue: 0 })
const reservations = ref([])
const rooms = ref([])

// ── Computed ────────────────────────────────────────────────
const lastUpdatedLabel = computed(() =>
  lastUpdated.value ? lastUpdated.value.toLocaleString() : '—'
)

const mapReservation = r => ({
  id: r.id,
  guest: r.guest?.name ?? 'Unknown',
  guest_image: r.guest?.image ?? null,
  room: r.room ? `${r.room.type} #${r.room.number}` : 'N/A',
  check_in: r.check_in,
  check_out: r.check_out,
  status: r.status || 'Pending'
})

const recentReservations = computed(() => {
  const list = Array.isArray(reservations.value) ? reservations.value : []
  return list
    .filter(r => String(r.status || '').toLowerCase() !== 'cancelled')
    .slice(0, 7)
})

const totalBookingsThisMonth = computed(() => {
  const list = Array.isArray(reservations.value) ? reservations.value : []
  return list.filter(r => String(r.status || '').toLowerCase() !== 'cancelled').length
})

const roomCounts = computed(() => {
  const counts = { occupied: 0, reserved: 0, cleaning: 0, maintenance: 0, available: 0 }
  const list = Array.isArray(rooms.value) ? rooms.value : []
  for (const room of list) {
    const s = String(room.status || '').toLowerCase()
    if (s in counts) counts[s] += 1
  }
  return counts
})

const totalRooms = computed(() => {
  const list = Array.isArray(rooms.value) ? rooms.value : []
  return list.length
})

// ── Helpers ─────────────────────────────────────────────────
const getGuestImageSrc = (r) => {
  const resolved = resolveImageUrl(r?.guest_image)
  return resolved || userAvatar
}

const onGuestImageError = (e) => {
  if (e?.target) e.target.src = userAvatar
}

const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString()
}

const statusBadgeClass = (status) => {
  const s = String(status || '').toLowerCase()
  if (s.includes('pending'))  return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  if (s.includes('confirm'))  return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  if (s.includes('cancel'))   return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

// ── Data fetching ────────────────────────────────────────────
const loadReports = async (silent = false) => {
  if (!silent) isLoadingReports.value = true
  try {
    const data = await request('/reports', 'GET', { period: 'month' })
    kpis.value = data?.kpis || kpis.value
  } finally {
    if (!silent) isLoadingReports.value = false
  }
}

const loadReservations = async (silent = false) => {
  if (!silent) isLoadingReservations.value = true
  try {
    const data = await request('/reservations', 'GET')
    reservations.value = Array.isArray(data) ? data.map(mapReservation) : []
  } finally {
    if (!silent) isLoadingReservations.value = false
  }
}

const loadRooms = async (silent = false) => {
  if (!silent) isLoadingRooms.value = true
  try {
    const data = await request('/rooms', 'GET')
    rooms.value = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
  } finally {
    if (!silent) isLoadingRooms.value = false
  }
}

const refreshDashboard = async (silent = false) => {
  await Promise.all([loadReports(silent), loadReservations(silent), loadRooms(silent)])
  lastUpdated.value = new Date()
}

let syncInterval = null

onMounted(() => {
  refreshDashboard()
  syncInterval = setInterval(() => {
    refreshDashboard(true)
  }, 5000)
})

onBeforeUnmount(() => {
  if (syncInterval) {
    clearInterval(syncInterval)
    syncInterval = null
  }
})
</script>