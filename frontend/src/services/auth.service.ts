import api from './api'

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'USER'
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/admin/auth/login', credentials)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/admin/auth/me')
    return response.data
  },
}
