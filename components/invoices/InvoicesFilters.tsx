import { FileText, CheckCircle2, Clock, AlertTriangle, CreditCard } from 'lucide-react'

interface InvoicesFiltersProps {
  currentFilter: 'all' | 'paid' | 'open' | 'partially_paid' | 'overdue' | 'uncollectible'
  onFilterChange: (filter: 'all' | 'paid' | 'open' | 'partially_paid' | 'overdue' | 'uncollectible') => void
  counts: {
    all: number
    paid: number
    open: number
    partially_paid: number
    overdue: number
    uncollectible: number
  }
}

export default function InvoicesFilters({ currentFilter, onFilterChange, counts }: InvoicesFiltersProps) {
  const filters = [
    { key: 'all', label: 'All', icon: FileText, color: 'purple', count: counts.all },
    { key: 'paid', label: 'Paid', icon: CheckCircle2, color: 'emerald', count: counts.paid },
    { key: 'open', label: 'Open', icon: Clock, color: 'blue', count: counts.open },
    { key: 'partially_paid', label: 'Partially Paid', icon: CreditCard, color: 'amber', count: counts.partially_paid },
    { key: 'overdue', label: 'Overdue', icon: AlertTriangle, color: 'red', count: counts.overdue },
    { key: 'uncollectible', label: 'Uncollectible', icon: AlertTriangle, color: 'gray', count: counts.uncollectible },
  ] as const

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {filters.map(({ key, label, icon: Icon, color, count }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`p-5 rounded-2xl transition-all transform hover:scale-105 ${
            currentFilter === key
              ? `bg-${color}-600 text-white shadow-lg`
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-purple-100'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Icon className="h-6 w-6" />
            <span className="text-2xl font-bold">{count}</span>
          </div>
          <p className="text-sm font-semibold">{label}</p>
        </button>
      ))}
    </div>
  )
}