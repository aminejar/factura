import { Invoice } from '@/lib/mockData'
import { CheckCircle2, Clock, AlertCircle, Mail, Calendar, DollarSign, CreditCard } from 'lucide-react'

interface InvoiceDetailCardProps {
  invoice: Invoice
}

export default function InvoiceDetailCard({ invoice }: InvoiceDetailCardProps) {
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

  const StatusIcon = icons[invoice.status] || Clock // Fallback to Clock icon
  const statusColor = statusColors[invoice.status] || 'bg-gray-500' // Fallback color

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden mb-8">
      {/* Header with status */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-purple-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Invoice Details</h2>
            <p className="text-gray-600">All information about this invoice</p>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white ${statusColor}`}>
            <StatusIcon className="h-5 w-5" />
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-8">
        {/* Customer Info */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="h-4 w-4 text-purple-600" />
            </div>
            Customer Information
          </h3>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {(invoice.customer?.name || "?").charAt(0)}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 mb-1">{invoice.customer.name}</p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {invoice.customer.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Amount */}
          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-700">Amount</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {(invoice.value / 100).toFixed(2)} TND
            </p>
          </div>

          {/* Date */}
          <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl border border-pink-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-700">Created Date</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {new Date(invoice.createTs).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-2">Payment Status</h4>
          <p className="text-blue-700">
            {invoice.status === 'paid' && '✅ This invoice has been paid in full.'}
            {invoice.status === 'open' && '⏳ This invoice is awaiting payment.'}
            {invoice.status === 'partially_paid' && '💳 This invoice has been partially paid.'}
            {invoice.status === 'overdue' && '⚠️ This invoice is past due and requires immediate payment.'}
            {invoice.status === 'uncollectible' && '❌ This invoice has been marked as uncollectible.'}
            {invoice.status === 'void' && '🚫 This invoice has been voided.'}
          </p>
        </div>
      </div>
    </div>
  )
}
