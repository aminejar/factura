import { Ban, Send, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface InvoiceActionsProps {
  invoice: any // Using any for now since we're transitioning from mock data
}

export default function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const router = useRouter()

  // Accounting safety rules
  const canDelete = invoice.statut === 'draft' && (!invoice.montant_paye || invoice.montant_paye === 0)
  const canCancel = invoice.statut !== 'void'

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this invoice? This will mark it as void.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Authentication required')
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/invoices/${invoice.id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'User canceled from UI' })
      })

      if (response.ok) {
        alert('Invoice canceled successfully')
        router.refresh()
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      alert('Failed to cancel invoice')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Authentication required')
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/invoices/${invoice.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('Invoice deleted successfully')
        router.push('/invoices')
      } else {
        const error = await response.json()
        alert('Error: ' + error.error)
      }
    } catch (error) {
      alert('Failed to delete invoice')
    }
  }

  const handleSendReminder = () => {
    alert('Reminder functionality not implemented yet')
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Actions</h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Send Reminder - only for open invoices */}
          {invoice.statut === 'open' && (
            <button
              onClick={handleSendReminder}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-semibold transition border border-blue-200"
            >
              <Send className="h-5 w-5" />
              Send Reminder
            </button>
          )}

          {/* Cancel Invoice - for all non-void invoices */}
          {canCancel && (
            <button
              onClick={handleCancel}
              className="flex items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-semibold transition border border-amber-200"
            >
              <Ban className="h-5 w-5" />
              Cancel Invoice
            </button>
          )}

          {/* Delete Invoice - only for draft invoices with no payments */}
          <div className="relative">
            <button
              onClick={handleDelete}
              disabled={!canDelete}
              className={`flex items-center gap-3 p-4 rounded-xl font-semibold transition border ${
                canDelete
                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                  : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
              title={
                !canDelete
                  ? 'Can only delete draft invoices with no payments'
                  : 'Delete this invoice permanently'
              }
            >
              <XCircle className="h-5 w-5" />
              Delete Invoice
            </button>
            {!canDelete && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Locked
              </div>
            )}
          </div>
        </div>

        {/* Accounting Safety Notice */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">🛡️ Accounting Safety</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Invoices with payments cannot be deleted</li>
            <li>• Only draft invoices can be deleted</li>
            <li>• Use "Cancel" for safe invoice removal</li>
            <li>• All actions are logged for audit trail</li>
          </ul>
        </div>
      </div>
    </div>
  )
}