import type { User, AuthSession, LoginDTO, RegisterDTO } from '@/shared/types/auth.types'
import { STORAGE_KEYS, MOCK_DELAY_MS } from '@/shared/constants/app.constants'

interface StoredUser extends User {
  passwordHash: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const DEMO_USER: StoredUser = {
  id: 'demo-user-001',
  email: 'demo@chronica.app',
  name: 'Demo User',
  createdAt: '2026-01-01T00:00:00.000Z',
  passwordHash: 'demo1234',
}

function getStoredUsers(): StoredUser[] {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS)
  const users: StoredUser[] = raw ? (JSON.parse(raw) as StoredUser[]) : []
  // Seed demo account if not present
  if (!users.some((u) => u.id === DEMO_USER.id)) {
    users.push(DEMO_USER)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  }
  return users
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

function buildSession(user: User): AuthSession {
  return {
    user,
    token: `mock_jwt_${user.id}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
}

export const authService = {
  async register(dto: RegisterDTO): Promise<AuthSession> {
    await delay(MOCK_DELAY_MS)
    const users = getStoredUsers()
    if (users.some((u) => u.email.toLowerCase() === dto.email.toLowerCase())) {
      throw new Error('An account with this email already exists.')
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email: dto.email.toLowerCase(),
      name: dto.name,
      createdAt: new Date().toISOString(),
      passwordHash: dto.password,
    }
    saveStoredUsers([...users, newUser])
    const session = buildSession({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    })
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
    return session
  },

  async login(dto: LoginDTO): Promise<AuthSession> {
    await delay(MOCK_DELAY_MS)
    const users = getStoredUsers()
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === dto.email.toLowerCase() &&
        u.passwordHash === dto.password,
    )
    if (!user) throw new Error('Invalid email or password. Please try again.')
    const session = buildSession({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    })
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session))
    return session
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION)
  },

  getSession(): AuthSession | null {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION)
    if (!raw) return null
    const session = JSON.parse(raw) as AuthSession
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(STORAGE_KEYS.SESSION)
      return null
    }
    return session
  },
}
