// components/customers/CustomerDetailHeader.tsx
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Define interface to match API response format
interface Customer {
    id: string
    nom: string
    email?: string
    telephone?: string
    adresse?: string
    created_at?: string
}

interface CustomerDetailHeaderProps {
    customer: Customer
}

export default function CustomerDetailHeader({ customer }: CustomerDetailHeaderProps) {
    const router = useRouter()

    const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${customer.nom}?`)) {
        // Note: We're not using the local customerStore anymore since we're using API
        // The delete functionality should be implemented via API call
        // For now, just redirect back to customers
        router.push('/customers')
    }
    }

    return (
    <div className="mb-8">
        <Link
        href="/customers"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition"
        >
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-2">
            {customer.nom}
            </h1>
            <p className="text-purple-600">Customer since {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown date'}</p>
        </div>

        <div className="flex gap-3">
            <Link
            href={`/customers/${customer.id}/edit`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition"
            >
            <Edit className="h-5 w-5" />
            Edit
            </Link>
            <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition"
            >
            <Trash2 className="h-5 w-5" />
            Delete
            </button>
        </div>
        </div>
    </div>
    )
}