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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Max 80 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Max 100 characters'),
})

const { handleSubmit, errors, isSubmitting, defineField } = useForm({
  validationSchema: toTypedSchema(registerSchema),
  initialValues: { name: '', email: '', password: '' },
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const serverError = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  serverError.value = null
  try {
    await authStore.register(values)
    await router.push('/dashboard')
    toast.success('Account created! Welcome to Chronica 🎉')
  } catch (err) {
    serverError.value = (err as Error).message
  }
})
</script>

<template>
  <div class="w-full max-w-[400px]">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-text-primary mb-2 tracking-tight">Create your account</h1>
      <p class="text-sm text-text-secondary">Start your personal knowledge journey</p>
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
          v-model="name"
          v-bind="nameAttrs"
          label="Full Name"
          type="text"
          placeholder="Magnus Carlsen"
          :error="errors.name"
          required
          autocomplete="name"
        />

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
          placeholder="At least 8 characters"
          :error="errors.password"
          hint="Minimum 8 characters"
          required
          autocomplete="new-password"
        />

        <AppButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isSubmitting"
          class="w-full mt-2"
        >
          Create Account
          <ArrowRight :size="14" />
        </AppButton>
      </form>
    </div>

    <!-- Footer -->
    <p class="text-center text-sm text-text-tertiary mt-5">
      Already have an account?
      <RouterLink
        to="/login"
        class="text-accent hover:text-accent-light font-medium transition-colors ml-1"
      >
        Sign in
      </RouterLink>
    </p>
  </div>
</template>
