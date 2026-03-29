import { useState, useEffect } from 'react'
import { Building2, MapPin, Phone, Save } from 'lucide-react'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/lib/context/AuthContext'

export default function CompanySettings() {
    const { user, refreshUser, loading: authLoading } = useAuth()
    const [formData, setFormData] = useState({
        companyName: '',
        address: '',
        phone: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)

    // DEBUG: Confirm user is present immediately after login
    console.log("🔍 SETTINGS RENDER - user:", user, "authLoading:", authLoading)

    // Block rendering until auth is ready
    if (authLoading || !user) {
        return (
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <span className="ml-3 text-gray-600">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    // Synchronize form state when user data arrives
    useEffect(() => {
        if (user?.company) {
            setFormData({
                companyName: user.company.name ?? '',
                address: user.company.address ?? '',
                phone: user.company.phone ?? ''
            })
        }
    }, [user])

    const handleSave = async () => {
        // Frontend validation
        if (!formData.companyName.trim() || !formData.phone.trim() || !formData.address.trim()) {
            setSuccess(null)
            // You could add an error state here
            return
        }

        // Check if data actually changed
        const hasNameChanged = formData.companyName.trim() !== (user?.company?.name || '')
        const hasPhoneChanged = formData.phone.trim() !== (user?.company?.phone || '')
        const hasAddressChanged = formData.address.trim() !== (user?.company?.address || '')

        if (!hasNameChanged && !hasPhoneChanged && !hasAddressChanged) {
            setSuccess('No changes to save')
            return
        }

        setLoading(true)
        setSuccess(null)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

            const response = await fetch(`${apiUrl}/api/company`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: formData.companyName.trim(),
                    address: formData.address.trim(),
                    phone: formData.phone.trim()
                })
            })

            if (response.ok) {
                const data = await response.json()
                setSuccess('Company information updated successfully!')

                // Refresh user data in context
                await refreshUser()

                // Update localStorage with new user data
                if (user) {
                    const updatedUser = {
                        ...user,
                        company: data.company
                    }
                    localStorage.setItem('user', JSON.stringify(updatedUser))
                }
            } else {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || 'Failed to update company information')
            }
        } catch (error: any) {
            console.error('Company update error:', error)
            setSuccess(null)
            // You might want to show an error state here
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>

        {success && <Alert type="success" message={success} />}

        <div className="space-y-6">
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
            <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
            </div>
            </div>

            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
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
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
            </div>
            </div>

            <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
            <Save className="h-5 w-5" />
            {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
        </div>
    </div>
    )
}