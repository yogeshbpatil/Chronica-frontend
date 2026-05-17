<script setup lang="ts">
type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'accent'
type BadgeSize = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariant
    size?: BadgeSize
    dot?: boolean
  }>(),
  {
    variant: 'default',
    size: 'md',
    dot: false,
  },
)

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-3 text-text-secondary border-border',
  success: 'bg-success-muted text-success border-success/30',
  error: 'bg-error-muted text-error border-error/30',
  warning: 'bg-warning-muted text-warning border-warning/30',
  info: 'bg-info-muted text-info border-info/30',
  accent: 'bg-accent-muted text-accent border-accent/30',
}

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-text-tertiary',
  success: 'bg-success',
  error: 'bg-error',
  warning: 'bg-warning',
  info: 'bg-info',
  accent: 'bg-accent',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
}

import { computed } from 'vue'
const classes = computed(
  () =>
    `inline-flex items-center gap-1.5 rounded-md font-medium border ${variantClasses[props.variant]} ${sizeClasses[props.size]}`,
)
</script>

<template>
  <span :class="classes">
    <span v-if="dot" :class="['w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant]]" />
    <slot />
  </span>
</template>
