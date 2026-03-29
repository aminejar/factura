'use client'
import { useState, useEffect } from 'react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCards from '@/components/dashboard/StatsCards'
import Charts from '@/components/dashboard/Charts'
import InvoicesTable from '@/components/dashboard/InvoicesTable'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useInvoices } from '@/lib/hooks/useInvoices'
import { calculateStats } from '@/lib/utils'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { invoices, loading, error } = useInvoices()
  const [loadTime, setLoadTime] = useState(0)

  let stats;
  try {
    stats = calculateStats(invoices)
  } catch (statsError) {
    console.error('Stats calculation error:', statsError)
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Stats Calculation Error</h2>
            <p className="text-yellow-700">{statsError.message}</p>
          </div>
        </div>
      </main>
    )
  }

  // Track loading time
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setLoadTime(0)
    }
  }, [loading])

  // Show timeout error after 10 seconds
  if (loading && loadTime > 10) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-orange-800 mb-2">Loading Timeout</h2>
            <p className="text-orange-700 mb-4">The dashboard is taking longer than expected to load.</p>
            <div className="space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Retry
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Debug logging
  console.log('Dashboard Debug:', {
    invoices: invoices?.length,
    loading,
    error,
    loadTime,
    stats,
    invoiceStatuses: invoices?.map(inv => inv.status)
  })

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Dashboard</h2>
            <p className="text-red-700 mb-4">{error}</p>
            {error.includes('Session expired') || error.includes('Authentication') ? (
              <div className="space-y-2">
                <p className="text-sm text-red-600">Please log in to access your dashboard.</p>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        {/* Show message if no invoices */}
        {invoices.length === 0 && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Welcome to your Dashboard!</h3>
              <p className="text-blue-700 mb-4">
                You don't have any invoices yet. Create your first invoice to see analytics and insights.
              </p>
              <button
                onClick={() => window.location.href = '/paiements/new'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Your First Invoice
              </button>
            </div>
          </div>
        )}

        <StatsCards stats={stats} />
        <Charts />
        <InvoicesTable invoices={invoices} />
      </div>
    </main>
  )
}