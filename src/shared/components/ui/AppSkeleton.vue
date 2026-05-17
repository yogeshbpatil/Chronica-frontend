<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string
    height?: string
    rounded?: 'sm' | 'md' | 'lg' | 'full'
    lines?: number
  }>(),
  {
    width: '100%',
    height: '16px',
    rounded: 'md',
    lines: 1,
  },
)

const roundedClasses = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="i in lines"
      :key="i"
      :style="{ width: i === lines && lines > 1 ? '60%' : width, height }"
      :class="['bg-surface-3 animate-pulse', roundedClasses[rounded]]"
    />
  </div>
</template>
