import { Payment } from '@/lib/hooks/usePayments'
import { CreditCard, Wallet, Building2, Banknote, Eye, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'

interface PaymentsGridProps {
  payments: Payment[]
}

export default function PaymentsGrid({ payments }: PaymentsGridProps) {
  const getPaymentIcon = (mode: string | undefined) => {
    if (!mode) return CreditCard
    switch (mode.toLowerCase()) {
      case 'stripe':
      case 'carte':
        return CreditCard
      case 'paypal':
        return Wallet
      case 'virement':
        return Building2
      case 'cheque':
      case 'especes':
        return Banknote
      default:
        return CreditCard
    }
  }

  const getPaymentColor = (mode: string | undefined) => {
    if (!mode) return 'bg-gray-500'
    switch (mode.toLowerCase()) {
      case 'stripe':
        return 'bg-blue-500'
      case 'paypal':
        return 'bg-yellow-500'
      case 'virement':
        return 'bg-green-500'
      case 'cheque':
        return 'bg-purple-500'
      case 'especes':
        return 'bg-gray-500'
      case 'carte':
        return 'bg-indigo-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center shadow-md border border-purple-100">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No payments found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your filters or record a new payment</p>
        <Link
          href="/invoices"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition"
        >
          View Invoices
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {payments.filter(payment => payment && payment.id).map((payment) => {
        const PaymentIcon = getPaymentIcon(payment.mode_paiement)
        const paymentColor = getPaymentColor(payment.mode_paiement)

        return (
          <div
            key={payment.id}
            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-purple-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment #{payment.id}</p>
                {payment.invoice_numero && (
                  <p className="text-xs text-gray-400">Invoice: {payment.invoice_numero}</p>
                )}
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${paymentColor}`}>
                <PaymentIcon className="h-3.5 w-3.5" />
                {payment.mode_paiement}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {payment.client_nom?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{payment.client_nom || 'Client'}</p>
                  {payment.reference && (
                    <p className="text-xs text-gray-500">Ref: {payment.reference}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {payment.date_paiement ? (
                    new Date(payment.date_paiement).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payment.montant.toFixed(2)} TND
                </p>
              </div>
              {payment.invoice_id && (
                <Link
                  href={`/invoices/${payment.invoice_id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition"
                >
                  <Eye className="h-4 w-4" />
                  View Invoice
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}






