/* eslint-disable @typescript-eslint/no-unused-vars */
import { Trash2 } from 'lucide-react'
import { invoiceStore } from '@/lib/invoiceStore'

function DeleteButton({ invoiceId }: { invoiceId: string }) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      invoiceStore.delete(invoiceId)
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}