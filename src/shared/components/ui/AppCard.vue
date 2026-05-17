<script setup lang="ts">
withDefaults(
  defineProps<{
    hoverable?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg'
    active?: boolean
  }>(),
  {
    hoverable: false,
    padding: 'md',
    active: false,
  },
)
</script>

<template>
  <div
    :class="[
      'rounded-xl border border-border bg-surface-1 transition-all duration-200',
      hoverable && 'cursor-pointer hover:border-border-focus/40 hover:bg-surface-2 hover:shadow-card',
      active && 'border-accent/50 bg-surface-2',
      padding === 'none' && 'p-0',
      padding === 'sm' && 'p-3',
      padding === 'md' && 'p-5',
      padding === 'lg' && 'p-6',
    ]"
  >
    <slot />
  </div>
</template>
