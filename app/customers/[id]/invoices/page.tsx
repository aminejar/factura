
'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/context/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Customer {
  id: string
  nom: string
  email?: string
}

interface Invoice {
  id: string | number
  numero?: string
  number?: string
  client_nom?: string
  total?: number
  montant_ttc?: number
  paidAmount?: number
  montant_paye?: number
  remainingAmount?: number
  montant_restant?: number
  statut?: 'paid' | 'unpaid' | 'partially_paid' | 'overdue' | 'void' | string
  dueDate?: string
  date?: string
  invoiceDate?: string
}

function formatCurrency(n?: number) {
  const v = typeof n === 'number' ? n : 0
  return `${v.toFixed(2)} TND`
}
function formatDate(d?: string) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('fr-FR') } catch { return d }
}
function badge(status?: string) {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'unpaid': return 'bg-blue-100 text-blue-800'
    case 'partially_paid': return 'bg-yellow-100 text-yellow-800'
    case 'overdue': return 'bg-red-100 text-red-800'
    case 'void': return 'bg-gray-200 text-gray-700'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function CustomerInvoicesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { token, loading: authLoading } = useAuth()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [custError, setCustError] = useState<string | null>(null)
  const [custLoading, setCustLoading] = useState(true)

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invError, setInvError] = useState<string | null>(null)
  const [invLoading, setInvLoading] = useState(true)

  // Fetch customer (for header context)
  useEffect(() => {
    const run = async () => {
      if (!token || authLoading) return
      try {
        setCustLoading(true)
        setCustError(null)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        const res = await fetch(`${apiUrl}/api/clients/${resolvedParams.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.status === 401) { setCustError('Authentication required.'); return }
        if (!res.ok) {
          if (res.status === 404) { setCustomer(null); return }
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error ?? `Server error (${res.status})`)
        }
        const data = await res.json()
        setCustomer({ id: data.id, nom: data.nom ?? data.name ?? 'Unknown', email: data.email })
      } catch (e: any) {
        setCustError(e.message ?? 'Failed to load customer')
        setCustomer(null)
      } finally {
        setCustLoading(false)
      }
    }
    run()
  }, [resolvedParams.id, token, authLoading])

  // Fetch invoices for this customer
  useEffect(() => {
    const run = async () => {
      if (!token || authLoading) return
      try {
        setInvLoading(true)
        setInvError(null)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        let res = await fetch(`${apiUrl}/api/invoices?client_id=${encodeURIComponent(resolvedParams.id)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) {
          res = await fetch(`${apiUrl}/api/invoices/client/${encodeURIComponent(resolvedParams.id)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        }
        if (res.status === 401) { setInvError('Authentication required.'); return }
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error ?? `Failed to load invoices (${res.status})`)
        }
        const list = await res.json()
        const normalized: Invoice[] = Array.isArray(list) ? list.map((inv: any) => ({
          id: inv.id,
          numero: inv.numero ?? inv.number,
          client_nom: inv.client_nom ?? inv.clientName,
          total: inv.montant_ttc ?? inv.total ?? 0,
          paidAmount: inv.montant_paye ?? inv.paidAmount ?? 0,
          remainingAmount: inv.montant_restant ?? inv.remainingAmount ?? Math.max(0, (inv.total ?? 0) - (inv.paidAmount ?? 0)),
          statut: inv.statut ?? inv.status,
          dueDate: inv.dueDate,
          date: inv.date ?? inv.invoiceDate,
        })) : []
        setInvoices(normalized)
      } catch (e: any) {
        setInvError(e.message ?? 'Failed to load invoices')
        setInvoices([])
      } finally {
        setInvLoading(false)
      }
    }
    run()
  }, [resolvedParams.id, token, authLoading])

  if (authLoading || (custLoading && invLoading)) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Customer Invoices</h1>
            <p className="text-indigo-700">
              {customer ? <>Customer: <span className="font-semibold">{customer.nom}</span>{customer.email ? <> — {customer.email}</> : null}</> : '—'}
            </p>
          </div>
          <div className="flex items-center gap-2"> 
            <Link
              href={`/customers/${encodeURIComponent(resolvedParams.id)}`}
              className="px-4 py-2 rounded-xl bg-white border-2 border-indigo-600 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition"
            >
              Back to Customer
            </Link>
          </div>
        </div>

        {/* Errors */}
        {(custError || invError) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            {custError && <p className="mb-1">Customer error: {custError}</p>}
            {invError && <p>Invoices error: {invError}</p>}
          </div>
        )}

        {/* Loading invoices */}
        {invLoading && (
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Empty list */}
        {!invLoading && invoices.length === 0 && (
          <div className="p-6 bg-white border border-indigo-100 rounded-2xl text-center">
            <p className="text-indigo-800">No invoices found for this customer.</p>
            <div className="mt-3">
              <Link
                href={`/factures/new?client_id=${encodeURIComponent(resolvedParams.id)}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition"
              >
                Create the first invoice
              </Link>
            </div>
          </div>
        )}

        {/* Invoices grid */}
        {!invLoading && invoices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.map((inv) => {
              const numero = inv.numero ?? '—'
              const total = inv.total ?? inv.montant_ttc ?? 0
              const paid = inv.paidAmount ?? inv.montant_paye ?? 0
              const remaining = inv.remainingAmount ?? inv.montant_restant ?? Math.max(0, total - paid)
              const status = inv.statut
              const due = inv.dueDate
              const created = inv.date ?? inv.invoiceDate

              return (
                <div key={inv.id} className="bg-white border border-indigo-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Invoice</div>
                      <div className="text-lg font-semibold text-indigo-900">{numero}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge(status)}`}>
                      {status ? status.toUpperCase().replace('_', ' ') : 'UNKNOWN'}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-500">Total</div>
                      <div className="font-medium text-gray-800">{formatCurrency(total)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-500">Paid</div>
                      <div className="font-medium text-gray-800">{formatCurrency(paid)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-500">Remaining</div>
                      <div className="font-medium text-gray-800">{formatCurrency(remaining)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-500">Due date</div>
                      <div className="font-medium text-gray-800">{formatDate(due)}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      href={`/paiements/new?invoice_id=${encodeURIComponent(String(inv.id))}`}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
                    >
                      Record payment
                    </Link>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Created: {formatDate(created)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
