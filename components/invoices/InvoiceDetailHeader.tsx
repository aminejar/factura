import { ArrowLeft, Download, Edit } from 'lucide-react'
import Link from 'next/link'
import { Invoice } from '@/lib/mockData'

interface InvoiceDetailHeaderProps {
  invoice: Invoice
}

export default function InvoiceDetailHeader({ invoice }: InvoiceDetailHeaderProps) {
  const handleDownload = () => {
    const content = `
INVOICE #${invoice.id}
Date: ${new Date(invoice.createTs).toLocaleDateString()}

CUSTOMER:
${invoice.customer.name}
${invoice.customer.email}

AMOUNT: ${(invoice.value / 100).toFixed(2)} TND
STATUS: ${invoice.status.toUpperCase()}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${invoice.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="mb-8">
      <Link
        href="/invoices"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Invoices
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-2">
            Invoice #{invoice.id}
          </h1>
          <p className="text-purple-600">
            Created on {new Date(invoice.createTs).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 rounded-xl text-gray-700 font-semibold shadow-md hover:shadow-lg transition border border-purple-100"
          >
            <Download className="h-5 w-5" />
            Download PDF
          </button>
          <Link
            href={`/invoices/${invoice.id}/edit`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition"
          >
            <Edit className="h-5 w-5" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  )
}
