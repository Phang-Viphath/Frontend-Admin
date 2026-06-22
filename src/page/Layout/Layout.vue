<template>
  <div class="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 font-display">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed md:static inset-y-0 left-0 z-40 w-66 flex flex-col bg-white dark:bg-[#1e293b] border-r border-gray-200 dark:border-gray-700 transition-transform duration-300',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center gap-3 px-6 border-b border-gray-200 dark:border-gray-700">
        <div
          class="size-10 rounded-lg bg-cover bg-center bg-no-repeat shadow-sm"
          @click="mobileMenuOpen = false"
          :style="{ backgroundImage: `url(${hotelLogo})` }"
        ></div>
        <div>
          <h1 class="text-lg font-bold leading-tight">Battambang Hotel</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Admin Panel</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <template v-for="item in finalMenuLeft" :key="item.key || item.label">
          <!-- Collapsible Parent: Users -->
          <div v-if="item.isParent">
            <button
              @click="usersOpen = !usersOpen"
              class="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d3b4e] transition-colors"
            >
              <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
              <span class="flex-1 text-left">{{ item.label }}</span>
              <span
                class="material-symbols-outlined text-base transition-transform duration-200"
                :class="{ 'rotate-180': usersOpen }"
              >
                expand_more
              </span>
            </button>

            <div v-show="usersOpen" class="ml-10 mt-1 space-y-1">
              <RouterLink
                v-for="child in item.children"
                :key="child.key"
                :to="child.key"
                @click="mobileMenuOpen = false"
                class="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2d3b4e] transition-colors"
                :class="{ 'bg-[green]/10 text-[green] dark:text-green-400': route.path === child.key }"
              >
                <span class="material-symbols-outlined text-base">{{ child.icon }}</span>
                {{ child.label }}
              </RouterLink>
            </div>
          </div>

          <!-- Normal Menu Item -->
          <RouterLink
            v-else
            :to="item.key"
            @click="mobileMenuOpen = false"
            class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d3b4e] transition-colors"
            :class="{ 'bg-[green]/10 text-[green] dark:text-green-400 hover:bg-[green]/20': route.path === item.key }"
          >
            <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
            {{ item.label }}
          </RouterLink>
        </template>
      </nav>

      <!-- User Profile Dropdown -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-4 relative">
        <div
          ref="userTriggerRef"
          @click="open = !open"
          class="flex items-center gap-3 rounded-lg bg-gray-100 dark:bg-[#2d3b4e] p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#374151] transition-colors"
        >
          <div
            class="size-10 rounded-full bg-cover bg-center bg-no-repeat border-2 border-gray-200 dark:border-gray-600"
            :style="{ backgroundImage: `url(${resolveImageUrl(profile?.profile?.image) || userAvatar})` }"
          ></div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium">{{ profile?.name || 'User' }}</p>
            <p class="truncate text-xs text-gray-500 dark:text-gray-400">
              {{ Array.isArray(roles) ? roles.join(', ') : roles?.name || 'Role' }}
            </p>
          </div>
          <span
            class="material-symbols-outlined text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': open }"
          >
            expand_more
          </span>
        </div>

        <transition name="dropdown">
          <div
            v-if="open"
            ref="dropdownRef"
            class="absolute bottom-full left-4 right-4 mb-2 z-50 rounded-lg bg-white dark:bg-[#1f2937] shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <ul class="py-2 text-sm">
              <li @click="goTo('/profile')" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-[#2d3b4e] cursor-pointer transition-colors">
                <span class="material-symbols-outlined text-[18px] text-gray-500">person</span>
                <span>My Profile</span>
              </li>
              <li @click="goTo('/settings')" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-[#2d3b4e] cursor-pointer transition-colors">
                <span class="material-symbols-outlined text-[18px] text-gray-500">account_circle</span>
                <span>Account Settings</span>
              </li>
              <li class="border-t border-gray-200 dark:border-gray-700 my-1"></li>
              <li @click="handleLogout" class="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer transition-colors">
                <span class="material-symbols-outlined text-[18px]">logout</span>
                <span>Logout</span>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 flex items-center justify-between bg-white dark:bg-[#1e293b] px-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <button
            class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d3b4e] transition-colors"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span class="material-symbols-outlined text-2xl">menu</span>
          </button>
          <div class="hidden md:block">
            <h2 class="text-lg font-semibold capitalize">{{ currentPageTitle }}</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ currentTime }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center rounded-lg bg-gray-100 dark:bg-[#2d3b4e] px-3 py-2 w-72 border border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <span class="material-symbols-outlined text-gray-500 text-xl">search</span>
            <input v-model="headerSearchQuery" type="text" placeholder="Search reservations..." class="ml-2 w-full bg-transparent text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400" />
          </div>

          <div class="flex items-center gap-2">
            <div class="relative" ref="notificationTriggerRef">
              <button class="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d3b4e] transition-colors" aria-label="Notifications" @click="toggleNotifications">
                <span class="material-symbols-outlined text-2xl">notifications</span>
                <span class="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[#1e293b]" v-if="unreadCount > 0"></span>
              </button>
              
              <transition name="dropdown">
                <div v-if="notificationsOpen" ref="notificationDropdownRef" class="absolute right-0 top-full mt-2 w-96 z-50 rounded-xl bg-white dark:bg-[#1f2937] shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <!-- Header -->
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-[#1e293b]">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span class="material-symbols-outlined text-[18px] text-green-500">notifications_active</span>
                      Notifications
                      <span v-if="unreadCount > 0" class="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">{{ unreadCount }}</span>
                    </h3>
                    <div class="flex items-center gap-2">
                      <button v-if="unreadCount > 0" @click="markAllRead" class="text-xs text-green-600 dark:text-green-400 hover:underline" :disabled="isLoadingNotifications">Mark all read</button>
                      <button @click="fetchNotifications" class="flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-200" :disabled="isLoadingNotifications">
                        <span class="material-symbols-outlined text-[18px]" :class="{'animate-spin': isLoadingNotifications}">refresh</span>
                      </button>
                    </div>
                  </div>
                  <!-- Body -->
                  <div class="max-h-96 overflow-y-auto">
                    <div v-if="isLoadingNotifications" class="p-8 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
                      <span class="material-symbols-outlined animate-spin text-2xl text-green-500">progress_activity</span>
                      Loading...
                    </div>
                    <div v-else-if="notifications.length === 0" class="p-8 text-center text-sm text-gray-500 flex flex-col items-center gap-3">
                      <span class="material-symbols-outlined text-4xl text-gray-300">notifications_off</span>
                      <p class="font-medium">No notifications yet</p>
                      <p class="text-xs text-gray-400">Notifications appear here when reservations are created, updated, or cancelled.</p>
                    </div>
                    <ul v-else class="divide-y divide-gray-100 dark:divide-gray-700/60">
                      <li
                        v-for="notif in notifications"
                        :key="notif.id"
                        @click="openAdminChat(notif)"
                        class="flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-[#2d3b4e] transition-colors cursor-pointer"
                        :class="{ 'bg-green-50/60 dark:bg-green-900/10': !notif.is_read }"
                      >
                        <div class="mt-0.5 flex-shrink-0">
                          <span v-if="notif.type === 'reservation'" class="material-symbols-outlined text-[20px] text-green-500">calendar_add_on</span>
                          <span v-else-if="notif.type === 'status_update'" class="material-symbols-outlined text-[20px] text-blue-500">update</span>
                          <span v-else class="material-symbols-outlined text-[20px] text-red-500">cancel</span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex justify-between items-start gap-2">
                            <p class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{{ notif.title }}</p>
                            <span v-if="!notif.is_read" class="flex-shrink-0 size-2 rounded-full bg-red-500 mt-1.5"></span>
                          </div>
                          <p class="text-xs text-gray-500 mt-0.5">{{ relativeTime(notif.created_at) }}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>
            <!-- Help Button & Dropdown -->
            <div class="relative" ref="helpTriggerRef">
              <button
                @click="toggleHelp"
                class="p-2 rounded-lg transition-colors aria-label='Help'"
                :class="helpOpen ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d3b4e]'"
              >
                <span class="material-symbols-outlined text-2xl">help</span>
              </button>

              <transition name="dropdown">
                <div
                  v-if="helpOpen"
                  ref="helpDropdownRef"
                  class="absolute right-0 top-full mt-2 w-80 z-50 rounded-xl bg-white dark:bg-[#1f2937] shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <!-- Header -->
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1e293b] flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px] text-green-500">help_center</span>
                    <h3 class="font-semibold text-sm text-gray-900 dark:text-gray-100">Help &amp; Quick Guide</h3>
                  </div>

                  <!-- Quick Nav -->
                  <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Quick Navigation</p>
                    <div class="grid grid-cols-2 gap-1.5">
                      <button v-for="nav in helpNavItems" :key="nav.path"
                        @click="goTo(nav.path); helpOpen = false"
                        class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d3b4e] transition-colors"
                      >
                        <span class="material-symbols-outlined text-[16px]" :style="{ color: nav.color }">{{ nav.icon }}</span>
                        {{ nav.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Feature Tips -->
                  <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Tips</p>
                    <ul class="space-y-2">
                      <li v-for="tip in helpTips" :key="tip.text" class="flex items-start gap-2">
                        <span class="material-symbols-outlined text-[15px] text-green-500 mt-0.5 flex-shrink-0">{{ tip.icon }}</span>
                        <span class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{{ tip.text }}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Keyboard Shortcuts -->
                  <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Keyboard Shortcuts</p>
                    <div class="space-y-1.5">
                      <div v-for="shortcut in helpShortcuts" :key="shortcut.key" class="flex items-center justify-between">
                        <span class="text-xs text-gray-600 dark:text-gray-400">{{ shortcut.label }}</span>
                        <div class="flex items-center gap-1">
                          <kbd v-for="k in shortcut.keys" :key="k" class="inline-flex items-center rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#2d3b4e] px-1.5 py-0.5 text-[10px] font-mono text-gray-700 dark:text-gray-300">{{ k }}</kbd>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="px-4 py-3 flex items-center justify-between">
                    <span class="text-xs text-gray-400 dark:text-gray-500">v1.0.0 &bull; Battambang Hotel</span>
                    <a href="https://t.me/PHANG_VIPHATH" target="_blank"
                      class="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                      <span class="material-symbols-outlined text-[14px]">support_agent</span>
                      Contact Support
                    </a>
                  </div>
                </div>
              </transition>
            </div>
            <button class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d3b4e] transition-colors">
              <span @click="goTo('/profile')" class="material-symbols-outlined text-2xl">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#0f172a] p-4 md:p-6">
        <RouterView />
      </main>

      <footer class="h-12 flex items-center justify-between bg-white dark:bg-[#1e293b] px-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        <p> 2023 Battambang Hotel. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <span>{{ currentDate }}</span>
          <span class="hidden sm:inline">v1.0.0</span>
        </div>
      </footer>
    </div>
    <ConfirmModal ref="confirmModal" title="Logout" message="Are you sure you want to log out of your account?" confirm-text="Logout" />

    <!-- ===== ADMIN CHAT MODAL ===== -->
    <transition name="admin-chat">
      <div v-if="adminChatOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click.self="closeAdminChat">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeAdminChat"></div>

        <!-- Chat window -->
        <div class="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700" style="max-height: 85vh;">
          <!-- Chat header -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1e2d22] flex-shrink-0">
            <div class="relative flex-shrink-0">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 ring-1 ring-green-200 dark:ring-green-700">
                <img :src="hotelLogo" alt="Hotel Bot" class="h-6 w-6" />
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-[#1e2d22]"></span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Hotel Bot</p>
              <p class="text-xs text-green-600 dark:text-green-400">● Telegram Notification</p>
            </div>
            <button @click="closeAdminChat" class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <!-- Chat body -->
          <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 dark:bg-[#0f172a]">
            <!-- Date divider -->
            <div class="flex items-center gap-2">
              <div class="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
              <span class="text-[10px] text-gray-400 dark:text-white/30 px-2 bg-gray-50 dark:bg-[#0f172a]">{{ adminChatDate }}</span>
              <div class="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
            </div>

            <!-- Bot message bubble -->
            <div class="flex gap-2 items-end">
              <div class="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 ring-1 ring-green-200 dark:ring-green-700">
                <img :src="hotelLogo" alt="Bot" class="h-4 w-4" />
              </div>
              <div class="max-w-[85%]">
                <div class="rounded-2xl rounded-bl-sm bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-green-900/40 px-4 py-3 shadow-sm">
                  <pre class="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap font-sans leading-relaxed">{{ adminChatMessage?.body }}</pre>
                </div>
                <p class="mt-1 text-[10px] text-gray-400 dark:text-white/30 pl-1">{{ adminChatTime }}</p>
              </div>
            </div>
          </div>

          <!-- Chat footer -->
          <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-[#1e293b]">
            <div class="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 px-3 py-2">
              <span class="material-symbols-outlined text-gray-400 dark:text-white/30 text-[18px]">lock</span>
              <span class="flex-1 text-xs text-gray-400 dark:text-white/30">Automated Telegram notification</span>
              <span class="text-[10px] text-gray-400 dark:text-white/30">#{{ adminChatMessage?.reservation_id }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- ===== END ADMIN CHAT MODAL ===== -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, provide, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProfileStore } from '@/util/profile'
import { formatDate, formatTime } from '@/util/helpers'
import hotelLogo from '../../assets/Hotel_icon.png'
import userAvatar from '../../assets/user_avatar.png'
import { resolveImageUrl } from '@/util/image'

import request from '../../util/request'
import ConfirmModal from '../../components/ConfirmModalLogout.vue'

const router = useRouter()
const route = useRoute()
const profileStore = useProfileStore()

const profile = computed(() => profileStore.profile)
const token = computed(() => profileStore.token)
const roles = computed(() => profileStore.roles)

// UI States
const mobileMenuOpen = ref(false)
const usersOpen = ref(false)
const open = ref(false)
const userTriggerRef = ref(null)
const dropdownRef = ref(null)
const confirmModal = ref(null)

// Notifications States
const notificationsOpen = ref(false)
const notifications = ref([])
const isLoadingNotifications = ref(false)
const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)
const notificationTriggerRef = ref(null)
const notificationDropdownRef = ref(null)

const headerSearchQuery = ref('')
provide('reservationsSearchQuery', headerSearchQuery)

// Time
const now = ref(new Date())
const currentTime = computed(() => formatTime(now.value))
const currentDate = computed(() => formatDate(now.value))
const year = computed(() => now.value.getFullYear())

const currentPageTitle = computed(() => {
  const segment = route.path.split('/').filter(Boolean).pop() || 'dashboard'
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
})

// ==================== NOTIFICATIONS LOGIC ====================
const fetchNotifications = async () => {
  isLoadingNotifications.value = true
  try {
    const data = await request('/notifications', 'GET')
    notifications.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.warn('Failed to fetch notifications:', err)
  } finally {
    isLoadingNotifications.value = false
  }
}

const markRead = async (notif) => {
  if (notif.is_read) return
  try {
    await request(`/notifications/${notif.id}/mark-read`, 'POST')
    notif.is_read = true
  } catch (err) {
    console.warn('Failed to mark notification as read:', err)
  }
}

const markAllRead = async () => {
  try {
    await request('/notifications/mark-all-read', 'POST')
    notifications.value.forEach(n => { n.is_read = true })
  } catch (err) {
    console.warn('Failed to mark all as read:', err)
  }
}

const toggleNotifications = async () => {
  notificationsOpen.value = !notificationsOpen.value
  if (notificationsOpen.value) {
    open.value = false
    await fetchNotifications()
  }
}

const relativeTime = (dateStr) => {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(dateStr).toLocaleDateString()
}

// ==================== ADMIN CHAT MODAL ====================
const adminChatOpen = ref(false)
const adminChatMessage = ref(null)

const adminChatDate = computed(() => {
  if (!adminChatMessage.value?.created_at) return ''
  return new Date(adminChatMessage.value.created_at).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})

const adminChatTime = computed(() => {
  if (!adminChatMessage.value?.created_at) return ''
  return new Date(adminChatMessage.value.created_at).toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit'
  })
})

