import { useState } from 'react'
import { User, Mail, Phone, Building2 } from 'lucide-react'
import Alert from '@/components/ui/Alert'

interface CustomerFormComponentProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: any) => void
    loading: boolean
    error: string | null
    success: string | null
    }

export default function CustomerFormComponent({ onSubmit, loading, error, success }: CustomerFormComponentProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [company, setCompany] = useState('')

    const handleSubmit = () => {
    onSubmit({ name, email, phone, company })
    }

    return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        <div className="p-8">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className="space-y-6">
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name *</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
            </div>
            </div>

            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
            </div>
            </div>

            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+216 12 345 678"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
            </div>
            </div>

            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
            <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
            </div>
            </div>

            <div className="flex gap-4 pt-4">
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading ? 'Adding...' : 'Add Customer'}
            </button>
            <button
                onClick={() => window.location.href = '/customers'}
                disabled={loading}
                className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
            >
                Cancel
            </button>
            </div>
        </div>
        </div>
    </div>
    )
}