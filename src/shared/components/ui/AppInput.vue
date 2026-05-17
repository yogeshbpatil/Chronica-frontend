<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    error?: string
    hint?: string
    type?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    label: undefined,
    placeholder: undefined,
    error: undefined,
    hint: undefined,
    type: 'text',
    required: false,
    disabled: false,
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

    <input
      v-bind="$attrs"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full px-3 py-2 rounded-lg text-sm text-text-primary placeholder:text-text-tertiary',
        'bg-surface-2 border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-border-focus',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error ? 'border-error/60 focus:ring-error/30 focus:border-error/60' : 'border-border hover:border-border-focus/40',
      ]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" class="text-xs text-error flex items-center gap-1">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-text-tertiary">
      {{ hint }}
    </p>
  </div>
</template>