const openAdminChat = async (notif) => {
  adminChatMessage.value = notif
  adminChatOpen.value = true
  notificationsOpen.value = false
  // Mark as read on the server too
  if (!notif.is_read) {
    try {
      await request(`/notifications/${notif.id}/mark-read`, 'POST')
      notif.is_read = true
    } catch { /* silent */ }
  }
}

const closeAdminChat = () => {
  adminChatOpen.value = false
  adminChatMessage.value = null
}
// ==================== END ADMIN CHAT MODAL ====================

// ==================== HELP PANEL ====================
const helpOpen = ref(false)
const helpTriggerRef = ref(null)
const helpDropdownRef = ref(null)

const toggleHelp = () => {
  helpOpen.value = !helpOpen.value
  if (helpOpen.value) {
    open.value = false
    notificationsOpen.value = false
  }
}

const helpNavItems = [
  { path: '/dashboard',    label: 'Dashboard',    icon: 'dashboard',      color: '#6366f1' },
  { path: '/reservations', label: 'Reservations', icon: 'calendar_month', color: '#0ea5e9' },
  { path: '/rooms',        label: 'Rooms',        icon: 'bed',            color: '#f59e0b' },
  { path: '/guests',       label: 'Guests',       icon: 'groups',         color: '#10b981' },
  { path: '/reports',      label: 'Reports',      icon: 'analytics',      color: '#8b5cf6' },
  { path: '/settings',     label: 'Settings',     icon: 'settings',       color: '#64748b' },
]

