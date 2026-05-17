<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    error?: string
    hint?: string
    rows?: number
    required?: boolean
    disabled?: boolean
    maxlength?: number
  }>(),
  {
    modelValue: '',
    label: undefined,
    placeholder: undefined,
    error: undefined,
    hint: undefined,
    rows: 4,
    required: false,
    disabled: false,
    maxlength: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <div class="flex items-center justify-between">
      <label v-if="label" class="text-xs font-medium text-text-secondary tracking-wide uppercase">
        {{ label }}
        <span v-if="required" class="text-accent ml-0.5">*</span>
      </label>
      <span v-if="maxlength" class="text-xs text-text-tertiary">
        {{ modelValue?.length ?? 0 }}/{{ maxlength }}
      </span>
    </div>

    <textarea
      v-bind="$attrs"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :class="[
        'w-full px-3 py-2 rounded-lg text-sm text-text-primary placeholder:text-text-tertiary resize-y',
        'bg-surface-2 border transition-all duration-200 leading-relaxed',
        'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-border-focus',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error ? 'border-error/60 focus:ring-error/30 focus:border-error/60' : 'border-border hover:border-border-focus/40',
      ]"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <p v-if="error" class="text-xs text-error">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-text-tertiary">{{ hint }}</p>
  </div>
</template>
