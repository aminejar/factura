'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  plan?: string
  company?: {
    name: string
    phone: string
    address: string
  }
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  refreshUser: (token?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async (currentToken?: string) => {
    const tokenToUse = currentToken || token
    if (!tokenToUse) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokenToUse}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        // Token is invalid, logout
        logout()
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      // Don't logout on network errors, just log
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for existing token on mount
      const storedToken = localStorage.getItem('token')

      if (storedToken) {
        setToken(storedToken)
        // Always fetch fresh user data from API instead of using potentially stale localStorage data
        try {
          await refreshUser(storedToken)
        } catch (error) {
          console.error('Failed to refresh user data:', error)
          // If API fails, try to use localStorage as fallback
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser)
              setUser(userData)
            } catch (error) {
              console.error('Invalid stored user data')
            }
          }
        }
      }

      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (newToken: string, userData: User) => {
    console.log("🔍 LOGIN FUNCTION CALLED - token:", !!newToken, "user:", !!userData, "company:", !!userData?.company)

    // CRITICAL: Set state immediately and synchronously
    setToken(newToken)
    setUser(userData)
    setLoading(false)

    // Store in localStorage for persistence
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))

    console.log("🔍 LOGIN COMPLETE - user set to:", userData)

    // Force React to process state updates before continuing
    await new Promise(resolve => setTimeout(resolve, 10))
    return userData
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

