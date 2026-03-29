import { Mail, Phone, Building2, Calendar, TrendingUp, FileText } from 'lucide-react'

// Define interface to match API response format
interface Customer {
    id: string
    nom: string
    email?: string
    telephone?: string
    adresse?: string
    ville?: string
    code_postal?: string
    pays?: string
    siret?: string
    tva?: string
    created_at?: string
}

interface CustomerDetailCardProps {
    customer: Customer
}

export default function CustomerDetailCard({ customer }: CustomerDetailCardProps) {
    return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-purple-100">
        <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
            {(customer.nom || "?").charAt(0)}
            </div>
            <div>
            <h2 className="text-2xl font-bold text-gray-900">{customer.nom || "Unknown Customer"}</h2>
            <p className="text-gray-600">Customer</p>
            </div>
        </div>
        </div>

        <div className="p-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{customer.email}</p>
                </div>
            </div>

            {customer.telephone && (
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{customer.telephone}</p>
                </div>
                </div>
            )}

            {customer.nom && (
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="font-semibold text-gray-900">{customer.nom}</p>
                </div>
                </div>
            )}

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                <p className="text-xs text-gray-500">Customer Since</p>
                <p className="font-semibold text-gray-900">
                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                    }) : 'Unknown date'}
                </p>
                </div>
            </div>
            </div>

            <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>

            {customer.adresse && (
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <p className="text-sm text-gray-600">Address</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                    {customer.adresse}
                    {customer.ville && `, ${customer.ville}`}
                    {customer.code_postal && ` ${customer.code_postal}`}
                    {customer.pays && `, ${customer.pays}`}
                    </p>
                </div>
            )}

            {(customer.siret || customer.tva) && (
                <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-6 w-6 text-orange-600" />
                    <p className="text-sm text-gray-600">Business Information</p>
                    </div>
                    <div className="space-y-1">
                        {customer.siret && <p className="font-semibold text-gray-900">SIRET: {customer.siret}</p>}
                        {customer.tva && <p className="font-semibold text-gray-900">TVA: {customer.tva}</p>}
                    </div>
                </div>
            )}
            </div>
        </div>
        </div>
    </div>
    )
}