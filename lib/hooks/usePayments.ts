import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/context/AuthContext'

export interface Payment {
  id: string | number
  invoice_id?: string | number
  invoice_numero?: string
  client_nom?: string
  montant: number
  date_paiement: string | null
  mode_paiement?: string
  reference?: string
  notes?: string
  created_at?: string
  auto_invoice_created?: boolean
}

// Mock data for development/demo purposes
const mockPayments: Payment[] = [
  {
    id: 1,
    invoice_id: 1,
    invoice_numero: 'FAC-2025-0001',
    client_nom: 'TechCorp SARL',
    montant: 250.00,
    date_paiement: '2025-01-20',
    mode_paiement: 'virement',
    reference: 'VIR-2025-001',
  },
  {
    id: 2,
    invoice_id: 2,
    invoice_numero: 'FAC-2025-0002',
    client_nom: 'Digital Solutions',
    montant: 150.00,
    date_paiement: '2025-01-25',
    mode_paiement: 'stripe',
    reference: 'pi_1234567890',
  },
  {
    id: 3,
    invoice_id: 3,
    invoice_numero: 'FAC-2025-0003',
    client_nom: 'Innovate Plus',
    montant: 180.00,
    date_paiement: '2025-02-01',
    mode_paiement: 'paypal',
    reference: 'PAYID-123456',
  },
]

export function usePayments() {
  const { token, user, loading: authLoading } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = useCallback(async () => {
    if (!token) {
      setPayments([])
      setLoading(false)
      setError('Authentication required.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      try {
        const response = await fetch(`${apiUrl}/api/payments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.status === 401) {
          localStorage.removeItem('token') // Clear invalid token
          throw new Error('Session expired. Please log in again.')
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Server error (${response.status})`)
        }

        const data = await response.json()
        setPayments(Array.isArray(data) ? data : [])
        setError(null)
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        // Specific handling for network issues vs. API errors
        if (fetchError.name === 'AbortError' || fetchError.message.includes('Failed to fetch')) {
          setError('Backend server not accessible or request timed out.')
        } else {
          setError(`API Error: ${fetchError.message}`)
        }
        setPayments([]) // Clear payments on error
      }
    } catch (err: any) {
      console.error('Error fetching payments:', err)
      setError(`An unexpected error occurred: ${err.message}`)
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!authLoading) {
      fetchPayments()
    }
  }, [authLoading, fetchPayments])

  return { payments, loading, error, refetch: fetchPayments }
}

export function usePayment(id: string) {
  const { token, loading: authLoading } = useAuth()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayment = useCallback(async (paymentId: string) => {
    if (!token) {
      setPayment(null)
      setLoading(false)
      setError('Authentication required.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        throw new Error('Session expired. Please log in again.')
      }

      if (!response.ok) {
        throw new Error('Failed to fetch payment')
      }

      const data = await response.json()
      setPayment(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching payment:', err)
      setPayment(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (id && !authLoading) {
      fetchPayment(id)
    }
  }, [id, authLoading, fetchPayment])

  return { payment, loading, error }
}

export function useInvoicePayments(invoiceId: string) {
  const { token } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = useCallback(async () => {
    if (!token || !invoiceId) {
      setPayments([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

      const response = await fetch(`${apiUrl}/api/payments/invoice/${invoiceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        throw new Error('Session expired. Please log in again.')
      }

      if (!response.ok) {
        throw new Error('Failed to fetch invoice payments')
      }

      const data = await response.json()

      setPayments(data)
      setError(null)
    } catch (fetchError: any) {
      setError(fetchError.message || 'Failed to fetch invoice payments')
    } finally {
      setLoading(false)
    }
  }, [token, invoiceId])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments
  }
}

