<template>
  <div class="space-y-6">
    <!-- ================= HEADER ================= -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Role</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage user roles, permissions, and access levels
        </p>
      </div>

      <button
        @click="openAddModal"
        :disabled="isLoading || isSaving"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        <span class="material-symbols-outlined">add</span>
        Add New Role
      </button>
    </div>

    <!-- ================= FILTER ================= -->
    <div class="bg-white dark:bg-[#1e293b] p-4 rounded-xl border dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search role name or code..."
            :disabled="isLoading || isSaving"
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <select v-model="statusFilter" :disabled="isLoading || isSaving" class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50 disabled:cursor-not-allowed">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select v-model="sortBy" :disabled="isLoading || isSaving" class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-50 disabled:cursor-not-allowed">
          <option value="name">Sort by Name</option>
          <option value="created_at">Sort by Created Date</option>
        </select>
      </div>
    </div>

    <!-- ================= TABLE ================= -->
    <div class="bg-white dark:bg-[#1e293b] rounded-xl border dark:border-gray-700 overflow-hidden">
      <!-- Table Header (with inline loading state) -->
      <div v-if="isLoading" class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end bg-gray-50/50 dark:bg-[#2d3b4e]/50">
        <span class="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
          <span class="material-symbols-outlined animate-spin text-[16px] text-blue-600">progress_activity</span>
          Loading roles...
        </span>
      </div>

      <!-- Filter & Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-[#2d3b4e] text-gray-600 dark:text-gray-300">
            <tr>
              <th class="px-6 py-4 text-left">ID</th>
              <th class="px-6 py-4 text-left">Name</th>
              <th class="px-6 py-4 text-left">Code</th>
              <th class="px-6 py-4 text-left">Description</th>
              <th class="px-6 py-4 text-left">Status</th>
              <th class="px-6 py-4 text-left">Created</th>
              <th class="px-6 py-4 text-left">Updated</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-gray-700">
            <!-- Skeleton Rows -->
            <template v-if="isLoading">
              <tr v-for="i in 5" :key="`sk-${i}`" class="animate-pulse bg-white dark:bg-[#1e293b]">
                <td class="px-6 py-4"><div class="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td class="px-6 py-4"><div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td class="px-6 py-4"><div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td class="px-6 py-4"><div class="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                <td class="px-6 py-4"><div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
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

            <!-- Actual Rows -->
            <template v-else>
              <tr
                v-for="role in filteredRoles"
                :key="role.id"
                class="hover:bg-gray-50 dark:hover:bg-[#2d3b4e] transition-colors"
                :class="{'opacity-50 pointer-events-none': isSaving && selectedRole?.id === role.id}"
              >
                <td class="px-6 py-4 text-xs font-mono text-gray-500">{{ role.id }}</td>
                <td class="px-6 py-4 font-medium">{{ role.name }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 bg-gray-100 dark:bg-[#3d4b5e] rounded text-xs font-mono">
                    {{ role.code }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-600 dark:text-gray-300 truncate max-w-xs">
                  {{ role.description || 'No description' }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="role.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'"
                    class="px-3 py-1 rounded-full text-xs capitalize"
                  >
                    {{ role.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div>{{ formatDate(role.created_at) }}</div>
                  <div class="text-xs text-gray-400">{{ formatTime(role.created_at) }}</div>
                </td>
                <td class="px-6 py-4">
                  <div>{{ formatDate(role.updated_at) }}</div>
                  <div class="text-xs text-gray-400">{{ formatTime(role.updated_at) }}</div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="openEditModal(role)"
                      :disabled="isLoading || isSaving"
                      class="p-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-[#406292] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      @click="openDeleteModal(role)"
                      :disabled="isLoading || isSaving"
                      class="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-[#774b3d] rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span class="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredRoles.length">
                <td colspan="8" class="text-center py-16">
                  <div class="flex flex-col items-center justify-center">
                    <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">admin_panel_settings</span>
                    <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">No roles found</p>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div v-if="!isLoading && filteredRoles.length > 0" class="flex justify-between items-center px-6 py-4 border-t dark:border-gray-700 bg-gray-50/50 dark:bg-[#2d3b4e]/50">
        <p class="text-sm text-gray-500">Total: {{ totalRoles }} roles</p>
      </div>
    </div>

    <!-- ================= MODALS ================= -->
    <AddRoleModal :isOpen="showAddModal" @close="closeAllModals" @created="refreshRoles" />
    <EditRoleModal :isOpen="showEditModal" :role="selectedRole" @close="closeAllModals" @updated="refreshRoles" />
    <DeleteRoleModal :isOpen="showDeleteModal" :role="selectedRole" :actionType="actionType" @close="closeAllModals" @confirmed="refreshRoles" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import request from '@/util/request'
import { formatDate, formatTime } from '@/util/helpers'
import AddRoleModal from '@/components/role/AddRoleModal.vue'
import EditRoleModal from '@/components/role/EditRoleModal.vue'
import DeleteRoleModal from '@/components/role/DeleteRoleModal.vue'

/* ================= STATE ================= */
const roles = ref([])
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('name')

/* ================= MODALS ================= */
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedRole = ref(null)
const actionType = ref('delete')
const isLoading = ref(true)
const isSaving = ref(false)

/* ================= DATA FETCHING ================= */

const fetchRoles = async () => {
  isLoading.value = true
  try {
    const data = await request('/role', 'GET')
    roles.value = data.map(r => ({
      ...r,
      status: r.status === 1 ? 'active' : 'inactive'
    }))
  } catch (err) {
    console.error('Failed to load roles', err)
  } finally {
    isLoading.value = false
  }
}

const refreshRoles = () => {
  fetchRoles()
  closeAllModals()
}

// Initial fetch
fetchRoles()

/* ================= COMPUTED ================= */
const filteredRoles = computed(() => {
  let list = [...roles.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q)
    )
  }

  if (statusFilter.value !== 'all') {
    list = list.filter(r => r.status === statusFilter.value)
  }

  list.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    }
    return new Date(b.created_at) - new Date(a.created_at)
  })

  return list
})

const totalRoles = computed(() => filteredRoles.value.length)

/* ================= METHODS ================= */
const openAddModal = () => { showAddModal.value = true }
const openEditModal = (role) => {
  selectedRole.value = role
  showEditModal.value = true
}
const openDeleteModal = (role) => {
  selectedRole.value = role
  showDeleteModal.value = true
}
const closeAllModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  selectedRole.value = null
}
</script>