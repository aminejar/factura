import { CirclePlus } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InvoiceExplanationModal from '@/components/invoices/InvoiceExplanationModal'

export default function DashboardHeader() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

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
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-2">Dashboard</h1>
        <p className="text-purple-600">Welcome back! Here&apos;s your business overview</p>
      </div>
      <button
        onClick={handleNewInvoiceClick}
        title="Create a new client and invoice together in one step"
        className="group inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        <CirclePlus className="h-5 w-5" />
        New Client & Invoice
      </button>

      {/* Invoice Explanation Modal */}
      <InvoiceExplanationModal
        isOpen={showModal}
        onClose={handleCancel}
        onContinue={handleContinue}
      />
    </div>
  )
}