<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from '@/shared/components/navigation/AppSidebar.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-bg-base">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto scrollbar-thin min-w-0">
      <RouterView />
    </main>
  </div>
</template>
