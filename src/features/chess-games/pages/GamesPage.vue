<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Swords, Search } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useGamesQuery } from '../queries/chess-games.queries'
import { useDeleteGameMutation } from '../mutations/chess-games.mutations'
import GameCard from '../components/GameCard.vue'
import GameStats from '../components/GameStats.vue'
import DeleteGameModal from '../components/DeleteGameModal.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppSkeleton from '@/shared/components/ui/AppSkeleton.vue'
import EmptyState from '@/shared/components/feedback/EmptyState.vue'
import type { ChessGame } from '../types/chess-game.types'

const router = useRouter()

const { data: games, isPending, isError } = useGamesQuery()
const { mutateAsync: deleteGame, isPending: isDeleting } = useDeleteGameMutation()

const searchQuery = ref('')
const gameToDelete = ref<ChessGame | null>(null)

const filteredGames = computed(() => {
  if (!games.value) return []
  if (!searchQuery.value.trim()) return games.value
  const q = searchQuery.value.toLowerCase()
  return games.value.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.opponent.toLowerCase().includes(q) ||
      g.opening.toLowerCase().includes(q),
  )
})

async function confirmDelete() {
  if (!gameToDelete.value) return
  try {
    await deleteGame(gameToDelete.value.id)
    toast.success('Game deleted')
    gameToDelete.value = null
  } catch {
    toast.error('Failed to delete game')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-text-primary tracking-tight">Chess Games</h1>
        <p class="text-sm text-text-secondary mt-0.5">
          {{ games?.length ?? 0 }} recorded game{{ (games?.length ?? 0) !== 1 ? 's' : '' }}
        </p>
      </div>
      <AppButton variant="primary" @click="router.push('/games/new')">
        <Plus :size="14" />
        New Game
      </AppButton>
    </div>

    <!-- Stats -->
    <div v-if="!isPending && games && games.length > 0" class="mb-6">
      <GameStats :games="games" />
    </div>

    <!-- Search -->
    <div
      v-if="!isPending && games && games.length > 0"
      class="relative mb-5"
    >
      <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search games, opponents, openings..."
        class="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-surface-2 border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-border-focus transition-all"
      />
    </div>

    <!-- Loading skeletons -->
    <div v-if="isPending" class="space-y-3">
      <div
        v-for="i in 4"
        :key="i"
        class="rounded-xl bg-surface-1 border border-border p-4"
      >
        <div class="flex items-start gap-3">
          <div class="flex-1 space-y-2">
            <AppSkeleton width="80px" height="20px" />
            <AppSkeleton width="60%" height="16px" />
            <AppSkeleton width="40%" height="14px" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="isError"
      class="rounded-xl border border-error/30 bg-error-muted p-6 text-center"
    >
      <p class="text-sm text-error font-medium">Failed to load games. Please try again.</p>
    </div>

    <!-- Empty state -->
    <EmptyState
      v-else-if="!filteredGames.length && !searchQuery"
      title="No games recorded yet"
      description="Start tracking your chess games. Record your wins, losses, and the lessons you learn along the way."
    >
      <template #icon>
        <Swords :size="24" />
      </template>
      <template #action>
        <AppButton variant="primary" @click="router.push('/games/new')">
          <Plus :size="14" />
          Record First Game
        </AppButton>
      </template>
    </EmptyState>

    <!-- No search results -->
    <EmptyState
      v-else-if="!filteredGames.length && searchQuery"
      title="No games found"
      :description="`No games match '${searchQuery}'`"
    >
      <template #icon>
        <Search :size="24" />
      </template>
    </EmptyState>

    <!-- Games list -->
    <div v-else class="space-y-2.5">
      <div
        v-for="game in filteredGames"
        :key="game.id"
        class="group relative"
      >
        <GameCard :game="game" />

        <!-- Quick delete action -->
        <button
          class="absolute top-3 right-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-text-tertiary hover:text-error hover:bg-error-muted"
          title="Delete game"
          @click.stop="gameToDelete = game"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Delete modal -->
    <DeleteGameModal
      :open="!!gameToDelete"
      :game-title="gameToDelete?.title ?? ''"
      :loading="isDeleting"
      @close="gameToDelete = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
