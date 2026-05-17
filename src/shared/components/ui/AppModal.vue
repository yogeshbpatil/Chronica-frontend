<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { X } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    open: false,
    title: undefined,
    description: undefined,
    size: 'md',
  },
)

const emit = defineEmits<{
  close: []
}>()

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200"
      leave-active-class="transition-all duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <!-- Panel -->
        <Transition
          enter-active-class="transition-all duration-200"
          leave-active-class="transition-all duration-150"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
          appear
        >
          <div
            v-if="open"
            :class="[
              'relative w-full rounded-2xl bg-surface-1 border border-border p-6',
              'shadow-modal',
              sizeClasses[size],
            ]"
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="mb-4 pr-8">
              <slot name="header">
                <h2 class="text-base font-semibold text-text-primary">{{ title }}</h2>
                <p v-if="description" class="mt-1 text-sm text-text-secondary">
                  {{ description }}
                </p>
              </slot>
            </div>

            <!-- Close button -->
            <button
              class="absolute top-4 right-4 rounded-lg p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
              @click="emit('close')"
            >
              <X :size="16" />
            </button>

            <!-- Body -->
            <slot />

            <!-- Footer -->
            <div v-if="$slots.footer" class="mt-5 flex items-center justify-end gap-2">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
