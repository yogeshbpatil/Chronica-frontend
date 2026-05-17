<script setup lang="ts">
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { ArrowLeft, Swords } from '@lucide/vue'
import { useCreateGameMutation } from '../mutations/chess-games.mutations'
import GameForm from '../components/GameForm.vue'
import type { ChessGameFormValues } from '../schemas/chess-game.schema'

const router = useRouter()
const { mutateAsync: createGame, isPending } = useCreateGameMutation()

async function handleSubmit(values: ChessGameFormValues) {
  try {
    const game = await createGame({
      title: values.title,
      opponent: values.opponent,
      result: values.result,
      opening: values.opening ?? '',
      notes: values.notes ?? '',
    })
    toast.success('Game recorded!')
    await router.push(`/games/${game.id}`)
  } catch {
    toast.error('Failed to save game. Please try again.')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-6 py-8">
    <!-- Back -->
    <button
      class="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6 group"
      @click="router.push('/games')"
    >
      <ArrowLeft :size="14" class="group-hover:-translate-x-0.5 transition-transform" />
      Back to games
    </button>

    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-accent-muted border border-accent/30 flex items-center justify-center">
        <Swords :size="18" class="text-accent" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-text-primary tracking-tight">Record New Game</h1>
        <p class="text-sm text-text-secondary">Capture what happened on the board</p>
      </div>
    </div>

    <!-- Form card -->
    <div class="rounded-2xl bg-surface-1 border border-border p-6">
      <GameForm
        submit-label="Record Game"
        :loading="isPending"
        @submit="handleSubmit"
        @cancel="router.push('/games')"
      />
    </div>
  </div>
</template>
