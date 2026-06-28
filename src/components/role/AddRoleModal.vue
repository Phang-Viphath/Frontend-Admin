<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="fixed inset-0 bg-black/50" @click="closeModal"></div>
    
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-md transform rounded-xl bg-white dark:bg-[#1e293b] shadow-xl transition-all">
        <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('add_new_role') }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('add_new_role_desc') }}</p>
          </div>
          <button @click="closeModal" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('role_name') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              :placeholder="$t('role_name_placeholder')"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('role_code') }} <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.code"
              type="text"
              required
              class="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              :placeholder="$t('role_code_placeholder')"
            />
            <p v-if="errors.code" class="mt-1 text-sm text-red-600">{{ errors.code }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('description') }}
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
              :placeholder="$t('role_desc_placeholder')"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('permissions') }}
            </label>
            <div class="space-y-2 max-h-60 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div v-for="permission in permissionOptions" :key="permission.id" class="flex items-center">
                <input
                  :id="`permission-${permission.id}`"
                  v-model="selectedPermissions"
                  :value="permission.id"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label :for="`permission-${permission.id}`" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  {{ permission.name }}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('status_header') }}
            </label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="active"
                  class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('active') }}</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="inactive"
                  class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ $t('inactive') }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {{ $t('cancel') }}
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('creating') }}
              </span>
              <span v-else>{{ $t('create_role') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import request from '@/util/request.js'
import { showToast } from '@/util/toast'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])

const formData = ref({
  name: '',
  code: '',
  description: '',
  status: 'active'
})

const selectedPermissions = ref([])
const permissionOptions = ref([])
const errors = ref({})
const isSubmitting = ref(false)

const resetForm = () => {
  formData.value = {
    name: '',
    code: '',
    description: '',
    status: 'active'
  }
  selectedPermissions.value = []
  errors.value = {}
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const submitForm = async () => {
  isSubmitting.value = true
  errors.value = {}

  try {
    const payload = {
      name: formData.value.name.trim(),
      code: formData.value.code.trim().toUpperCase(),
      description: formData.value.description?.trim() || null,
      status: formData.value.status === 'active' ? 1 : 0,
      permissions: selectedPermissions.value
    }

    console.log('Submitting role:', payload)

    const response = await request('/role', 'POST', payload)
    console.log('Role created:', response)
    
    emit('created')
    closeModal()
    showToast(t('role_created_successfully'), 'success')    
  } catch (error) {
    console.error('Full error object:', error)
    
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
      console.log('Validation errors:', errors.value)
    } 
    else if (error.response?.data?.message) {
      showToast(error.response.data.message, 'error')
    } 
    else if (error.message) {
      showToast(`${t('network_error')}: ${error.message}`, 'error')
    } 
    else {
      showToast(t('role_create_failed'), 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetForm()
  }
})
</script>