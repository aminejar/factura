import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface CustomerFormHeaderProps {
    title: string
}

export default function CustomerFormHeader({ title }: CustomerFormHeaderProps) {
    return (
    <div className="mb-8">
        <Link
        href="/customers"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition"
        >
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900">{title}</h1>
    </div>
    )
}