<template>
  <Modal :isOpen="isOpen" @close="$emit('close')" :title="$t('delete_user')">
    <div class="space-y-4">
      <p class="text-gray-600 dark:text-gray-300" v-html="$t('delete_user_confirm', { name: user?.name })">
      </p>
      <p class="text-sm text-red-600 dark:text-red-400">
        {{ $t('delete_user_warning') }}
      </p>
      
      <div class="flex justify-end gap-2 pt-4">
        <button 
          type="button" 
          @click="$emit('close')" 
          class="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {{ $t('cancel') }}
        </button>
        <button 
          @click="confirmDelete" 
          :disabled="loading"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {{ loading ? $t('deleting') : $t('delete_user_btn') }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'
import request from '@/util/request'
import { showToast } from '@/util/toast'
import Modal from './ModalUser.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps(['isOpen', 'user'])
const emit = defineEmits(['close', 'confirmed'])

const loading = ref(false)

const confirmDelete = async () => {
  loading.value = true
  try {
    await request(`/users/${props.user.id}`, 'DELETE')
    showToast(t('user_deleted_successfully'), 'success')
    emit('confirmed')
  } catch (error) {
    console.error('Delete user error:', error)
    const message = error.response?.data?.message || t('failed_to_delete_user')
    showToast(message, 'error')
  } finally {
    loading.value = false
  }
}
</script>