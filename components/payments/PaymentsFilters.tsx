import { CreditCard, Wallet, Banknote, Building2 } from 'lucide-react'

interface PaymentsFiltersProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
  counts: {
    all: number
    stripe: number
    paypal: number
    virement: number
    cheque: number
    especes: number
    carte: number
  }
}

export default function PaymentsFilters({ currentFilter, onFilterChange, counts }: PaymentsFiltersProps) {
  const filters = [
    { id: 'all', label: 'All', icon: CreditCard, count: counts.all },
    { id: 'stripe', label: 'Stripe', icon: CreditCard, count: counts.stripe },
    { id: 'paypal', label: 'PayPal', icon: Wallet, count: counts.paypal },
    { id: 'virement', label: 'Virement', icon: Building2, count: counts.virement },
    { id: 'cheque', label: 'Chèque', icon: Banknote, count: counts.cheque },
    { id: 'especes', label: 'Espèces', icon: Banknote, count: counts.especes },
    { id: 'carte', label: 'Carte', icon: CreditCard, count: counts.carte },
  ]

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon
          const isActive = currentFilter === filter.id
          
          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-purple-50 border border-purple-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {filter.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                isActive ? 'bg-white/20' : 'bg-purple-100 text-purple-700'
              }`}>
                {filter.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}






