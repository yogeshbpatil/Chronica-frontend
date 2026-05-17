<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'
import AppModal from '@/shared/components/ui/AppModal.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'

defineProps<{
  open: boolean
  gameTitle: string
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <AppModal :open="open" size="sm" @close="emit('close')">
    <div class="text-center">
      <!-- Icon -->
      <div
        class="mx-auto mb-4 w-12 h-12 rounded-xl bg-error-muted border border-error/30 flex items-center justify-center"
      >
        <AlertTriangle :size="22" class="text-error" />
      </div>

      <h2 class="text-base font-semibold text-text-primary mb-1">Delete game?</h2>
      <p class="text-sm text-text-secondary leading-relaxed">
        <span class="font-medium text-text-primary">{{ gameTitle }}</span> will be permanently
        removed. This action cannot be undone.
      </p>

      <div class="flex gap-2 mt-6">
        <AppButton variant="secondary" class="flex-1" @click="emit('close')">Cancel</AppButton>
        <AppButton variant="danger" class="flex-1" :loading="loading" @click="emit('confirm')">
          Delete
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>
