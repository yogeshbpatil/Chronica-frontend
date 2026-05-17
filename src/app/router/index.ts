import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: () => import('@/app/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/features/auth/pages/LoginPage.vue'),
        meta: { title: 'Sign In — Chronica' },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/features/auth/pages/RegisterPage.vue'),
        meta: { title: 'Create Account — Chronica' },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/app/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/features/dashboard/pages/DashboardPage.vue'),
        meta: { title: 'Dashboard — Chronica' },
      },
      {
        path: 'games',
        name: 'games',
        component: () => import('@/features/chess-games/pages/GamesPage.vue'),
        meta: { title: 'Chess Games — Chronica' },
      },
      {
        path: 'games/new',
        name: 'games-new',
        component: () => import('@/features/chess-games/pages/NewGamePage.vue'),
        meta: { title: 'New Game — Chronica' },
      },
      {
        path: 'games/:id',
        name: 'game-detail',
        component: () => import('@/features/chess-games/pages/GameDetailPage.vue'),
        meta: { title: 'Game Detail — Chronica' },
      },
      {
        path: 'games/:id/edit',
        name: 'game-edit',
        component: () => import('@/features/chess-games/pages/EditGamePage.vue'),
        meta: { title: 'Edit Game — Chronica' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