const helpTips = [
  { icon: 'search',           text: 'Use the search bar to quickly find reservations by guest name or ID.' },
  { icon: 'notifications',    text: 'Click the bell icon to see Telegram reservation notifications.' },
  { icon: 'print',            text: 'Open any reservation and click Print Invoice to generate a PDF.' },
  { icon: 'dark_mode',        text: 'Toggle dark mode using the moon icon in the top toolbar.' },
  { icon: 'admin_panel_settings', text: 'Manage roles and permissions under the Users menu.' },
]

const helpShortcuts = [
  { label: 'Go to Dashboard',    keys: ['Alt', 'D'] },
  { label: 'Go to Reservations', keys: ['Alt', 'R'] },
  { label: 'Toggle Sidebar',     keys: ['Alt', 'S'] },
  { label: 'Logout',             keys: ['Alt', 'Q'] },
]
// ==================== END HELP PANEL ====================

// ==================== MENU CONFIG & PERMISSION FILTER ====================

// Menu configuration with router names
const menuConfig = [
  { key: '/dashboard', label: 'Dashboard', icon: 'dashboard', name: 'Dashboard' },
  { key: '/reservations', label: 'Reservations', icon: 'calendar_month', name: 'Reservations' },
  { key: '/rooms', label: 'Rooms', icon: 'bed', name: 'Rooms' },
  { key: '/guests', label: 'Guests', icon: 'groups', name: 'Guests' },
  { key: '/historys', label: 'Historys', icon: 'group', name: 'Historys' },
  { key: '/reports', label: 'Reports', icon: 'analytics', name: 'Reports' },
  { key: '/user', label: 'User', icon: 'person', parent: 'users', name: 'User' },
  { key: '/users_roles', label: 'Users_Roles', icon: 'badge', parent: 'users', name: 'Users_Roles' },
  { key: '/role', label: 'Role', icon: 'admin_panel_settings', parent: 'users', name: 'Role' },
  { key: '/permission', label: 'Permission', icon: 'shield', parent: 'users', name: 'Permission' },
  { key: '/permission_roles', label: 'Permission_Roles', icon: 'shield', parent: 'users', name: 'Permission_Roles' },
  { key: '/settings', label: 'Settings', icon: 'settings', name: 'Settings' },
]

