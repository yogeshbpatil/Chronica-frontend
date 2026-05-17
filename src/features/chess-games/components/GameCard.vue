<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy, Minus, X, Clock, ChevronRight } from '@lucide/vue'
import type { ChessGame, GameResult } from '../types/chess-game.types'
import { formatRelativeDate } from '@/shared/utils/date.utils'
import AppBadge from '@/shared/components/ui/AppBadge.vue'

type BadgeVariant = 'success' | 'error' | 'default'

const props = defineProps<{
  game: ChessGame
}>()

const router = useRouter()

const resultConfig: Record<
  GameResult,
  { label: string; variant: BadgeVariant; icon: object }
> = {
  win: { label: 'Win', variant: 'success', icon: Trophy },
  loss: { label: 'Loss', variant: 'error', icon: X },
  draw: { label: 'Draw', variant: 'default', icon: Minus },
}

const result = computed(() => resultConfig[props.game.result])

const borderColor = computed(() => {
  const map: Record<GameResult, string> = {
    win: 'border-l-success/60',
    loss: 'border-l-error/60',
    draw: 'border-l-border',
  }
  return map[props.game.result]
})

function navigate() {
  void router.push(`/games/${props.game.id}`)
}
</script>

<template>
  <article
    :class="[
      'group rounded-xl bg-surface-1 border border-border border-l-2 p-4',
      'hover:bg-surface-2 hover:border-border-focus/30 hover:shadow-card',
      'transition-all duration-200 cursor-pointer',
      borderColor,
    ]"
    @click="navigate"
  >
    <div class="flex items-start justify-between gap-3">
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2 flex-wrap">
          <AppBadge :variant="result.variant" dot>
            <component :is="result.icon" :size="10" />
            {{ result.label }}
          </AppBadge>
          <span
            v-if="game.opening"
            class="text-[11px] text-text-tertiary bg-surface-3 px-1.5 py-0.5 rounded font-mono truncate max-w-[140px]"
          >
            {{ game.opening }}
          </span>
        </div>

        <h3
          class="text-sm font-semibold text-text-primary truncate group-hover:text-accent transition-colors"
        >
          {{ game.title }}
        </h3>

        <p class="text-xs text-text-secondary mt-0.5 truncate">
          vs. <span class="text-text-primary font-medium">{{ game.opponent }}</span>
        </p>

        <p v-if="game.notes" class="text-xs text-text-tertiary mt-2 line-clamp-2 leading-relaxed">
          {{ game.notes }}
        </p>
      </div>

      <!-- Right -->
      <div class="flex flex-col items-end gap-2 shrink-0">
        <ChevronRight
          :size="14"
          class="text-text-disabled group-hover:text-accent transition-colors"
        />
        <div class="flex items-center gap-1 text-[11px] text-text-tertiary">
          <Clock :size="10" />
          {{ formatRelativeDate(game.createdAt) }}
        </div>
      </div>
    </div>
  </article>
</template>
