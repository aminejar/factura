'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import InvoicesHeader from '@/components/invoices/InvoicesHeader'
import InvoicesFilters from '@/components/invoices/InvoicesFilters'
import InvoicesGrid from '@/components/invoices/InvoicesGrid'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useInvoices } from '@/lib/hooks/useInvoices'

function InvoicesPageContent() {
  const searchParams = useSearchParams()
  const { invoices, loading, error, refetch } = useInvoices()
  const [filter, setFilter] = useState<'all' | 'paid' | 'open' | 'partially_paid' | 'overdue' | 'uncollectible'>('all')

  // Refresh when URL has refresh parameter (after creating invoice)
  useEffect(() => {
    const refreshParam = searchParams.get('refresh')
    if (refreshParam) {
      console.log('Refresh parameter detected, refetching invoices...')
      window.history.replaceState({}, '', '/invoices')
      setTimeout(() => {
        refetch()
      }, 500)
    }
  }, [searchParams, refetch])

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter)

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
        <InvoicesHeader totalCount={invoices.length} />
        <InvoicesFilters
          currentFilter={filter}
          onFilterChange={setFilter}
          counts={{
            all: invoices.length,
            paid: invoices.filter(i => i.status === 'paid').length,
            open: invoices.filter(i => i.status === 'open').length,
            partially_paid: invoices.filter(i => i.status === 'partially_paid').length,
            overdue: invoices.filter(i => i.status === 'overdue').length,
            uncollectible: invoices.filter(i => i.status === 'uncollectible').length
          }}
        />
        <InvoicesGrid invoices={filteredInvoices} />
      </div>
    </main>
  )
}

export default function InvoicesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSpinner />}>
        <InvoicesPageContent />
      </Suspense>
    </ProtectedRoute>
  )
}
