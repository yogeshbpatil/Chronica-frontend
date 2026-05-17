<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  LayoutDashboard,
  Swords,
  LogOut,
  PanelLeft,
  BookOpen,
  CalendarDays,
  FileText,
  TrendingUp,
  ChevronRight,
} from '@lucide/vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useUiStore } from '@/shared/stores/ui.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const { user } = storeToRefs(authStore)
const { sidebarCollapsed } = storeToRefs(uiStore)

interface NavItem {
  path: string
  label: string
  icon: object
  soon?: boolean
}

const mainNav: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/games', label: 'Chess Games', icon: Swords },
]

const upcomingNav: NavItem[] = [
  { path: '', label: 'Diary', icon: BookOpen, soon: true },
  { path: '', label: 'Holidays', icon: CalendarDays, soon: true },
  { path: '', label: 'Notes', icon: FileText, soon: true },
  { path: '', label: 'Analytics', icon: TrendingUp, soon: true },
]

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
}

const userInitials = computed(() => {
  const name = user.value?.name ?? ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

async function handleLogout() {
  authStore.logout()
  await router.push('/login')
}
</script>

<template>
  <aside
    :class="[
      'h-screen flex flex-col bg-surface-1 border-r border-border shrink-0',
      'transition-all duration-300 ease-in-out overflow-hidden',
      sidebarCollapsed ? 'w-[60px]' : 'w-[240px]',
    ]"
  >
    <!-- Logo & Toggle -->
    <div
      :class="[
        'flex items-center border-b border-border shrink-0 h-14',
        sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-4',
      ]"
    >
      <div v-if="!sidebarCollapsed" class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <Swords :size="14" color="#1A1400" />
        </div>
        <span class="text-sm font-semibold text-text-primary tracking-tight">Chronica</span>
      </div>
      <div v-else class="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
        <Swords :size="14" color="#1A1400" />
      </div>

      <button
        v-if="!sidebarCollapsed"
        class="rounded-lg p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
        @click="uiStore.toggleSidebar"
      >
        <PanelLeft :size="15" />
      </button>
    </div>

    <!-- Toggle when collapsed -->
    <div v-if="sidebarCollapsed" class="flex justify-center pt-2 shrink-0">
      <button
        class="rounded-lg p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
        @click="uiStore.toggleSidebar"
      >
        <ChevronRight :size="15" />
      </button>
    </div>

    <!-- Main Nav -->
    <nav class="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
      <!-- Section label -->
      <p
        v-if="!sidebarCollapsed"
        class="px-2 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-text-tertiary"
      >
        Main
      </p>

      <ul class="space-y-0.5">
        <li v-for="item in mainNav" :key="item.label">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all duration-150 group',
              isActive(item.path)
                ? 'bg-accent-muted text-accent font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-2',
              sidebarCollapsed ? 'justify-center px-0 w-full' : '',
            ]"
            :title="sidebarCollapsed ? item.label : undefined"
          >
            <component
              :is="item.icon"
              :size="16"
              :class="isActive(item.path) ? 'text-accent' : 'text-text-tertiary group-hover:text-text-secondary'"
            />
            <span v-if="!sidebarCollapsed" class="truncate">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>

      <!-- Upcoming -->
      <div class="mt-5">
        <p
          v-if="!sidebarCollapsed"
          class="px-2 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-text-tertiary"
        >
          Coming soon
        </p>
        <div v-if="!sidebarCollapsed" class="w-full h-px bg-border-subtle mb-2" />

        <ul class="space-y-0.5">
          <li v-for="item in upcomingNav" :key="item.label">
            <div
              :class="[
                'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm opacity-40 cursor-default select-none',
                sidebarCollapsed ? 'justify-center px-0' : '',
              ]"
              :title="sidebarCollapsed ? `${item.label} (soon)` : undefined"
            >
              <component :is="item.icon" :size="16" class="text-text-tertiary shrink-0" />
              <span v-if="!sidebarCollapsed" class="truncate text-text-tertiary">
                {{ item.label }}
              </span>
              <span
                v-if="!sidebarCollapsed"
                class="ml-auto text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-3 text-text-disabled"
              >
                Soon
              </span>
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <!-- User Section -->
    <div class="border-t border-border p-2 shrink-0">
      <div
        :class="[
          'flex items-center gap-2.5 rounded-lg p-2',
          sidebarCollapsed ? 'justify-center flex-col gap-1' : '',
        ]"
      >
        <!-- Avatar -->
        <div
          class="w-7 h-7 rounded-full bg-accent-muted border border-accent/30 flex items-center justify-center shrink-0"
        >
          <span class="text-[10px] font-bold text-accent">{{ userInitials }}</span>
        </div>

        <div v-if="!sidebarCollapsed" class="flex-1 min-w-0">
          <p class="text-xs font-medium text-text-primary truncate">{{ user?.name }}</p>
          <p class="text-[10px] text-text-tertiary truncate">{{ user?.email }}</p>
        </div>

        <button
          class="rounded-lg p-1.5 text-text-tertiary hover:text-error hover:bg-error-muted transition-colors shrink-0"
          :title="'Sign out'"
          @click="handleLogout"
        >
          <LogOut :size="14" />
        </button>
      </div>
    </div>
  </aside>
</template>
