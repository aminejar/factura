'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Info } from 'lucide-react'
import Link from 'next/link'
import InvoiceFormComponent from '@/components/invoices/InvoiceFormComponent'

export default function NewInvoicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    setError(null)
    setSuccess(null)

    try {
      setLoading(true)

      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required')
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

      // For now, create a placeholder client or use a default approach
      // In a full implementation, this would require customer selection
      // For demonstration, we'll create a basic invoice structure

      // Prepare invoice data - simplified for manual creation
      const invoiceData = {
        number: `INV-${Date.now()}`, // Generate invoice number
        date: new Date().toISOString().split('T')[0], // Today's date
        dueDate: data.dueDate,
        clientId: 'manual-invoice-client', // Placeholder - would need proper customer management
        items: [{
          description: data.description || 'Manual invoice item',
          quantity: 1,
          price: parseFloat(data.amount)
        }],
        total: parseFloat(data.amount)
      }

      const response = await fetch(`${apiUrl}/api/invoices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })

      if (response.ok) {
        const createdInvoice = await response.json()
        setSuccess('Invoice created successfully!')
        setTimeout(() => router.push(`/invoices/${createdInvoice.id}`), 1000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || 'Failed to create invoice')
      }
    } catch (err: any) {
      setError('Failed to create invoice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/invoices"
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-purple-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-purple-900">Create New Invoice</h1>
            <p className="text-purple-600">Create an invoice with due date and payment terms</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Manual Invoice Creation</h3>
              <p className="text-blue-800 text-sm mb-2">
                Create invoices manually with custom due dates. The due date determines when payments are expected and when the invoice becomes overdue.
              </p>
              <div className="text-xs text-blue-700">
                <strong>Default due date:</strong> 30 days from invoice date (editable)
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Form */}
        <InvoiceFormComponent
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          success={success}
          initialData={{
            customerName: '',
            customerEmail: '',
            amount: '',
            dueDate: '', // Will be set to default (today + 30 days)
            description: ''
          }}
        />
      </div>
    </main>
  )
}
