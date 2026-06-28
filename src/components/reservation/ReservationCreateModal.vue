<template>
  <div
    class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl transform transition-all scale-100"
      @click.stop
    >
      <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ $t('create_new_reservation') }}</h3>
      </div>

      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ $t('guest_label') }}</label>
            <select
              :value="form.guest_id"
              @input="$emit('update:form', 'guest_id', $event.target.value)"
              :disabled="isLoadingGuests || isSaving"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="" disabled>{{ isLoadingGuests ? $t('loading_guests') : $t('select_guest') }}</option>
              <option v-for="guest in guests" :key="guest.id" :value="guest.id">
                {{ guest.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ $t('room_label') }}</label>
            <select
              :value="form.room_id"
              @input="$emit('update:form', 'room_id', $event.target.value)"
              :disabled="isLoadingRooms || isSaving"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="" disabled>{{ isLoadingRooms ? $t('loading_rooms') : form.check_in && form.check_out ? $t('select_available_room') : $t('select_room') }}</option>
              <option 
                v-for="room in availableRooms" 
                :key="room.id" 
                :value="room.id"
              >
                {{ room.number }} — {{ room.type }}
              </option>
            </select>
            <p v-if="form.check_in && form.check_out && availableRooms.length === 0" 
               class="text-xs text-orange-500 dark:text-orange-400 mt-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">info</span>
              {{ $t('no_available_rooms') }}
            </p>
            <p v-if="!form.check_in || !form.check_out" 
               class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ $t('select_dates_hint') }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ $t('check_in_date') }}</label>
            <input
              type="date"
              :value="form.check_in"
              @input="$emit('update:form', 'check_in', $event.target.value)"
              :disabled="isSaving"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:opacity-60"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ $t('check_out_date') }}</label>
            <input
              type="date"
              :value="form.check_out"
              @input="$emit('update:form', 'check_out', $event.target.value)"
              :disabled="isSaving"
              class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ $t('status_header') }}</label>
          <select
            :value="form.status"
            @input="$emit('update:form', 'status', $event.target.value)"
            :disabled="isSaving"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:opacity-60"
          >
            <option value="Pending">{{ $t('pending') }}</option>
            <option value="Confirmed">{{ $t('confirmed') }}</option>
            <option value="Checked In">{{ $t('checked_in_status') }}</option>
            <option value="Checked Out">{{ $t('checked_out_status') }}</option>
            <option value="Cancelled">{{ $t('cancelled') }}</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-3 px-6 py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-900/50 rounded-b-2xl">
        <button
          type="button"
          class="px-5 py-2.5 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition disabled:opacity-50"
          @click="$emit('close')"
          :disabled="isSaving"
        >
          {{ $t('cancel') }}
        </button>
        <button
          type="button"
          class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm"
          @click="$emit('submit')"
          :disabled="isSaving || !isValid"
        >
          <span v-if="isSaving" class="animate-spin material-symbols-outlined">refresh</span>
          {{ isSaving ? $t('creating') : $t('create_reservation') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  form: Object,
  guests: Array,
  rooms: Array,
  reservations: Array,
  isLoadingGuests: Boolean,
  isLoadingRooms: Boolean,
  isSaving: Boolean,
  isValid: Boolean
})

defineEmits(['update:form', 'submit', 'close'])

const isRoomAvailable = (roomId) => {
  if (!props.form.check_in || !props.form.check_out) {
    return true
  }

  const checkIn = new Date(props.form.check_in)
  const checkOut = new Date(props.form.check_out)

  if (checkIn >= checkOut) {
    return false
  }

  const hasOverlap = props.reservations.some(reservation => {
    if (reservation.status === 'cancelled') {
      return false
    }

    if (reservation.raw?.room?.id !== roomId) {
      return false
    }

    const resCheckIn = new Date(reservation.checkIn)
    const resCheckOut = new Date(reservation.checkOut)

    return (
      (checkIn >= resCheckIn && checkIn < resCheckOut) ||
      (checkOut > resCheckIn && checkOut <= resCheckOut) ||
      (checkIn <= resCheckIn && checkOut >= resCheckOut)
    )
  })

  return !hasOverlap
}

const availableRooms = computed(() => {
  const availableStatusRooms = (props.rooms || []).filter(room => 
    room.status === 'available'
  )

  if (!props.form.check_in || !props.form.check_out) {
    return availableStatusRooms
  }

  return availableStatusRooms.filter(room => isRoomAvailable(room.id))
})
</script>
