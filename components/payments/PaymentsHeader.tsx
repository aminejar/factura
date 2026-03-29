import { CirclePlus, Download } from 'lucide-react'
import Link from 'next/link'

interface PaymentsHeaderProps {
  totalCount: number
}

export default function PaymentsHeader({ totalCount }: PaymentsHeaderProps) {

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/payments/export/excel`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payments-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export payments')
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-2">Payments</h1>
        <p className="text-purple-600">{totalCount} total payments</p>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 rounded-xl text-gray-700 font-semibold shadow-md hover:shadow-lg transition-all border border-purple-100"
        >
          <Download className="h-5 w-5" />
          Export
        </button>
        <Link
          href="/paiements/new"
          className="group inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <CirclePlus className="h-5 w-5" />
          New Payment
        </Link>
      </div>
    </div>
  )
}

