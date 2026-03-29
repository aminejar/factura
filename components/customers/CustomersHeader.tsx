import { UserPlus } from 'lucide-react'
import Link from 'next/link'

interface CustomersHeaderProps {
  totalCount: number
}

export default function CustomersHeader({ totalCount }: CustomersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-2">Customers</h1>
        <p className="text-purple-600">{totalCount} total customers</p>
      </div>
      <Link
        href="/customers/new"
        className="group inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        <UserPlus className="h-5 w-5" />
        Add Customer
      </Link>
    </div>
  )
}