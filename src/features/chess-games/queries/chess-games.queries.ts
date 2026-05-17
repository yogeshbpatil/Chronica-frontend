import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/shared/stores/auth.store'
import { chessGamesApi } from '../api/chess-games.api'
import { QUERY_KEYS } from '@/shared/constants/app.constants'

export function useGamesQuery() {
  const authStore = useAuthStore()
  const { currentUserId } = storeToRefs(authStore)

  return useQuery({
    queryKey: computed(() => [QUERY_KEYS.CHESS_GAMES, currentUserId.value]),
    queryFn: () => chessGamesApi.list(currentUserId.value!),
    enabled: computed(() => !!currentUserId.value),
  })
}

export function useGameQuery(id: Ref<string | undefined>) {
  const authStore = useAuthStore()
  const { currentUserId } = storeToRefs(authStore)

  return useQuery({
    queryKey: computed(() => [QUERY_KEYS.CHESS_GAME, currentUserId.value, id.value]),
    queryFn: () => chessGamesApi.get(currentUserId.value!, id.value!),
    enabled: computed(() => !!currentUserId.value && !!id.value),
  })
}
