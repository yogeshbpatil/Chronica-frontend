<script setup lang="ts">
import { computed } from 'vue'
import { Trophy, X, Minus, Target } from '@lucide/vue'
import type { ChessGame } from '../types/chess-game.types'
import type { ChessGameStats } from '../types/chess-game.types'

const props = defineProps<{
  games: ChessGame[]
}>()

const stats = computed<ChessGameStats>(() => {
  const total = props.games.length
  const wins = props.games.filter((g) => g.result === 'win').length
  const losses = props.games.filter((g) => g.result === 'loss').length
  const draws = props.games.filter((g) => g.result === 'draw').length
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0

  return { total, wins, losses, draws, winRate }
})

const statCards = computed(() => [
  {
    label: 'Total Games',
    value: stats.value.total,
    icon: Target,
    color: 'text-accent',
    bg: 'bg-accent-muted',
    border: 'border-accent/20',
  },
  {
    label: 'Wins',
    value: stats.value.wins,
    icon: Trophy,
    color: 'text-win',
    bg: 'bg-success-muted',
    border: 'border-success/20',
  },
  {
    label: 'Losses',
    value: stats.value.losses,
    icon: X,
    color: 'text-loss',
    bg: 'bg-error-muted',
    border: 'border-error/20',
  },
  {
    label: 'Draws',
    value: stats.value.draws,
    icon: Minus,
    color: 'text-draw',
    bg: 'bg-surface-3',
    border: 'border-border',
  },
])
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div
      v-for="stat in statCards"
      :key="stat.label"
      :class="['rounded-xl border p-4 bg-surface-1', stat.border]"
    >
      <div :class="['w-8 h-8 rounded-lg flex items-center justify-center mb-3', stat.bg]">
        <component :is="stat.icon" :size="15" :class="stat.color" />
      </div>
      <p class="text-2xl font-bold text-text-primary tabular-nums">{{ stat.value }}</p>
      <p class="text-xs text-text-tertiary mt-0.5">{{ stat.label }}</p>
    </div>

    <!-- Win rate card -->
    <div
      v-if="stats.total > 0"
      class="col-span-2 sm:col-span-4 rounded-xl border border-border p-4 bg-surface-1"
    >
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs text-text-secondary font-medium">Win Rate</p>
        <p class="text-sm font-bold text-accent tabular-nums">{{ stats.winRate }}%</p>
      </div>
      <div class="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <div
          class="h-full bg-accent rounded-full transition-all duration-700"
          :style="{ width: `${stats.winRate}%` }"
        />
      </div>
      <p class="text-[11px] text-text-tertiary mt-2">
        {{ stats.wins }} wins of {{ stats.total }} recorded games
      </p>
    </div>
  </div>
</template>
