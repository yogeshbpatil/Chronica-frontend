export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  name: string
  email: string
  password: string
}
