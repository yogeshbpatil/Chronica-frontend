import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginDTO, RegisterDTO } from '@/shared/types/auth.types'
import { authService } from '@/shared/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const currentUserId = computed(() => user.value?.id ?? null)

  function initialize(): void {
    const session = authService.getSession()
    if (session) {
      user.value = session.user
      token.value = session.token
    }
    isInitialized.value = true
  }

  async function login(dto: LoginDTO): Promise<void> {
    const session = await authService.login(dto)
    user.value = session.user
    token.value = session.token
  }

  async function register(dto: RegisterDTO): Promise<void> {
    const session = await authService.register(dto)
    user.value = session.user
    token.value = session.token
  }

  function logout(): void {
    authService.logout()
    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    currentUserId,
    isInitialized,
    initialize,
    login,
    register,
    logout,
  }
})
