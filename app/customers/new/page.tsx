'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CustomerFormHeader from '@/components/customers/CustomerFormHeader'
import CustomerFormComponent from '@/components/customers/CustomerFormComponent'
import { useAuth } from '@/lib/context/AuthContext'

export default function NewCustomerPage() {
    const { user, loading: authLoading } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    // Block rendering until auth is ready and user exists
    if (authLoading || !user) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <CustomerFormHeader title="Add New Customer" />
                    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                <span className="ml-3 text-gray-600">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (data: any) => {
        setError(null)
        setSuccess(null)

    if (!data.name?.trim() || !data.email?.trim()) {
        setError('Name and email are required')
        return
    }

        // Use user ID as company identifier
        const companyId = user.id
        console.log('🔍 ADD CUSTOMER - Using user.id as companyId:', companyId)

        try {
            setLoading(true)

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
            const token = localStorage.getItem('token')

            console.log('🔍 ADD CUSTOMER - Making API call with companyId:', companyId)

            const response = await fetch(`${apiUrl}/api/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone || '',
                    address: '',
                    company: data.company || '',
                    companyId: companyId // Associate with user's company
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || `Server error (${response.status})`)
            }

            const newCustomer = await response.json()
            console.log('🔍 ADD CUSTOMER - Customer created successfully:', newCustomer)

            setSuccess('Customer added successfully!')

            // Refetch customers and navigate back
            setTimeout(() => {
                router.push('/customers?refresh=true')
            }, 1000)

        } catch (err: any) {
            console.error('🔍 ADD CUSTOMER - Error:', err)
            setError(err.message || 'Failed to add customer')
        } finally {
            setLoading(false)
        }
    }

    return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
        <CustomerFormHeader title="Add New Customer" />
        <CustomerFormComponent
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            success={success}
            />
        </div>
    </main>
    )
}