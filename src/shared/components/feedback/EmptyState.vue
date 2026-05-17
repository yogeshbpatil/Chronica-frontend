<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    icon?: object
  }>(),
  {
    description: undefined,
    icon: undefined,
  },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-6">
    <div
      v-if="icon || $slots.icon"
      class="mb-4 w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-text-tertiary"
    >
      <slot name="icon">
        <component :is="icon" :size="24" />
      </slot>
    </div>
    <h3 class="text-base font-semibold text-text-primary mb-1">{{ title }}</h3>
    <p v-if="description" class="text-sm text-text-secondary max-w-xs leading-relaxed">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