// Get permissions from store
const permissions = computed(() => {
  const perms = profileStore.permissions || []
  return Array.isArray(perms) ? perms : []
})

// Check if user can access a route
const canAccessRoute = (routeName) => {
  if (!routeName) return false
  
  const userRole = profile.value?.role || ''
  const isSuperAdmin = userRole === 'super-admin'
  
  if (isSuperAdmin) return true
  
  const routePermissionMap = {
    'Dashboard': 'Dashboard.View',
    'Reservations': 'Reservations.View',
    'Rooms': 'Rooms.View',
    'Guests': 'Guests.View',
    'Historys': 'Historys.View',
    'Finance': 'Finance.View',
    'Reports': 'Reports.View',
    'User': 'User.View',
    'Users_Roles': 'Users_Roles.View',
    'Role': 'Role.View',
    'Permission_Roles': 'Permission_Roles.View',
    'Permission': 'Permission.View',
    'Settings': 'Settings.View'
  }
  
  const requiredPermission = routePermissionMap[routeName]
  if (!requiredPermission) return false
  
  return permissions.value.includes(requiredPermission)
}

// Filter allowed menu items
const allowedMenuItems = computed(() => {
  const userRole = profile.value?.role || ''
  const isSuperAdmin = userRole === 'super-admin'
  
  if (isSuperAdmin) {
    return menuConfig
  }
  
  return menuConfig.filter(item => {
    // Check permission for other routes
    return canAccessRoute(item.name)
  })
})

