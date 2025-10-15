import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface User {
  id: number
  email: string
  name: string
  phone: string
  is_professional: boolean
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  phone: string
  is_professional: boolean
}

class AuthService {
  private tokenKey = 'bookinails_token'
  private userKey = 'bookinails_user'

  // Get stored token
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.tokenKey)
  }

  // Get stored user
  getUser(): User | null {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(this.userKey)
    return user ? JSON.parse(user) : null
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Check if user is professional
  isProfessional(): boolean {
    const user = this.getUser()
    return user?.is_professional || false
  }

  // Set auth data
  private setAuthData(token: string, user: User) {
    localStorage.setItem(this.tokenKey, token)
    localStorage.setItem(this.userKey, JSON.stringify(user))
    
    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // Clear auth data
  private clearAuthData() {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
    delete axios.defaults.headers.common['Authorization']
  }

  // Initialize axios interceptor
  initializeAxios() {
    const token = this.getToken()
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    // Add response interceptor to handle 401
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Login
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials)
      const { access_token, user } = response.data
      
      this.setAuthData(access_token, user)
      return user
    } catch (error) {
      throw new Error('Identifiants incorrects')
    }
  }

  // Register
  async register(data: RegisterData): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, data)
      const user = response.data
      
      // Auto login after registration
      const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
        email: data.email,
        password: data.password
      })
      
      this.setAuthData(loginResponse.data.access_token, user)
      return user
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Erreur lors de l\'inscription')
    }
  }

  // Logout
  logout() {
    this.clearAuthData()
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`)
      return response.data
    } catch (error) {
      throw new Error('Erreur lors de la récupération du profil')
    }
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await axios.patch(`${API_URL}/api/auth/me`, data)
      const updatedUser = response.data
      
      // Update stored user
      localStorage.setItem(this.userKey, JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du profil')
    }
  }
}

export const authService = new AuthService()

// React hook for auth state
import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.initializeAxios()
    const storedUser = authService.getUser()
    setUser(storedUser)
    setLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials)
    setUser(user)
    return user
  }

  const register = async (data: RegisterData) => {
    const user = await authService.register(data)
    setUser(user)
    return user
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await authService.updateProfile(data)
    setUser(updatedUser)
    return updatedUser
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isProfessional: user?.is_professional || false,
    login,
    register,
    logout,
    updateProfile
  }
}
