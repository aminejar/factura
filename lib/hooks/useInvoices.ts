import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/context/AuthContext'

export interface Invoice {
  id: string
  createTs: string
  status: 'open' | 'paid' | 'partially_paid' | 'overdue' | 'uncollectible' | 'void'
  value: number
  customer: {
    name: string
    email: string
  }
  // Additional fields for API compatibility
  numero?: string
  client_id?: number
  client_nom?: string
  date_emission?: string
  date_echeance?: string
  statut?: string
  montant_ht?: number
  montant_tva?: number
  montant_ttc?: number
  montant_paye?: number
  montant_restant?: number
  notes?: string
  created_at?: string
  dueDate?: string
}

export function useInvoices() {
  const { token, user, loading: authLoading } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    if (!token) {
      setInvoices([])
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
        const response = await fetch(`${apiUrl}/api/invoices`, {
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
        const invoicesList = Array.isArray(data) ? data : []
        
        // Transform API data to match expected format
        const transformedInvoices = invoicesList.map((inv: any) => ({
          ...inv,
          status: inv.statut || 'open', // Now using English statuses directly from backend
          value: Math.round((inv.montant_ttc || 0) * 100), // Convert to cents, handle undefined
          customer: {
            name: inv.client_nom || 'Unknown',
            email: inv.client_email || ''
          },
          createTs: inv.date_emission || inv.created_at || new Date().toISOString(),
          // Include payment tracking fields
          paidAmount: inv.montant_paye || 0,
          remainingAmount: inv.montant_restant || inv.montant_ttc || 0
        }))
        
        setInvoices(transformedInvoices)
        setError(null)
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        
        if (fetchError.name === 'AbortError' || fetchError.message.includes('fetch')) {
          setError('Backend server not accessible or request timed out.')
        } else {
          setError(`API Error: ${fetchError.message}`)
        }
        setInvoices([])
      }
    } catch (err: any) {
      console.error('Error fetching invoices:', err)
      setInvoices([])
      setError(`An unexpected error occurred: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!authLoading) {
      fetchInvoices()
    }
  }, [authLoading, fetchInvoices])

  return { invoices, loading, error, refetch: fetchInvoices }
}

export function useInvoice(id: string) {
  const { token, loading: authLoading } = useAuth()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoice = useCallback(async (invoiceId: string) => {
    if (!token) {
      setInvoice(null)
      setLoading(false)
      setError('Authentication required.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      
      const response = await fetch(`${apiUrl}/api/invoices/${invoiceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        throw new Error('Session expired. Please log in again.')
      }

      if (!response.ok) {
        throw new Error('Failed to fetch invoice')
      }

      const data = await response.json()
      
      const transformedInvoice = {
        ...data,
        status: data.statut || 'open', // Now using English statuses directly from backend
        value: Math.round(data.montant_ttc * 100),
        customer: {
          name: data.client_nom || 'Unknown',
          email: data.client_email || ''
        },
        createTs: data.date_emission || data.created_at
      }
      
      setInvoice(transformedInvoice)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching invoice:', err)
      setInvoice(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (id && !authLoading) {
      fetchInvoice(id)
    }
  }, [id, authLoading, fetchInvoice])

  return { invoice, loading, error }
}
