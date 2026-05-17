import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function collapseSidebar(): void {
    sidebarCollapsed.value = true
  }

  function expandSidebar(): void {
    sidebarCollapsed.value = false
  }

  return {
    sidebarCollapsed,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
  }
})
