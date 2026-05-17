<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { ArrowLeft } from '@lucide/vue'
import { useGameQuery } from '../queries/chess-games.queries'
import { useUpdateGameMutation } from '../mutations/chess-games.mutations'
import GameForm from '../components/GameForm.vue'
import AppSkeleton from '@/shared/components/ui/AppSkeleton.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import type { ChessGameFormValues } from '../schemas/chess-game.schema'

const route = useRoute()
const router = useRouter()

const gameId = computed(() => route.params.id as string)
const { data: game, isPending, isError } = useGameQuery(gameId)
const { mutateAsync: updateGame, isPending: isUpdating } = useUpdateGameMutation()

async function handleSubmit(values: ChessGameFormValues) {
  if (!game.value) return
  try {
    await updateGame({
      id: game.value.id,
      dto: {
        title: values.title,
        opponent: values.opponent,
        result: values.result,
        opening: values.opening ?? '',
        notes: values.notes ?? '',
      },
    })
    toast.success('Game updated!')
    await router.push(`/games/${game.value.id}`)
  } catch {
    toast.error('Failed to update game. Please try again.')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-6 py-8">
    <!-- Back -->
    <button
      class="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 group"
      @click="router.push(`/games/${gameId}`)"
    >
      <ArrowLeft :size="14" class="group-hover:-translate-x-0.5 transition-transform" />
      Back to game
    </button>

    <!-- Loading -->
    <div v-if="isPending" class="space-y-4">
      <AppSkeleton width="50%" height="28px" />
      <div class="rounded-2xl border border-border bg-surface-1 p-6 space-y-4 mt-4">
        <AppSkeleton width="100%" height="40px" />
        <div class="grid grid-cols-2 gap-4">
          <AppSkeleton height="40px" />
          <AppSkeleton height="40px" />
        </div>
        <AppSkeleton height="120px" />
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="isError"
      class="rounded-xl border border-error/30 bg-error-muted p-8 text-center"
    >
      <p class="text-error font-medium mb-3">Failed to load game</p>
      <AppButton variant="secondary" @click="router.push('/games')">Back to games</AppButton>
    </div>

    <!-- Form -->
    <div v-else-if="game">
      <div class="mb-6">
        <h1 class="text-xl font-bold text-text-primary tracking-tight">Edit Game</h1>
        <p class="text-sm text-text-secondary mt-0.5">{{ game.title }}</p>
      </div>

      <div class="rounded-2xl bg-surface-1 border border-border p-6">
        <GameForm
          :initial-values="{
            title: game.title,
            opponent: game.opponent,
            result: game.result,
            opening: game.opening,
            notes: game.notes,
          }"
          submit-label="Save Changes"
          :loading="isUpdating"
          @submit="handleSubmit"
          @cancel="router.push(`/games/${game.id}`)"
        />
      </div>
    </div>
  </div>
</template>
