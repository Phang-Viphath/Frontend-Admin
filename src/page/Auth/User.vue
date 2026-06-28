<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ $t('users_title') }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ $t('manage_users') }}
        </p>
      </div>

      <button
        @click="openAddModal"
        :disabled="isLoading || isSaving"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        <span class="material-symbols-outlined">add</span>
        {{ $t('add_new_user') }}
      </button>
    </div>

    <div class="bg-white dark:bg-[#1e293b] p-4 rounded-xl border dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
            person
          </span>
          <input
            v-model="nameQuery"
            type="text"
            :placeholder="$t('search_name')"
            :disabled="isLoading || isSaving"
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
            mail
          </span>
          <input
            v-model="emailQuery"
            type="text"
            :placeholder="$t('search_email')"
            :disabled="isLoading || isSaving"
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <select
          v-model="emailVerifiedFilter"
          :disabled="isLoading || isSaving"
          class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">{{ $t('all_verification_status') }}</option>
          <option value="verified">{{ $t('verified') }}</option>
          <option value="unverified">{{ $t('unverified') }}</option>
        </select>

        <select
          v-model="sortBy"
          :disabled="isLoading || isSaving"
          class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="name">{{ $t('sort_by_name') }}</option>
          <option value="email">{{ $t('sort_by_email') }}</option>
          <option value="created_at">{{ $t('sort_by_created_date') }}</option>
          <option value="updated_at">{{ $t('sort_by_updated_date') }}</option>
        </select>
      </div>
    </div>

    <div class="bg-white dark:bg-[#1e293b] rounded-xl border dark:border-gray-700 overflow-hidden">
      <div v-if="isLoading" class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end bg-gray-50/50 dark:bg-[#2d3b4e]/50">
        <span class="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span class="material-symbols-outlined animate-spin text-[16px] text-blue-600">progress_activity</span>
          {{ $t('loading_users') }}
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-[#2d3b4e] text-gray-600 dark:text-gray-300">
            <tr>
              <th class="px-6 py-4 text-left">{{ $t('id') }}</th>
              <th class="px-6 py-4 text-left">{{ $t('name_header') }}</th>
              <th class="px-6 py-4 text-left">{{ $t('email') }}</th>
              <th class="px-6 py-4 text-left">{{ $t('email_verified') }}</th>
              <th class="px-6 py-4 text-left">{{ $t('created') }}</th>
              <th class="px-6 py-4 text-left">{{ $t('updated') }}</th>
              <th class="px-6 py-4 text-center">{{ $t('actions') }}</th>
            </tr>
          </thead>

          <tbody class="divide-y dark:divide-gray-700">
            <template v-if="isLoading">
              <tr v-for="i in 5" :key="`sk-${i}`" class="animate-pulse bg-white dark:bg-[#1e293b]">
                <td class="px-6 py-4"><div class="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                    <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </td>
                <td class="px-6 py-4"><div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td class="px-6 py-4"><div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
                <td class="px-6 py-4">
                  <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                  <div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center gap-2">
                    <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-else-if="!filteredUsers.length">
              <td colspan="7" class="text-center py-16">
                <div class="flex flex-col items-center justify-center">
                  <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">group_off</span>
                  <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">{{ $t('no_users_found') }}</p>
                </div>
              </td>
            </tr>

            <template v-else>
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
                class="hover:bg-gray-50 dark:hover:bg-[#2d3b4e] transition-colors"
                :class="{'opacity-50 pointer-events-none': isSaving && selectedUser?.id === user.id}"
              >
                <td class="px-6 py-4 text-xs font-mono text-gray-500">
                  {{ user.id }}
                </td>

                <td class="px-6 py-4 font-medium">
                  <div class="flex items-center gap-3">
                    <img
                      :src="getUserAvatar(user)"
                      class="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                      alt="avatar"
                      @error="onAvatarError"
                    />
                    <span>{{ user.name }}</span>
                  </div>
                </td>

                <td class="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {{ user.email }}
                </td>

                <td class="px-6 py-4">
                  <span
                    :class="user.email_verified_at
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'"
                    class="px-3 py-1 rounded-full text-xs capitalize"
                  >
                    {{ user.email_verified_at ? $t('verified') : $t('unverified') }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <div>{{ formatDate(user.created_at) }}</div>
                  <div class="text-xs text-gray-400">
                    {{ formatTime(user.created_at) }}
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div>{{ formatDate(user.updated_at) }}</div>
                  <div class="text-xs text-gray-400">
                    {{ formatTime(user.updated_at) }}
                  </div>
                </td>

                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="openEditModal(user)"
                      :disabled="isLoading || isSaving"
                      class="p-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-[#406292] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span class="material-symbols-outlined">edit</span>
                    </button>

                    <button
                      @click="openDeleteModal(user)"
                      :disabled="isLoading || isSaving"
                      class="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-[#774b3d] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span class="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div v-if="!isLoading && filteredUsers.length > 0" class="flex justify-between items-center px-6 py-4 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-[#2d3b4e]/50">
        <p class="text-sm text-gray-500">
          {{ $t('total_users', { total: totalUsers }) }}
        </p>
      </div>
    </div>

    <AddUserModal
      :isOpen="showAddModal"
      @close="closeAllModals"
      @created="refreshUsers"
    />

    <EditUserModal
      :isOpen="showEditModal"
      :user="selectedUser"
      @close="closeAllModals"
      @updated="refreshUsers"
    />

    <DeleteUserModal
      :isOpen="showDeleteModal"
      :user="selectedUser"
      @close="closeAllModals"
      @confirmed="refreshUsers"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import request from '@/util/request'
import { formatDate, formatTime } from '@/util/helpers'
import { showToast } from '@/util/toast'
import AddUserModal from '@/components/user/AddUserModal.vue'
import EditUserModal from '@/components/user/EditUserModal.vue'
import DeleteUserModal from '@/components/user/DeleteUserModal.vue'
import configurl from '@/util/configurl'
import userAvatar from '@/assets/user_avatar.png'
import { resolveImageUrl } from '@/util/image'

/* ================= STATE ================= */
const users = ref([])
const nameQuery = ref('')
const emailQuery = ref('')
const emailVerifiedFilter = ref('all')
const sortBy = ref('name')

const isLoading = ref(true)
const isSaving = ref(false)

/* ================= MODALS ================= */
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

const selectedUser = ref(null)

/* ================= DATA FETCHING ================= */
const fetchUsers = async () => {
  isLoading.value = true
  try {
    const data = await request('/users', 'GET')
    users.value = data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    showToast('Failed to load users', 'error')
  } finally {
    isLoading.value = false
  }
}

fetchUsers()

/* ================= COMPUTED ================= */
const filteredUsers = computed(() => {
  let list = [...users.value]

  if (nameQuery.value) {
    const q = nameQuery.value.toLowerCase()
    list = list.filter(u => u.name?.toLowerCase().includes(q))
  }

  if (emailQuery.value) {
    const q = emailQuery.value.toLowerCase()
    list = list.filter(u => u.email?.toLowerCase().includes(q))
  }

  if (emailVerifiedFilter.value !== 'all') {
    const isVerified = emailVerifiedFilter.value === 'verified'
    list = list.filter(u => !!u.email_verified_at === isVerified)
  }

  list.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name?.localeCompare(b.name || '') || 0
      case 'email':
        return a.email?.localeCompare(b.email || '') || 0
      case 'created_at':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'updated_at':
        return new Date(b.updated_at) - new Date(a.updated_at)
      default:
        return 0
    }
  })

  return list
})

const totalUsers = computed(() => filteredUsers.value.length)

/* ================= METHODS ================= */
const openAddModal = () => showAddModal.value = true

const openEditModal = (user) => {
  selectedUser.value = user
  showEditModal.value = true
}

const openDeleteModal = (user) => {
  selectedUser.value = user
  showDeleteModal.value = true
}

const closeAllModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  selectedUser.value = null
}

const refreshUsers = () => {
  fetchUsers()
  closeAllModals()
}

const getUserAvatar = (user) => {
  const image = user?.profile?.image
  const resolved = resolveImageUrl(image)
  if (resolved) return resolved
  return userAvatar
}

const onAvatarError = (e) => {
  e.target.src = userAvatar
}
</script>