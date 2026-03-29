import { Customer } from '@/lib/hooks/useCustomers'
import { Mail, Phone, Building2, TrendingUp, FileText } from 'lucide-react'
import Link from 'next/link'

interface CustomersGridProps {
    customers: Customer[]
}

export default function CustomersGrid({ customers }: CustomersGridProps) {
    if (customers.length === 0) {
    return (
        <div className="bg-white rounded-2xl p-16 text-center shadow-md border border-purple-100">
        <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers yet</h3>
        <p className="text-gray-500 mb-6">Start by adding your first customer</p>
        <Link
            href="/customers/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition"
        >
            Add Customer
        </Link>
        </div>
    )
    }

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
        <div
            key={customer.id}
            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-purple-100"
        >
            <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {(customer.nom || "?").charAt(0).toUpperCase()}
            </div>
            <Link
                href={`/customers/${customer.id}`}
                className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition"
            >
                View
            </Link>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">{customer.nom || "Unknown Customer"}</h3>
            {customer.ville && (
            <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {customer.ville} {customer.pays ? `, ${customer.pays}` : ''}
            </p>
            )}

            <div className="space-y-2 mb-4">
            {customer.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                {customer.email}
                </div>
            )}
            {customer.telephone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                {customer.telephone}
                </div>
            )}
            </div>

            <div className="border-t border-gray-200 pt-4">
            {customer.adresse && (
                <p className="text-sm text-gray-600 mb-2">{customer.adresse}</p>
            )}
            {customer.siret && (
                <p className="text-xs text-gray-500">SIRET: {customer.siret}</p>
            )}
            </div>
        </div>
        ))}
    </div>
    )
}