import { Invoice } from './mockData'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateStats(invoices: Invoice[]) {
  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter((i) => i.status === 'paid').length
  const openInvoices = invoices.filter((i) => i.status === 'open').length
  const partiallyPaidInvoices = invoices.filter((i) => i.status === 'partially_paid').length
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue').length
  const uncollectibleInvoices = invoices.filter((i) => i.status === 'uncollectible').length

  const totalRevenue = invoices.reduce((acc, i) => acc + i.value, 0)
  const paidRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((acc, i) => acc + i.value, 0)
  const partiallyPaidRevenue = invoices
    .filter((i) => i.status === 'partially_paid')
    .reduce((acc, i) => acc + i.value, 0)
  const overdueRevenue = invoices
    .filter((i) => i.status === 'overdue')
    .reduce((acc, i) => acc + i.value, 0)

  return {
    totalInvoices,
    paidInvoices,
    openInvoices,
    partiallyPaidInvoices,
    overdueInvoices,
    uncollectibleInvoices,
    totalRevenue,
    paidRevenue,
    partiallyPaidRevenue,
    overdueRevenue
  }
}

export function getStatusConfig(status: string) {
  const configs = {
    paid: { color: 'bg-emerald-500', text: 'Paid' },
    unpaid: { color: 'bg-blue-500', text: 'Unpaid' },
    partially_paid: { color: 'bg-amber-500', text: 'Partially Paid' },
    overdue: { color: 'bg-red-500', text: 'Overdue' },
    void: { color: 'bg-gray-500', text: 'Void' },
    // Legacy support for old status values
    open: { color: 'bg-blue-500', text: 'Unpaid' },
    partial: { color: 'bg-amber-500', text: 'Partially Paid' },
    uncollectible: { color: 'bg-red-500', text: 'Overdue' }
  }
  return configs[status as keyof typeof configs] || configs.void
}

