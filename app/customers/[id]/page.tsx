
'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/context/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import CustomerDetailHeader from '@/components/customers/CustomerDetailHeader'
import CustomerDetailCard from '@/components/customers/CustomerDetailCard'

// Use the Customer interface from the store
interface Customer {
  id: string
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

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { token, loading: authLoading } = useAuth()
  const [customer, setCustomer] = useState<Customer | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!token || authLoading) return
      try {
        setLoading(true)
        setError(null)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        const response = await fetch(`${apiUrl}/api/clients/${resolvedParams.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        if (response.status === 401) {
          setError('Authentication required. Please log in again.')
          return
        }
        if (!response.ok) {
          if (response.status === 404) {
            setCustomer(undefined)
            setError(null)
            return
          }
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error ?? `Server error (${response.status})`)
        }
        const customerData = await response.json()
        setCustomer(customerData)
      } catch (err: any) {
        setError(err.message ?? 'Failed to load customer')
        setCustomer(undefined)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [resolvedParams.id, token, authLoading])

  // Show loading while auth is loading or customer is being fetched
  if (authLoading || loading) return <LoadingSpinner />

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-900 mb-4">Error Loading Customer</h1>
          <p className="text-red-600 mb-8">{error}</p>
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition"
          >
            Back to Customers
          </Link>
        </div>
      </main>
    )
  }

  // Show not found state
  if (!customer) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Customer Not Found</h1>
          <p className="text-purple-600 mb-8">The customer you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition"
          >
            Back to Customers
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="sr-only">Customer</h1>
          <div className="flex items-center gap-2">
            {/* NEW Invoices button (opens invoices page for this customer) */}
            <Link
              href={`/customers/${encodeURIComponent(customer.id)}/invoices`}
              
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-sm hover:shadow-md"
            >
              Invoices
            </Link>
            
          </div>
        </div>
        
        {/* Customer Details */}
        <CustomerDetailHeader customer={customer} />
        <CustomerDetailCard customer={customer} />
      </div>
    </main>
  )
}
