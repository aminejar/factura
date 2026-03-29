import { Invoice } from '@/lib/mockData'
import { CheckCircle2, Clock, AlertCircle, Eye, FileText, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface InvoicesGridProps {
  invoices: Invoice[]
}

export default function InvoicesGrid({ invoices }: InvoicesGridProps) {
  const icons = {
    paid: CheckCircle2,
    open: Clock,
    partially_paid: CreditCard,
    overdue: AlertCircle,
    uncollectible: AlertCircle,
    void: AlertCircle
  }

  const statusColors = {
    paid: 'bg-emerald-500',
    open: 'bg-blue-500',
    partially_paid: 'bg-amber-500',
    overdue: 'bg-red-500',
    uncollectible: 'bg-gray-500',
    void: 'bg-gray-500'
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center shadow-md border border-purple-100">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No invoices found</h3>
        <p className="text-gray-500 mb-6">Invoices are automatically created when you record payments</p>
        <Link
          href="/paiements/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition"
        >
          Create Payment (Auto Invoice)
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {invoices.map((invoice) => {
        const StatusIcon = icons[invoice.status] || Clock // Fallback to Clock icon
        const statusColor = statusColors[invoice.status] || 'bg-gray-500' // Fallback color

        return (
          <div
            key={invoice.id}
            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-purple-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Invoice #{invoice.id}</p>
                <p className="text-xs text-gray-400">
                  {new Date(invoice.createTs).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${statusColor}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {invoice.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {(invoice.customer?.name || "?").charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{invoice.customer?.name || "Unknown Customer"}</p>
                  <p className="text-xs text-gray-500">{invoice.customer.email}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(invoice.value / 100).toFixed(2)} TND
                </p>
              </div>
              <Link
                href={`/invoices/${invoice.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition"
              >
                <Eye className="h-4 w-4" />
                View
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}