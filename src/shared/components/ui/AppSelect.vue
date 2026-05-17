<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    error?: string
    hint?: string
    required?: boolean
    disabled?: boolean
    options: { value: string; label: string }[]
    placeholder?: string
  }>(),
  {
    modelValue: '',
    label: undefined,
    error: undefined,
    hint: undefined,
    required: false,
    disabled: false,
    placeholder: 'Select...',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-xs font-medium text-text-secondary tracking-wide uppercase">
      {{ label }}
      <span v-if="required" class="text-accent ml-0.5">*</span>
    </label>

    <div class="relative">
      <select
        v-bind="$attrs"
        :value="modelValue"
        :disabled="disabled"
        :class="[
          'w-full px-3 py-2 rounded-lg text-sm text-text-primary appearance-none cursor-pointer pr-9',
          'bg-surface-2 border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-border-focus',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-error/60' : 'border-border hover:border-border-focus/40',
        ]"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          class="bg-surface-1 text-text-primary"
        >
          {{ opt.label }}
        </option>
      </select>

      <!-- Chevron icon -->
      <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-text-tertiary"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>

    <p v-if="error" class="text-xs text-error">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-text-tertiary">{{ hint }}</p>
  </div>
</template>
