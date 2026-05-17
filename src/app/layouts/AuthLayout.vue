<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Swords } from '@lucide/vue'
</script>

<template>
  <div class="min-h-screen bg-bg-base flex flex-col">
    <!-- Top bar -->
    <header class="flex items-center gap-2.5 p-5">
      <div class="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
        <Swords :size="14" color="#1A1400" />
      </div>
      <span class="text-sm font-semibold text-text-primary tracking-tight">Chronica</span>
    </header>

    <!-- Content -->
    <main class="flex-1 flex items-center justify-center p-4">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="p-5 text-center">
      <p class="text-xs text-text-tertiary">
        © {{ new Date().getFullYear() }} Chronica. All rights reserved.
      </p>
    </footer>
  </div>
</template>
