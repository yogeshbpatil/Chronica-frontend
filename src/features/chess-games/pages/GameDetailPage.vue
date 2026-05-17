<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Edit, Trash2, Trophy, X, Minus, Clock, BookOpen } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useGameQuery } from '../queries/chess-games.queries'
import { useDeleteGameMutation } from '../mutations/chess-games.mutations'
import DeleteGameModal from '../components/DeleteGameModal.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppBadge from '@/shared/components/ui/AppBadge.vue'
import AppSkeleton from '@/shared/components/ui/AppSkeleton.vue'
import { formatDate, formatDateTime } from '@/shared/utils/date.utils'
import type { GameResult } from '../types/chess-game.types'

type BadgeVariant = 'success' | 'error' | 'default'

const route = useRoute()
const router = useRouter()

const gameId = computed(() => route.params.id as string)
const { data: game, isPending, isError } = useGameQuery(gameId)
const { mutateAsync: deleteGame, isPending: isDeleting } = useDeleteGameMutation()

const showDeleteModal = ref(false)

const resultConfig: Record<GameResult, { label: string; variant: BadgeVariant; icon: object }> = {
  win: { label: 'Win', variant: 'success', icon: Trophy },
  loss: { label: 'Loss', variant: 'error', icon: X },
  draw: { label: 'Draw', variant: 'default', icon: Minus },
}

const resultInfo = computed(() => (game.value ? resultConfig[game.value.result] : null))

async function handleDelete() {
  if (!game.value) return
  try {
    await deleteGame(game.value.id)
    toast.success('Game deleted')
    await router.push('/games')
  } catch {
    toast.error('Failed to delete game')
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-8">
    <!-- Back -->
    <button
      class="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 group"
      @click="router.push('/games')"
    >
      <ArrowLeft :size="14" class="group-hover:-translate-x-0.5 transition-transform" />
      Back to games
    </button>

    <!-- Loading -->
    <div v-if="isPending" class="space-y-4">
      <AppSkeleton width="60%" height="28px" />
      <AppSkeleton width="40%" height="20px" />
      <div class="mt-6 space-y-2">
        <AppSkeleton width="100%" height="16px" :lines="6" />
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="isError"
      class="rounded-xl border border-error/30 bg-error-muted p-8 text-center"
    >
      <p class="text-error font-medium mb-3">Game not found or failed to load</p>
      <AppButton variant="secondary" @click="router.push('/games')">Go back</AppButton>
    </div>

    <!-- Content -->
    <div v-else-if="game">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 mb-6">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <AppBadge v-if="resultInfo" :variant="resultInfo.variant" dot size="md">
              <component :is="resultInfo.icon" :size="11" />
              {{ resultInfo.label }}
            </AppBadge>
            <span
              v-if="game.opening"
              class="text-xs text-text-tertiary font-mono bg-surface-2 px-2 py-0.5 rounded border border-border"
            >
              {{ game.opening }}
            </span>
          </div>
          <h1 class="text-xl font-bold text-text-primary tracking-tight">{{ game.title }}</h1>
          <p class="text-sm text-text-secondary mt-1">
            vs.
            <span class="font-semibold text-text-primary">{{ game.opponent }}</span>
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <AppButton
            variant="secondary"
            size="sm"
            @click="router.push(`/games/${game.id}/edit`)"
          >
            <Edit :size="12" />
            Edit
          </AppButton>
          <AppButton variant="danger" size="sm" @click="showDeleteModal = true">
            <Trash2 :size="12" />
          </AppButton>
        </div>
      </div>

      <!-- Meta -->
      <div class="flex items-center gap-4 text-xs text-text-tertiary mb-6 border-t border-border pt-4">
        <div class="flex items-center gap-1.5">
          <Clock :size="11" />
          Created {{ formatDate(game.createdAt) }}
        </div>
        <div v-if="game.updatedAt !== game.createdAt" class="flex items-center gap-1.5">
          <Clock :size="11" />
          Updated {{ formatDateTime(game.updatedAt) }}
        </div>
      </div>

      <!-- Notes -->
      <div v-if="game.notes" class="rounded-xl bg-surface-1 border border-border p-5">
        <div class="flex items-center gap-2 mb-3">
          <BookOpen :size="14" class="text-accent" />
          <h2 class="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Game Notes
          </h2>
        </div>
        <p class="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
          {{ game.notes }}
        </p>
      </div>
      <div
        v-else
        class="rounded-xl bg-surface-1 border border-border-subtle p-6 text-center text-sm text-text-tertiary"
      >
        No notes recorded for this game.
        <button
          class="text-accent hover:text-accent-light ml-1 transition-colors"
          @click="router.push(`/games/${game.id}/edit`)"
        >
          Add notes →
        </button>
      </div>
    </div>

    <!-- Delete modal -->
    <DeleteGameModal
      :open="showDeleteModal"
      :game-title="game?.title ?? ''"
      :loading="isDeleting"
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />
  </div>
</template>
