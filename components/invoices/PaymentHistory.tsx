import { CheckCircle2, Clock } from 'lucide-react'
import { Payment } from '@/lib/hooks/usePayments'

interface PaymentHistoryProps {
  payments: Payment[]
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  if (payments.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-2">Payment History</h4>
        <p className="text-gray-600 text-sm">No payments recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h4 className="font-semibold text-gray-900">Payment History</h4>
        <p className="text-gray-600 text-sm mt-1">{payments.length} payment{payments.length !== 1 ? 's' : ''} recorded</p>
      </div>

      <div className="divide-y divide-gray-100">
        {payments.map((payment) => (
          <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{payment.montant.toFixed(2)} TND</p>
                  <p className="text-sm text-gray-600 capitalize">{payment.mode_paiement?.replace('_', ' ') || 'N/A'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">
                  {payment.date_paiement ? (
                    new Date(payment.date_paiement).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
