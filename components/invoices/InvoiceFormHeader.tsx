/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { User, Mail, FileText, DollarSign, Calendar } from 'lucide-react'
import Alert from '@/components/ui/Alert'

interface InvoiceFormComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void
  loading: boolean
  error: string | null
  success: string | null
  title?: string;
  initialData?: {
    customerName?: string
    customerEmail?: string
    description?: string
    amount?: string
    dueDate?: string
  }
}

export default function InvoiceFormComponent({ 
  onSubmit, 
  loading, 
  error, 
  success,
  initialData 
}: InvoiceFormComponentProps) {
  const [customerName, setCustomerName] = useState(initialData?.customerName || '')
  const [customerEmail, setCustomerEmail] = useState(initialData?.customerEmail || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [amount, setAmount] = useState(initialData?.amount || '')
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '')

  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName || '')
      setCustomerEmail(initialData.customerEmail || '')
      setDescription(initialData.description || '')
      setAmount(initialData.amount || '')
      setDueDate(initialData.dueDate || '')
    }
  }, [initialData])

  const handleSubmit = () => {
    onSubmit({
      customerName,
      customerEmail,
      description,
      amount: parseFloat(amount),
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => window.history.back()}
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

