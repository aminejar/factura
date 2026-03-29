import { Filter, Download, FileText, CheckCircle2, Clock, AlertCircle, CreditCard, ChevronRight } from 'lucide-react'
import { Invoice } from '@/lib/hooks/useInvoices'
import { getStatusConfig } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'

interface InvoicesTableProps {
  invoices: Invoice[]
}

export default function InvoicesTable({ invoices }: InvoicesTableProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'open' | 'partially_paid' | 'overdue' | 'uncollectible'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)


  // Handle scroll indicator visibility
  useEffect(() => {
    const checkScrollIndicator = () => {
      if (dropdownRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current
        const hasOverflow = scrollHeight > clientHeight
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5 // 5px tolerance

        setShowScrollIndicator(hasOverflow && !isAtBottom)
      }
    }

    if (showFilters && dropdownRef.current) {
      // Check initially
      checkScrollIndicator()

      // Add scroll listener
      const dropdown = dropdownRef.current
      dropdown.addEventListener('scroll', checkScrollIndicator)

      return () => {
        dropdown.removeEventListener('scroll', checkScrollIndicator)
      }
    }
  }, [showFilters])

  // Close filter dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowFilters(false)
      }
    }

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showFilters])

  // Filter invoices based on selected status
  const filteredInvoices = statusFilter === 'all'
    ? invoices
    : invoices.filter(invoice => invoice.status === statusFilter)

  const icons = {
    paid: CheckCircle2,
    open: Clock,
    partially_paid: CreditCard,
    overdue: AlertCircle,
    uncollectible: AlertCircle,
    void: AlertCircle
  }

  // Export functionality
  const handleExport = () => {
    const headers = ['ID', 'Date', 'Customer', 'Email', 'Status', 'Amount (TND)']
    const rows = filteredInvoices.map(inv => [
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
    a.download = `dashboard-invoices-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-purple-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Recent Invoices</h2>
          <p className="text-gray-600 text-sm">Track and manage your latest transactions</p>
        </div>
        <div className="flex gap-2">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium relative ${
                showFilters
                  ? 'bg-purple-100 text-purple-700 border border-purple-200 shadow-sm'
                  : statusFilter !== 'all'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-sm'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filter ({filteredInvoices.length})</span>
              {statusFilter !== 'all' && (
                <div className="flex items-center gap-1 ml-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <ChevronRight className="w-3 h-3 text-blue-600" />
                </div>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-52 max-h-80">
                <div
                  ref={dropdownRef}
                  className="overflow-y-auto p-3 max-h-80"
                >
                {[
                  { key: 'all', label: 'All Invoices' },
                  { key: 'paid', label: 'Paid' },
                  { key: 'open', label: 'Open' },
                  { key: 'partially_paid', label: 'Partially Paid' },
                  { key: 'overdue', label: 'Overdue' },
                  { key: 'uncollectible', label: 'Uncollectible' }
                ].map(({ key, label }) => {
                  const count = key === 'all' ? invoices.length : invoices.filter(inv => inv.status === key).length
                  return (
                    <button
                      key={key}
                      onClick={(e) => {
                        e.preventDefault()
                        setStatusFilter(key as any)
                        setTimeout(() => setShowFilters(false), 100)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center justify-between group ${
                        statusFilter === key
                          ? 'bg-purple-100 text-purple-800 font-semibold border border-purple-200 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{label}</span>
                        {statusFilter === key && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                          statusFilter === key
                            ? 'bg-purple-200 text-purple-800'
                            : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                        }`}>
                          {count}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-all duration-200 transform ${
                          statusFilter === key
                            ? 'text-purple-600 opacity-100 translate-x-0'
                            : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-gray-600 group-hover:translate-x-0.5'
                        }`} />
                      </div>
                    </button>
                  )
                })}
                </div>

                {/* Simple scroll indicator */}
                {showScrollIndicator && (
                  <div className="absolute bottom-1 right-2 pointer-events-none text-gray-400 text-xs">
                    ▼
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Export ({filteredInvoices.length})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-gray-700 font-semibold text-sm">Date</th>
              <th className="text-left p-4 text-gray-700 font-semibold text-sm">Customer</th>
              <th className="text-left p-4 text-gray-700 font-semibold text-sm">Email</th>
              <th className="text-center p-4 text-gray-700 font-semibold text-sm">Status</th>
              <th className="text-right p-4 text-gray-700 font-semibold text-sm">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInvoices.map((invoice) => {
              const statusConfig = getStatusConfig(invoice.status)
              const StatusIcon = icons[invoice.status as keyof typeof icons]
              
              return (
                <tr key={invoice.id} className="hover:bg-purple-50 transition-colors cursor-pointer group">
                  <td className="p-4">
                    <span className="text-gray-900 font-medium">
                      {new Date(invoice.createTs).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {(invoice.customer?.name || "?").charAt(0)}
                      </div>
                      <span className="text-gray-900 font-semibold group-hover:text-purple-700 transition">
                        {invoice.customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600 text-sm">{invoice.customer.email}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${statusConfig.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusConfig.text}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-gray-900 font-bold text-lg">
                      {(invoice.value / 100).toFixed(2)} TND
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            {statusFilter === 'all' ? 'No invoices found' : `No ${statusFilter.replace('_', ' ')} invoices`}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {statusFilter === 'all' ? 'Create your first invoice to get started' : 'Try changing the filter'}
          </p>
        </div>
      )}
    </div>
  )
}