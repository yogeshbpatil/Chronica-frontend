<script setup lang="ts">
import { Loader2 } from '@lucide/vue'
import { computed } from 'vue'

type SpinnerSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    size?: SpinnerSize
    label?: string
    fullPage?: boolean
  }>(),
  {
    size: 'md',
    label: undefined,
    fullPage: false,
  },
)

const iconSize = computed(() => ({ sm: 16, md: 24, lg: 36 }[props.size]))
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center gap-3',
      fullPage ? 'min-h-[60vh]' : 'py-12',
    ]"
  >
    <Loader2 :size="iconSize" class="animate-spin text-accent" />
    <p v-if="label" class="text-sm text-text-tertiary">{{ label }}</p>
  </div>
</template>
