'use client'
import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import InvoiceFormHeader from '@/components/invoices/InvoiceFormHeader'
import InvoiceFormComponent from '@/components/invoices/InvoiceFormComponent'
import CustomerFormHeader from '@/components/customers/CustomerFormHeader'

interface InvoiceData {
    id: string
    numero: string
    client_nom: string
    client_email: string
    montant_ttc: number
    statut: string
    date: string
    dueDate: string
    customer: {
        name: string
        email: string
    }
    value: number
}

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [invoice, setInvoice] = useState<InvoiceData | undefined>()
    const [loading, setLoading] = useState(true)
    const [saveLoading, setSaveLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    setError('Authentication required')
                    setLoading(false)
                    return
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
                const response = await fetch(`${apiUrl}/api/invoices/${resolvedParams.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const invoiceData = await response.json()
                    setInvoice(invoiceData)
                } else {
                    setError('Failed to load invoice')
                }
            } catch (err) {
                setError('Failed to load invoice')
            } finally {
                setLoading(false)
            }
        }

        fetchInvoice()
    }, [resolvedParams.id])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSubmit = async (data: any) => {
        setError(null)
        setSuccess(null)

        try {
            setSaveLoading(true)

            const token = localStorage.getItem('token')
            if (!token) {
                setError('Authentication required')
                return
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

            // Prepare update data - map frontend field names to backend field names
            // For now, focus on invoice-specific fields that can be safely updated
            const updateData: any = {
                total: parseFloat(data.amount), // Backend expects 'total'
                dueDate: data.dueDate,
            }

            // Note: Client information updates would require separate client management
            // The invoice stores clientId, not client name/email directly
            // For this implementation, we'll focus on amount and due date updates

            const response = await fetch(`${apiUrl}/api/invoices/${resolvedParams.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            })

            if (response.ok) {
                const updatedInvoice = await response.json()
                setSuccess('Invoice updated successfully!')
                setTimeout(() => router.push(`/invoices/${resolvedParams.id}`), 1000)
            } else {
                const errorData = await response.json().catch(() => ({}))
                setError(errorData.error || 'Failed to update invoice')
            }
        } catch (err) {
            setError('Failed to update invoice')
        } finally {
            setSaveLoading(false)
        }
    }

    if (loading) return <LoadingSpinner />

    if (!invoice) {
    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-purple-900 mb-4">Invoice Not Found</h1>
            <Link href="/invoices" className="text-purple-600 hover:underline">Back to Invoices</Link>
        </div>
        </main>
    )
    }

    return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
        <CustomerFormHeader title="Edit Invoice" ></CustomerFormHeader>

        {/* Info notice about editing limitations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📝 Editing Invoice</h3>
            <p className="text-blue-800 text-sm">
                You can update the invoice amount and due date. Client information is displayed for reference but cannot be changed from this form.
                To update client details, please use the customer management section.
            </p>
        </div>

        <InvoiceFormComponent
            onSubmit={handleSubmit}
            loading={saveLoading}
            error={error}
            success={success}
            initialData={{
                customerName: invoice.client_nom,
                customerEmail: invoice.client_email,
                amount: invoice.montant_ttc.toString(),
                dueDate: invoice.dueDate,
                description: '', // Add description field if available in invoice data
            }}
            readOnlyFields={['customerName', 'customerEmail']} // Customer info cannot be edited from invoice edit
        />
        </div>
    </main>
    )}