// Build final menu structure
const finalMenuLeft = computed(() => {
  const items = allowedMenuItems.value

  const mainItems = items.filter(item => !item.parent && item.key !== '/settings')
  const userSubItems = items.filter(item => item.parent === 'users')
  const settingsItem = items.find(item => item.key === '/settings')

  const menu = [...mainItems]

  // Add Users collapsible if any submenu exists
  if (userSubItems.length > 0) {
    menu.push({
      key: 'users-parent',
      label: 'Users',
      icon: 'manage_accounts',
      isParent: true,
      children: userSubItems
    })
  }

  // Add Settings at the bottom
  if (settingsItem) {
    menu.push(settingsItem)
  }

  return menu
})

// ==================== END MENU LOGIC ====================

const goTo = (path) => {
  open.value = false
  notificationsOpen.value = false
  mobileMenuOpen.value = false
  router.push(path)
}

const handleLogout = async () => {
  const confirmed = await confirmModal.value?.open()
  open.value = false
  if (!confirmed) return
  try {
    await request('/logout', 'POST')
  } catch (err) {
    console.warn('Logout failed:', err)
  } finally {
    profileStore.logout()
    router.replace('/login')
  }
}

const handleClickOutside = (event) => {
  // Handle user profile dropdown click outside
  if (
    open.value &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target) &&
    userTriggerRef.value &&
    !userTriggerRef.value.contains(event.target)
  ) {
    open.value = false
  }

  // Handle notification dropdown click outside
  if (
    notificationsOpen.value &&
    notificationDropdownRef.value &&
    !notificationDropdownRef.value.contains(event.target) &&
    notificationTriggerRef.value &&
    !notificationTriggerRef.value.contains(event.target)
  ) {
    notificationsOpen.value = false
  }

  // Handle help dropdown click outside
  if (
    helpOpen.value &&
    helpDropdownRef.value &&
    !helpDropdownRef.value.contains(event.target) &&
    helpTriggerRef.value &&
    !helpTriggerRef.value.contains(event.target)
  ) {
    helpOpen.value = false
  }
}

