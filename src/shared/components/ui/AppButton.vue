<script setup lang="ts">
import { Loader2 } from '@lucide/vue'
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'secondary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
  },
)

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-[#1A1400] hover:bg-accent-light active:bg-accent-dark shadow-sm hover:shadow-md',
  secondary:
    'bg-surface-2 text-text-primary border border-border hover:bg-surface-3 hover:border-border-focus/40 active:bg-surface-2',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-2 active:bg-surface-3',
  danger:
    'bg-error-muted text-error border border-error/30 hover:bg-error/20 active:bg-error/30',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs h-7',
  md: 'px-4 py-2 text-sm h-9',
  lg: 'px-5 py-2.5 text-sm h-10',
}

const classes = computed(
  () =>
    `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]}`,
)

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button :type="type" :class="classes" :disabled="isDisabled">
    <Loader2 v-if="loading" :size="14" class="animate-spin" />
    <slot />
  </button>
</template>
