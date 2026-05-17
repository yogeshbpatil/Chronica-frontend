<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <RouterView />
  <Toaster
    theme="dark"
    position="bottom-right"
    rich-colors
    close-button
    :toast-options="{
      style: {
        background: '#1E1E26',
        border: '1px solid #2E2E3C',
        color: '#EDEDF0',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
      },
    }"
    :gap="8"
    :visible-toasts="5"
    :duration="4000"
  />
</template>
