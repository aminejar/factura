import { TrendingUp, FileText, CheckCircle2, Clock, ArrowUpRight, CreditCard, AlertTriangle } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalInvoices: number
    paidInvoices: number
    openInvoices: number
    partiallyPaidInvoices: number
    overdueInvoices: number
    uncollectibleInvoices: number
    totalRevenue: number
    paidRevenue: number
    partiallyPaidRevenue: number
    overdueRevenue: number
  }
}
export default function StatsCards({ stats }: StatsCardsProps) {
  const {
    totalInvoices,
    paidInvoices,
    openInvoices,
    partiallyPaidInvoices,
    overdueInvoices,
    uncollectibleInvoices,
    totalRevenue,
    paidRevenue,
    partiallyPaidRevenue,
    overdueRevenue
  } = stats

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      <div className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-100">
        <div className="flex justify-between items-start mb-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-gray-500 text-xs">Total</span>
        </div>
        <p className="text-gray-600 text-xs font-medium mb-1">All Invoices</p>
        <p className="text-gray-900 text-2xl font-bold">{totalInvoices}</p>
      </div>

      <div className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-100">
        <div className="flex justify-between items-start mb-3">
          <div className="bg-emerald-100 p-2 rounded-xl">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            {totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0}%
          </span>
        </div>
        <p className="text-gray-600 text-xs font-medium mb-1">Paid</p>
        <p className="text-gray-900 text-2xl font-bold">{paidInvoices}</p>
        <p className="text-emerald-600 text-xs mt-1 font-medium">
          {(paidRevenue / 100).toFixed(0)} TND
        </p>
      </div>

      <div className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-100">
        <div className="flex justify-between items-start mb-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
            {totalInvoices > 0 ? Math.round((openInvoices / totalInvoices) * 100) : 0}%
          </span>
        </div>
        <p className="text-gray-600 text-xs font-medium mb-1">Open</p>
        <p className="text-gray-900 text-2xl font-bold">{openInvoices}</p>
      </div>

      <div className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-100">
        <div className="flex justify-between items-start mb-3">
          <div className="bg-amber-100 p-2 rounded-xl">
            <CreditCard className="h-5 w-5 text-amber-600" />
          </div>
          <span className="text-amber-600 text-xs font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
            {totalInvoices > 0 ? Math.round((partiallyPaidInvoices / totalInvoices) * 100) : 0}%
          </span>
        </div>
        <p className="text-gray-600 text-xs font-medium mb-1">Partially Paid</p>
        <p className="text-gray-900 text-2xl font-bold">{partiallyPaidInvoices}</p>
        <p className="text-amber-600 text-xs mt-1 font-medium">
          {(partiallyPaidRevenue / 100).toFixed(0)} TND
        </p>
      </div>

      <div className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-purple-100">
        <div className="flex justify-between items-start mb-3">
          <div className="bg-red-100 p-2 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <span className="text-red-600 text-xs font-semibold bg-red-50 px-2 py-0.5 rounded-full">
            {totalInvoices > 0 ? Math.round((overdueInvoices / totalInvoices) * 100) : 0}%
          </span>
        </div>
        <p className="text-gray-600 text-xs font-medium mb-1">Overdue</p>
        <p className="text-gray-900 text-2xl font-bold">{overdueInvoices}</p>
        <p className="text-red-600 text-xs mt-1 font-medium">
          {(overdueRevenue / 100).toFixed(0)} TND
        </p>
      </div>

      <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-white/80 text-xs flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" />
            +12.5%
          </span>
        </div>
        <p className="text-white/90 text-xs font-medium mb-1">Total Revenue</p>
        <p className="text-white text-2xl font-bold">{(totalRevenue / 100).toFixed(0)} TND</p>
      </div>
    </div>
  )
}
