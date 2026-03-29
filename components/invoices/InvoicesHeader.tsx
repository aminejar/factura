import { CirclePlus, Download } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInvoices } from '@/lib/hooks/useInvoices'
import InvoiceExplanationModal from './InvoiceExplanationModal'

interface InvoicesHeaderProps {
  totalCount: number
}

export default function InvoicesHeader({ totalCount }: InvoicesHeaderProps) {
  const { invoices } = useInvoices()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const handleExport = () => {
    // Export vers CSV
    const headers = ['ID', 'Date', 'Customer', 'Email', 'Status', 'Amount (TND)']
    const rows = invoices.map(inv => [
      inv.id,
      new Date(inv.createTs).toLocaleDateString(),
      inv.customer.name,
      inv.customer.email,
      inv.status,
      (inv.value / 100).toFixed(2)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleNewInvoiceClick = () => {
    setShowModal(true)
  }

  const handleContinue = () => {
    setShowModal(false)
    router.push('/paiements/new')
  }

  const handleCancel = () => {
    setShowModal(false)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-2">Invoices</h1>
        <p className="text-purple-600">{totalCount} total invoices</p>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 rounded-xl text-gray-700 font-semibold shadow-md hover:shadow-lg transition-all border border-purple-100"
        >
          <Download className="h-5 w-5" />
          Export
        </button>
        <button
          onClick={handleNewInvoiceClick}
          title="Create a new client and invoice together in one step"
          className="group inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <CirclePlus className="h-5 w-5" />
          New Client & Invoice
        </button>
      </div>

      {/* Invoice Explanation Modal */}
      <InvoiceExplanationModal
        isOpen={showModal}
        onClose={handleCancel}
        onContinue={handleContinue}
      />
    </div>
  )
}