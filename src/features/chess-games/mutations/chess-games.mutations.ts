import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/shared/stores/auth.store'
import { chessGamesApi } from '../api/chess-games.api'
import type { CreateChessGameDTO, UpdateChessGameDTO } from '../types/chess-game.types'
import { QUERY_KEYS } from '@/shared/constants/app.constants'

export function useCreateGameMutation() {
  const queryClient = useQueryClient()
  const { currentUserId } = storeToRefs(useAuthStore())

  return useMutation({
    mutationFn: (dto: CreateChessGameDTO) => chessGamesApi.create(currentUserId.value!, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHESS_GAMES] })
    },
  })
}

export function useUpdateGameMutation() {
  const queryClient = useQueryClient()
  const { currentUserId } = storeToRefs(useAuthStore())

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateChessGameDTO }) =>
      chessGamesApi.update(currentUserId.value!, id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHESS_GAMES] })
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHESS_GAME] })
    },
  })
}

export function useDeleteGameMutation() {
  const queryClient = useQueryClient()
  const { currentUserId } = storeToRefs(useAuthStore())

  return useMutation({
    mutationFn: (id: string) => chessGamesApi.remove(currentUserId.value!, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CHESS_GAMES] })
    },
  })
}
