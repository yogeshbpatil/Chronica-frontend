import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { STORAGE_KEYS } from '@/shared/constants/app.constants'
import type { AuthSession } from '@/shared/types/auth.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const sessionRaw = localStorage.getItem(STORAGE_KEYS.SESSION)
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw) as AuthSession
      config.headers.Authorization = `Bearer ${session.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor — handle 401
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    const status = (error as { response?: { status?: number } })?.response?.status
    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.SESSION)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