onMounted(() => {
  if (!token.value) {
    router.replace('/login')
    return
  }

  const timer = setInterval(() => {
    now.value = new Date()
  }, 60000)

  document.addEventListener('click', handleClickOutside)

  return () => {
    clearInterval(timer)
    document.removeEventListener('click', handleClickOutside)
  }
})

watch(
  () => route.path,
  (path) => {
    if (!path?.startsWith('/reservations')) {
      headerSearchQuery.value = ''
    }
  }
)

watch(
  () => headerSearchQuery.value,
  (val, oldVal) => {
    const prevHadSearch = typeof oldVal === 'string' && oldVal.trim().length > 0
    const nowHasSearch = typeof val === 'string' && val.trim().length > 0

    if (!prevHadSearch && nowHasSearch) {
      if (!route.path?.startsWith('/reservations')) {
        router.push('/reservations')
      }
      return
    }

    if (prevHadSearch && !nowHasSearch) {
      if (route.path !== '/dashboard') {
        router.push('/dashboard')
      }
    }
  }
)
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

.admin-chat-enter-active,
.admin-chat-leave-active {
  transition: opacity 200ms ease;
}
.admin-chat-enter-active > div:last-child,
.admin-chat-leave-active > div:last-child {
  transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease;
}
.admin-chat-enter-from,
.admin-chat-leave-to {
  opacity: 0;
}
.admin-chat-enter-from > div:last-child,
.admin-chat-leave-to > div:last-child {
  opacity: 0;
  transform: translateY(24px) scale(0.95);
}
</style>