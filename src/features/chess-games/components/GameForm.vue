<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { chessGameSchema } from '../schemas/chess-game.schema'
import type { ChessGameFormValues } from '../schemas/chess-game.schema'
import AppInput from '@/shared/components/ui/AppInput.vue'
import AppTextarea from '@/shared/components/ui/AppTextarea.vue'
import AppSelect from '@/shared/components/ui/AppSelect.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<ChessGameFormValues>
    loading?: boolean
    submitLabel?: string
  }>(),
  {
    initialValues: undefined,
    loading: false,
    submitLabel: 'Save Game',
  },
)

const emit = defineEmits<{
  submit: [values: ChessGameFormValues]
  cancel: []
}>()

const resultOptions = [
  { value: 'win', label: '🏆 Win' },
  { value: 'loss', label: '✕  Loss' },
  { value: 'draw', label: '— Draw' },
]

const { handleSubmit, errors, defineField } = useForm<ChessGameFormValues>({
  validationSchema: toTypedSchema(chessGameSchema),
  initialValues: {
    title: props.initialValues?.title ?? '',
    opponent: props.initialValues?.opponent ?? '',
    result: props.initialValues?.result ?? 'win',
    opening: props.initialValues?.opening ?? '',
    notes: props.initialValues?.notes ?? '',
  },
})

const [title, titleAttrs] = defineField('title')
const [opponent, opponentAttrs] = defineField('opponent')
const [result, resultAttrs] = defineField('result')
const [opening, openingAttrs] = defineField('opening')
const [notes, notesAttrs] = defineField('notes')

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="onSubmit">
    <!-- Row: Title -->
    <AppInput
      v-model="title"
      v-bind="titleAttrs"
      label="Game Title"
      placeholder="e.g. Blitz Tournament Round 4"
      :error="errors.title"
      required
    />

    <!-- Row: Opponent + Result -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppInput
        v-model="opponent"
        v-bind="opponentAttrs"
        label="Opponent"
        placeholder="e.g. Magnus Carlsen"
        :error="errors.opponent"
        required
      />
      <AppSelect
        v-model="result"
        v-bind="resultAttrs"
        label="Result"
        :options="resultOptions"
        :error="errors.result"
        required
      />
    </div>

    <!-- Row: Opening -->
    <AppInput
      v-model="opening"
      v-bind="openingAttrs"
      label="Opening"
      placeholder="e.g. Sicilian Defense, Ruy Lopez..."
      :error="errors.opening"
    />

    <!-- Row: Notes -->
    <AppTextarea
      v-model="notes"
      v-bind="notesAttrs"
      label="Game Notes"
      placeholder="What happened in this game? Key moments, mistakes, lessons learned..."
      :error="errors.notes"
      :rows="6"
      :maxlength="8000"
      hint="Reflect on your play — what worked, what didn't, and what to practice next."
    />

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 pt-2 border-t border-border">
      <AppButton variant="ghost" type="button" @click="emit('cancel')">Cancel</AppButton>
      <AppButton variant="primary" type="submit" :loading="loading">
        {{ submitLabel }}
      </AppButton>
    </div>
  </form>
</template>
