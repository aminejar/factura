'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PaymentsHeader from '@/components/payments/PaymentsHeader'
import PaymentsFilters from '@/components/payments/PaymentsFilters'
import PaymentsGrid from '@/components/payments/PaymentsGrid'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { usePayments } from '@/lib/hooks/usePayments'

function PaymentsPageContent() {
  const searchParams = useSearchParams()
  const { payments, loading, error, refetch } = usePayments()
  const [filter, setFilter] = useState<string>('all')
  
 
  useEffect(() => {
    console.log('PaymentsPage mounted, payments count:', payments.length)
    let token = localStorage.getItem('token')
    if (!token) {
      token = `demo_token_${Date.now()}`
      localStorage.setItem('token', token)
      console.log('No token found. Generated demo token for this session.')
    } else {
      console.log('Token exists:', !!token)
    }
  }, [])
  
  useEffect(() => {
    const handleFocus = () => {
      refetch()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetch])

  useEffect(() => {
    const refreshParam = searchParams.get('refresh')
    if (refreshParam) {
      console.log('Refresh parameter detected, refetching payments...')
      // Remove the refresh parameter from URL
      window.history.replaceState({}, '', '/paiements')
      // Refetch payments after a short delay to ensure backend has processed
      setTimeout(() => {
        refetch()
      }, 500)
    }
  }, [searchParams, refetch])

  const filteredPayments = useMemo(() => {
    if (filter === 'all') return payments
    return payments.filter(p => (p.mode_paiement || '').toLowerCase() === filter.toLowerCase())
  }, [payments, filter])

  const counts = useMemo(() => {
    return {
      all: payments.length,
      stripe: payments.filter(p => (p.mode_paiement || '').toLowerCase() === 'stripe').length,
      paypal: payments.filter(p => (p.mode_paiement || '').toLowerCase() === 'paypal').length,
      virement: payments.filter(p => (p.mode_paiement || '').toLowerCase() === 'virement').length,
      cheque: payments.filter(p => (p.mode_paiement || '').toLowerCase() === 'cheque').length,
      especes: payments.filter(p => (p.mode_paiement || '').toLowerCase() === 'especes').length,
      carte: payments.filter(p => (p.mode_paiement || '').toLowerCase() === 'carte').length,
    }
  }, [payments])

  if (loading) return <LoadingSpinner />

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
        <PaymentsHeader totalCount={payments.length} />
        <PaymentsFilters 
          currentFilter={filter} 
          onFilterChange={setFilter}
          counts={counts}
        />
        <PaymentsGrid payments={filteredPayments} />
      </div>
    </main>
  )
}

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSpinner />}>
        <PaymentsPageContent />
      </Suspense>
    </ProtectedRoute>
  )
}
