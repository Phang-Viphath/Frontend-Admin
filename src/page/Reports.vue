<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $t('reports_title') }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ $t('reports_subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="isLoading" class="material-symbols-outlined animate-spin text-xl text-gray-400">refresh</span>
        <select
          v-model="reportPeriod"
          :disabled="isLoading"
          class="px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <option value="day">{{ $t('daily') }}</option>
          <option value="week">{{ $t('last_7_days') }}</option>
          <option value="month">{{ $t('last_month') }}</option>
          <option value="quarter">{{ $t('last_quarter') }}</option>
          <option value="year">{{ $t('last_year') }}</option>
          <option value="custom">{{ $t('custom_range') }}</option>
        </select>
        <button
          :disabled="isLoading"
          @click="exportPdf"
          class="px-4 py-2 bg-[green] text-white rounded-lg hover:bg-[green]/90 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span class="material-symbols-outlined text-xl">download</span>
          {{ $t('export_pdf') }}
        </button>
      </div>
    </div>

    <ReportsPdfExporter
      ref="reportsPdfExporter"
      :report-period="reportPeriod"
      :range="range"
      :kpis="kpis"
      :monthly-summary="monthlySummary"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-xl bg-white dark:bg-[#1e293b] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('avg_occupancy') }}</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ isLoading ? '—' : `${kpis.occupancy_rate}%` }}</p>
          </div>
          <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <span class="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">trending_up</span>
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white dark:bg-[#1e293b] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('adr') }}</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ isLoading ? '—' : `$${kpis.adr}` }}</p>
          </div>
          <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
            <span class="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">attach_money</span>
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white dark:bg-[#1e293b] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('revpar') }}</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ isLoading ? '—' : `$${kpis.revpar}` }}</p>
          </div>
          <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <span class="material-symbols-outlined text-3xl text-purple-600 dark:text-purple-400">analytics</span>
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white dark:bg-[#1e293b] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ $t('total_revenue') }}</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{{ isLoading ? '—' : `$${kpis.total_revenue}` }}</p>
          </div>
          <div class="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <span class="material-symbols-outlined text-3xl text-orange-600 dark:text-orange-400">payments</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="rounded-xl bg-white dark:bg-[#1e293b] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('occupancy_revenue_trend') }}</h2>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{{ $t('occupancy') }}</span>
            <span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">{{ $t('revenue') }}</span>
          </div>
        </div>

        <div class="h-80 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden from-gray-50 to-white dark:from-[#2d3b4e] dark:to-[#223042]">
          <div v-if="isLoading" class="h-full w-full p-6 animate-pulse">
            <div class="h-4 w-48 bg-gray-200 dark:bg-gray-600 rounded mb-4" />
            <div class="h-64 w-full bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
          <div v-else class="h-full w-full p-6">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('preview') }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('occupancy_revenue_over_time') }}</p>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('coming_soon') }}</span>
            </div>

            <div class="relative h-56 rounded-lg border border-dashed border-gray-200 dark:border-gray-600 bg-white/60 dark:bg-black/10 overflow-hidden">
              <div class="absolute inset-0">
                <div class="h-full w-full grid grid-cols-6 opacity-60">
                  <div class="border-r border-gray-200 dark:border-gray-600" />
                  <div class="border-r border-gray-200 dark:border-gray-600" />
                  <div class="border-r border-gray-200 dark:border-gray-600" />
                  <div class="border-r border-gray-200 dark:border-gray-600" />
                  <div class="border-r border-gray-200 dark:border-gray-600" />
                  <div />
                </div>
                <div class="absolute inset-0 flex flex-col justify-between py-6 opacity-60">
                  <div class="border-t border-gray-200 dark:border-gray-600" />
                  <div class="border-t border-gray-200 dark:border-gray-600" />
                  <div class="border-t border-gray-200 dark:border-gray-600" />
                </div>
              </div>

              <div class="absolute inset-0 p-4">
                <div class="h-full w-full rounded-lg from-blue-500/10 via-transparent to-green-500/10" />
              </div>

              <div class="absolute inset-0 p-4">
                <svg class="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <polyline
                    :points="bookingsPolyline"
                    fill="none"
                    stroke="rgb(59 130 246)"
                    stroke-width="2"
                  />
                  <polyline
                    :points="revenuePolyline"
                    fill="none"
                    stroke="rgb(34 197 94)"
                    stroke-width="2"
                  />
                </svg>
              </div>
            </div>

            <div class="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
              <span>{{ chartXAxisStart }}</span>
              <span>{{ chartXAxisEnd }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white dark:bg-[#1e293b] p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('revenue_by_source') }}</h2>
          <div class="flex items-center gap-2">
            <span
              v-for="(s, idx) in revenueSources"
              :key="s.key"
              class="text-xs px-2 py-1 rounded-full"
              :class="sourceChipClass(idx, s.key)"
            >
              {{ s.label }}
            </span>
          </div>
        </div>

        <div class="h-80 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden from-gray-50 to-white dark:from-[#2d3b4e] dark:to-[#223042]">
          <div v-if="isLoading" class="h-full w-full p-6 animate-pulse">
            <div class="h-4 w-40 bg-gray-200 dark:bg-gray-600 rounded mb-4" />
            <div class="h-64 w-full bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
          <div v-else class="h-full w-full p-6">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('preview') }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('room_type_revenue_breakdown') }}</p>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ chartXAxisStart }} - {{ chartXAxisEnd }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center justify-center">
                <div class="relative h-44 w-44 rounded-full bg-white/70 dark:bg-black/10 border border-dashed border-gray-200 dark:border-gray-600">
                  <div class="absolute inset-3 rounded-full from-indigo-500/30 via-amber-500/20 to-gray-500/20" />
                  <div class="absolute inset-8 rounded-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700" />
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('total') }}</p>
                      <p class="text-lg font-bold text-gray-900 dark:text-gray-100">100%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div v-if="!revenueSources.length" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ $t('no_data') }}
                </div>

                <template v-else>
                  <div
                    v-for="(s, idx) in revenueSources"
                    :key="s.key"
                    class="space-y-2"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="h-2.5 w-2.5 rounded-full" :class="sourceDotClass(idx, s.key)" />
                        <span class="text-sm text-gray-700 dark:text-gray-200">{{ s.label }}</span>
                      </div>
                      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ s.percent }}%</span>
                    </div>
                    <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div class="h-full" :class="sourceBarClass(idx, s.key)" :style="{ width: `${s.percent}%` }" />
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-xl bg-white dark:bg-[#1e293b] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('monthly_performance_summary') }}</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-xs uppercase bg-gray-50 dark:bg-[#2d3b4e] text-gray-700 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3 text-left">{{ $t('month') }}</th>
              <th class="px-6 py-3 text-left">{{ $t('occupancy_header') }}</th>
              <th class="px-6 py-3 text-left">{{ $t('adr_header') }}</th>
              <th class="px-6 py-3 text-left">{{ $t('revpar_header') }}</th>
              <th class="px-6 py-3 text-left">{{ $t('total_revenue') }}</th>
              <th class="px-6 py-3 text-left">{{ $t('bookings') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <template v-if="isLoading">
              <tr>
                <td colspan="6" class="text-center py-10 text-gray-400">
                  <span class="inline-flex items-center gap-2">
                    <span class="material-symbols-outlined animate-spin text-4xl text-blue-600">refresh</span>
                    {{ $t('loading_report') }}
                  </span>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr
                v-for="row in monthlySummary"
                :key="row.month"
                class="hover:bg-gray-50 dark:hover:bg-[#2d3b4e]"
              >
                <td class="px-6 py-4 font-medium">{{ row.month }}</td>
                <td class="px-6 py-4">{{ row.occupancy }}%</td>
                <td class="px-6 py-4">${{ row.adr }}</td>
                <td class="px-6 py-4">${{ row.revpar }}</td>
                <td class="px-6 py-4 font-medium">${{ row.revenue }}</td>
                <td class="px-6 py-4">{{ row.bookings }}</td>
              </tr>

              <tr v-if="!monthlySummary.length">
                <td colspan="6" class="text-center py-10 text-gray-400">
                  {{ $t('no_data') }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import request from '@/util/request'
import ReportsPdfExporter from '@/components/reports/ReportsPdfExporter.vue'

const reportPeriod = ref('month')

const isLoading = ref(false)
const range = ref({ start: '', end: '', days: 0 })
const kpis = ref({
  occupancy_rate: 0,
  adr: 0,
  revpar: 0,
  total_revenue: 0
})
const monthlySummary = ref([])
const reservationsDaily = ref([])
const revenueBySource = ref([])
const reportsPdfExporter = ref(null)

const loadReport = async () => {
  isLoading.value = true
  try {
    const data = await request('/reports', 'GET', { period: reportPeriod.value })
    range.value = data?.range || range.value
    kpis.value = data?.kpis || kpis.value
    monthlySummary.value = data?.monthly_summary || []
    reservationsDaily.value = data?.analytics?.reservations_daily || []
    revenueBySource.value = data?.analytics?.revenue_by_source || []
  } finally {
    isLoading.value = false
  }
}

const revenueSources = computed(() => {
  const list = Array.isArray(revenueBySource.value) ? revenueBySource.value : []
  const total = list.reduce((sum, s) => sum + Number(s.revenue || 0), 0)
  if (!list.length) return []

  return list
    .map(s => {
      const revenue = Number(s.revenue || 0)
      const percent = total > 0 ? Math.round((revenue / total) * 100) : 0
      return {
        key: s.key,
        label: s.label,
        revenue,
        percent
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
})

const sourceChipClass = (idx, key) => {
  if (String(key).toLowerCase() === 'other') return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
  return idx % 2 === 0
    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
}

const sourceDotClass = (idx, key) => {
  if (String(key).toLowerCase() === 'other') return 'bg-gray-500'
  return idx % 2 === 0 ? 'bg-indigo-500' : 'bg-amber-500'
}

const sourceBarClass = (idx, key) => {
  if (String(key).toLowerCase() === 'other') return 'bg-gray-500'
  return idx % 2 === 0 ? 'bg-indigo-500' : 'bg-amber-500'
}

const chartXAxisStart = computed(() => {
  const first = reservationsDaily.value?.[0]
  return first?.label || range.value?.start || ''
})

const chartXAxisEnd = computed(() => {
  const list = reservationsDaily.value || []
  const last = list.length ? list[list.length - 1] : null
  return last?.label || range.value?.end || ''
})

const toPolylinePoints = (values) => {
  const v = Array.isArray(values) ? values : []
  const n = v.length
  if (n < 2) return '0,30 100,30'

  const min = Math.min(...v)
  const max = Math.max(...v)
  const rangeVal = max - min

  const points = v.map((val, i) => {
    const x = (i / (n - 1)) * 100
    const t = rangeVal === 0 ? 0.5 : (val - min) / rangeVal
    const y = 36 - (t * 30)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })

  return points.join(' ')
}

const bookingsPolyline = computed(() => {
  const values = (reservationsDaily.value || []).map(r => Number(r.bookings || 0))
  return toPolylinePoints(values)
})

const revenuePolyline = computed(() => {
  const values = (reservationsDaily.value || []).map(r => Number(r.revenue || 0))
  return toPolylinePoints(values)
})

const exportPdf = () => {
  reportsPdfExporter.value?.exportPdf()
}

watch(reportPeriod, () => {
  loadReport()
}, { immediate: true })
</script>