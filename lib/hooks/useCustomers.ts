import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/context/AuthContext'

export interface Customer {
  id: number
  nom: string
  email?: string
  telephone?: string
  adresse?: string
  ville?: string
  code_postal?: string
  pays?: string
  siret?: string
  tva?: string
  created_at?: string
}

export function useCustomers() {
  const { token, user, loading: authLoading } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async () => {
    if (!token) {
      setCustomers([])
      setLoading(false)
      setError('Authentication required.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      try {
        const response = await fetch(`${apiUrl}/api/clients`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.status === 401) {
          localStorage.removeItem('token')
          throw new Error('Session expired. Please log in again.')
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Server error (${response.status})`)
        }

        const data = await response.json()
        const clientsList = Array.isArray(data.clients) ? data.clients : (Array.isArray(data) ? data : [])
        setCustomers(clientsList)
        setError(null)
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        
        if (fetchError.name === 'AbortError' || fetchError.message.includes('fetch')) {
          setError('Backend server not accessible or request timed out.')
        } else {
          setError(`API Error: ${fetchError.message}`)
        }
        setCustomers([])
      }
    } catch (err: any) {
      console.error('Error fetching customers:', err)
      setCustomers([])
      setError(`An unexpected error occurred: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!authLoading) {
      fetchCustomers()
    }
  }, [authLoading, fetchCustomers])

  return { customers, loading, error, refetch: fetchCustomers }
}
