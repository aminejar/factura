'use client'
import { use } from 'react'
import Link from 'next/link'
import { useInvoice } from '@/lib/hooks/useInvoices'
import { useInvoicePayments } from '@/lib/hooks/usePayments'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import InvoiceDetailHeader from '@/components/invoices/InvoiceDetailHeader'
import InvoiceDetailCard from '@/components/invoices/InvoiceDetailCard'
import InvoiceActions from '@/components/invoices/InvoiceActionsComponent'
import PaymentHistory from '@/components/invoices/PaymentHistory'

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { invoice, loading } = useInvoice(resolvedParams.id)
  const { payments: invoicePayments, loading: paymentsLoading } = useInvoicePayments(resolvedParams.id)

  if (loading) return <LoadingSpinner />

  if (!invoice) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Invoice Not Found</h1>
          <p className="text-purple-600 mb-8">The invoice you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/invoices"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition"
          >
            Back to Invoices
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <InvoiceDetailHeader invoice={invoice} />
        <InvoiceDetailCard invoice={invoice} />
        <div className="mt-8">
          <PaymentHistory payments={invoicePayments} />
        </div>
        <InvoiceActions invoice={invoice} />
      </div>
    </main>
  )
}