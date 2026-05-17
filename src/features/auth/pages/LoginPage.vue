<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { ArrowRight } from '@lucide/vue'
import { useAuthStore } from '@/shared/stores/auth.store'
import AppInput from '@/shared/components/ui/AppInput.vue'
import AppButton from '@/shared/components/ui/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const { handleSubmit, errors, isSubmitting, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { email: '', password: '' },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const serverError = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  serverError.value = null
  try {
    await authStore.login(values)
    const redirect = (router.currentRoute.value.query.redirect as string) || '/dashboard'
    await router.push(redirect)
    toast.success('Welcome back!')
  } catch (err) {
    serverError.value = (err as Error).message
  }
})
</script>

<template>
  <div class="w-full max-w-[400px]">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-text-primary mb-2 tracking-tight">Welcome back</h1>
      <p class="text-sm text-text-secondary">Sign in to continue to Chronica</p>
    </div>

    <!-- Card -->
    <div class="rounded-2xl bg-surface-1 border border-border p-6 shadow-elevated">
      <!-- Server error -->
      <div
        v-if="serverError"
        class="mb-4 p-3 rounded-lg bg-error-muted border border-error/30 text-sm text-error"
      >
        {{ serverError }}
      </div>

      <form class="space-y-4" novalidate @submit.prevent="onSubmit">
        <AppInput
          v-model="email"
          v-bind="emailAttrs"
          label="Email"
          type="email"
          placeholder="you@example.com"
          :error="errors.email"
          required
          autocomplete="email"
        />

        <AppInput
          v-model="password"
          v-bind="passwordAttrs"
          label="Password"
          type="password"
          placeholder="••••••••"
          :error="errors.password"
          required
          autocomplete="current-password"
        />

        <AppButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isSubmitting"
          class="w-full mt-2"
        >
          Sign In
          <ArrowRight :size="14" />
        </AppButton>
      </form>
    </div>

    <!-- Footer -->
    <p class="text-center text-sm text-text-tertiary mt-5">
      Don't have an account?
      <RouterLink
        to="/register"
        class="text-accent hover:text-accent-light font-medium transition-colors ml-1"
      >
        Create one
      </RouterLink>
    </p>
  </div>
</template>
