import { useState, useEffect } from 'react'
import { User, Mail, FileText, DollarSign, Calendar } from 'lucide-react'
import Alert from '@/components/ui/Alert'

interface InvoiceFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void
  loading: boolean
  error: string | null
  success: string | null
  initialData?: {
    customerName: string;
    customerEmail: string;
    amount: string;
    dueDate?: string;
    description?: string;
  };
  readOnlyFields?: string[]; // Array of field names that should be read-only
}

export default function InvoiceForm({ onSubmit, loading, error, success, initialData, readOnlyFields = [] }: InvoiceFormProps) {
  // Calculate default due date (today + 30 days) for new invoices
  const getDefaultDueDate = () => {
    const today = new Date()
    const defaultDueDate = new Date(today)
    defaultDueDate.setDate(today.getDate() + 30)
    return defaultDueDate.toISOString().split('T')[0]
  }

  const [customerName, setCustomerName] = useState(initialData?.customerName || '')
  const [customerEmail, setCustomerEmail] = useState(initialData?.customerEmail || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [amount, setAmount] = useState(initialData?.amount || '')
  const [dueDate, setDueDate] = useState(initialData?.dueDate || getDefaultDueDate())

  // Update form fields when initialData changes
  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName || '')
      setCustomerEmail(initialData.customerEmail || '')
      setDescription(initialData.description || '')
      setAmount(initialData.amount || '')
      setDueDate(initialData.dueDate || getDefaultDueDate())
    } else {
      // For new invoices, set default due date
      setDueDate(getDefaultDueDate())
    }
  }, [initialData])

  const handleSubmit = () => {
    onSubmit({
      customerName,
      customerEmail,
      description,
      amount: parseFloat(amount) * 100,
      dueDate
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
      <div className="p-8">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  readOnly={readOnlyFields.includes('customerName')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 ${
                    readOnlyFields.includes('customerName')
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  readOnly={readOnlyFields.includes('customerEmail')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 ${
                    readOnlyFields.includes('customerEmail')
                      ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Invoice description..."
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 resize-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (TND)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000.00"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
            <button
              onClick={() => window.location.href = '/invoices'}
              disabled={loading}
              className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}