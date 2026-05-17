<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Plus, Swords, ArrowRight, Trophy, X, Minus } from '@lucide/vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useGamesQuery } from '@/features/chess-games/queries/chess-games.queries'
import GameStats from '@/features/chess-games/components/GameStats.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'
import AppSkeleton from '@/shared/components/ui/AppSkeleton.vue'
import AppBadge from '@/shared/components/ui/AppBadge.vue'
import { formatRelativeDate } from '@/shared/utils/date.utils'
import type { GameResult } from '@/features/chess-games/types/chess-game.types'

type BadgeVariant = 'success' | 'error' | 'default'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const { data: games, isPending } = useGamesQuery()

const recentGames = computed(() => (games.value ?? []).slice(0, 5))

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const firstName = computed(() => user.value?.name.split(' ')[0] ?? '')

const resultConfig: Record<GameResult, { label: string; variant: BadgeVariant; icon: object }> = {
  win: { label: 'Win', variant: 'success', icon: Trophy },
  loss: { label: 'Loss', variant: 'error', icon: X },
  draw: { label: 'Draw', variant: 'default', icon: Minus },
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-text-primary tracking-tight">
        {{ greeting }}, {{ firstName }}
      </h1>
      <p class="text-sm text-text-secondary mt-1">
        Here's an overview of your chess progress
      </p>
    </div>

    <!-- Quick actions -->
    <div class="flex items-center gap-3 mb-8">
      <AppButton variant="primary" @click="router.push('/games/new')">
        <Plus :size="14" />
        Record Game
      </AppButton>
      <AppButton variant="secondary" @click="router.push('/games')">
        <Swords :size="14" />
        View All Games
      </AppButton>
    </div>

    <!-- Stats section -->
    <section class="mb-8">
      <h2 class="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-4">
        Statistics
      </h2>

      <div v-if="isPending" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          v-for="i in 4"
          :key="i"
          class="rounded-xl bg-surface-1 border border-border p-4 space-y-2"
        >
          <AppSkeleton width="32px" height="32px" rounded="lg" />
          <AppSkeleton width="40px" height="24px" />
          <AppSkeleton width="60%" height="12px" />
        </div>
      </div>

      <GameStats v-else-if="games && games.length > 0" :games="games" />

      <div
        v-else-if="games && games.length === 0"
        class="rounded-xl border border-border-subtle bg-surface-1 p-8 text-center"
      >
        <p class="text-sm text-text-tertiary">No games yet. Record your first game to see stats.</p>
      </div>
    </section>

    <!-- Recent games -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xs font-semibold text-text-tertiary uppercase tracking-widest">
          Recent Games
        </h2>
        <button
          class="flex items-center gap-1 text-xs text-accent hover:text-accent-light transition-colors"
          @click="router.push('/games')"
        >
          View all
          <ArrowRight :size="11" />
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isPending" class="space-y-2">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-xl bg-surface-1 border border-border p-4 flex items-center gap-3"
        >
          <AppSkeleton width="52px" height="22px" />
          <div class="flex-1 space-y-1.5">
            <AppSkeleton width="50%" height="14px" />
            <AppSkeleton width="30%" height="12px" />
          </div>
        </div>
      </div>

      <!-- Games list -->
      <div v-else-if="recentGames.length > 0" class="space-y-2">
        <div
          v-for="game in recentGames"
          :key="game.id"
          class="flex items-center gap-3 rounded-xl border border-border bg-surface-1 px-4 py-3 hover:bg-surface-2 hover:border-border-focus/30 transition-all cursor-pointer group"
          @click="router.push(`/games/${game.id}`)"
        >
          <AppBadge :variant="resultConfig[game.result].variant" size="sm" dot>
            {{ resultConfig[game.result].label }}
          </AppBadge>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
              {{ game.title }}
            </p>
            <p class="text-xs text-text-tertiary truncate">
              vs. {{ game.opponent }}
              <span v-if="game.opening" class="ml-1.5">· {{ game.opening }}</span>
            </p>
          </div>

          <div class="text-xs text-text-disabled shrink-0">
            {{ formatRelativeDate(game.createdAt) }}
          </div>

          <ArrowRight
            :size="12"
            class="text-text-disabled group-hover:text-accent transition-colors shrink-0"
          />
        </div>
      </div>

      <!-- No games -->
      <div
        v-else
        class="rounded-xl border border-border-subtle bg-surface-1 p-8 text-center"
      >
        <Swords :size="24" class="mx-auto text-text-tertiary mb-3" />
        <p class="text-sm text-text-secondary font-medium mb-1">No games recorded yet</p>
        <p class="text-xs text-text-tertiary mb-4">
          Start recording your chess games to track your progress
        </p>
        <AppButton variant="primary" size="sm" @click="router.push('/games/new')">
          <Plus :size="13" />
          Record First Game
        </AppButton>
      </div>
    </section>
  </div>
</template>
