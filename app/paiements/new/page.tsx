
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft, Save, FileText, User, CreditCard, Receipt, Building2, Calendar, DollarSign, Plus, Trash2
} from 'lucide-react'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useInvoices } from '@/lib/hooks/useInvoices'

type CreationMode = 'existing_invoice' | 'existing_client' | 'new_client'

interface Invoice {
  id: number
  numero: string
  client_nom?: string
  montant_ttc?: number
  montant_ht?: number
  montant_tva?: number
  statut?: string
  dueDate?: string
}

// Products
interface Product {
  id: string | number
  name: string
  description?: string
  price: number
}

// Selected invoice items
interface InvoiceItemUI {
  rowId: string
  product_id?: string | number
  name?: string
  unit_price?: number
  quantity: number
  total: number
}

function NewPaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const invoiceIdParam = searchParams.get('invoice_id')

  const { invoices, loading: invoicesLoading } = useInvoices()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Mode
  const [creationMode, setCreationMode] = useState<CreationMode>('existing_invoice')

  // Clients
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [clients, setClients] = useState<any[]>([])
  const [clientsLoading, setClientsLoading] = useState<boolean>(false)

  // Products
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState<boolean>(false)

  // Form data (shared)
  const [formData, setFormData] = useState({
    invoice_id: invoiceIdParam ?? '',
    montant: '',
    date_paiement: new Date().toISOString().split('T')[0],
    mode_paiement: 'virement',
    reference: '',
    notes: '',
    // Client fields (new_client mode)
    client_nom: '',
    client_email: '',
    client_telephone: '',
    client_adresse: '',
    // Invoice fields (existing_client + new_client modes)
    invoice_montant: '', // auto-calculated from products selection
    due_date: '',
    invoice_description: '',
  })

  // Existing invoice details
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<any>(null)
  const [invoiceLocked, setInvoiceLocked] = useState(false)
  const [paymentValidation, setPaymentValidation] = useState<{ isValid: boolean; message: string }>({
    isValid: false, message: ''
  })

  // Selected invoice items (for existing_client + new_client modes)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemUI[]>([])

  // Auto-calculated totals from items
  const itemsTotal = invoiceItems.reduce((sum, it) => sum + (it.total || 0), 0)

  // Fetch clients & products on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setClientsLoading(true)
        const token = localStorage.getItem('token')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        const res = await fetch(`${apiUrl}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to load clients')
        const data = await res.json()
        setClients(data)
      } catch (e) {
        console.error('Error fetching clients:', e)
      } finally {
        setClientsLoading(false)
      }
    }
    const fetchProducts = async () => {
      try {
        setProductsLoading(true)
        const token = localStorage.getItem('token')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        const res = await fetch(`${apiUrl}/api/products`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Error fetching products:', e)
      } finally {
        setProductsLoading(false)
      }
    }
    fetchClients()
    fetchProducts()
  }, [])

  // Keep formData.invoice_montant in sync with itemsTotal for the two creation modes
  useEffect(() => {
    if (creationMode === 'existing_client' || creationMode === 'new_client') {
      setFormData(prev => ({ ...prev, invoice_montant: itemsTotal > 0 ? String(itemsTotal.toFixed(2)) : '' }))
    }
  }, [itemsTotal, creationMode])

  // Update formData when invoiceIdParam changes
  useEffect(() => {
    if (invoiceIdParam && invoiceIdParam !== formData.invoice_id) {
      setFormData(prev => ({ ...prev, invoice_id: invoiceIdParam }))
      setCreationMode('existing_invoice')
      handleInvoiceSelection(invoiceIdParam)
    }
  }, [invoiceIdParam]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch complete invoice data from backend
  const fetchInvoiceData = async (invoiceId: string) => {
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const response = await fetch(`${apiUrl}/api/invoices/${invoiceId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to fetch invoice data')
      const invoiceData = await response.json()
      return invoiceData
    } catch (error) {
      console.error('Error fetching invoice data:', error)
      return null
    }
  }

  // Handle invoice selection
  const handleInvoiceSelection = async (invoiceId: string) => {
    if (!invoiceId) {
      setSelectedInvoiceData(null)
      setInvoiceLocked(false)
      setPaymentValidation({ isValid: false, message: '' })
      return
    }
    const basicInvoice = invoices.find(inv => inv.id.toString() === invoiceId)
    if (!basicInvoice) { setError('Invoice not found'); return }
    const completeInvoiceData = await fetchInvoiceData(invoiceId)
    if (!completeInvoiceData) { setError('Failed to load invoice details'); return }

    const invoiceStatus = completeInvoiceData.status ?? completeInvoiceData.statut
    if (invoiceStatus === 'paid') {
      setError('This invoice is already fully paid. No additional payments can be added.')
      setSelectedInvoiceData(null)
      setPaymentValidation({ isValid: false, message: '' })
      return
    }
    if (invoiceStatus === 'void') {
      setError('This invoice has been cancelled. Payments are not allowed.')
      setSelectedInvoiceData(null)
      setPaymentValidation({ isValid: false, message: '' })
      return
    }
    const remainingBalance =
      completeInvoiceData.remainingAmount ?? completeInvoiceData.montant_restant ?? 0
    if (remainingBalance <= 0) {
      setError('This invoice has no remaining balance. It is already fully paid.')
      setSelectedInvoiceData(null)
      setPaymentValidation({ isValid: false, message: '' })
      return
    }

    setSelectedInvoiceData({
      id: completeInvoiceData.id,
      numero: completeInvoiceData.numero ?? completeInvoiceData.number,
      client_nom: completeInvoiceData.client_nom ?? completeInvoiceData.clientName,
      client_email: completeInvoiceData.client_email ?? completeInvoiceData.clientEmail,
      montant_ttc: completeInvoiceData.montant_ttc ?? completeInvoiceData.total ?? 0,
      montant_paye: completeInvoiceData.montant_paye ?? completeInvoiceData.paidAmount ?? 0,
      montant_restant: remainingBalance,
      statut: invoiceStatus,
      dueDate: completeInvoiceData.dueDate,
      date: completeInvoiceData.date ?? completeInvoiceData.invoiceDate,
      created_at: completeInvoiceData.created_at
    })

    setInvoiceLocked(true)
    setError(null)
    setPaymentValidation({ isValid: false, message: 'Enter payment amount' })
  }

  // General change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (creationMode === 'existing_invoice' && name === 'invoice_id') {
      handleInvoiceSelection(value)
    }
    if (creationMode === 'existing_invoice' && name === 'montant' && selectedInvoiceData) {
      validatePaymentAmount(value)
    }
    if (name === 'date_paiement') {
      const dateError = validatePaymentDate(value)
      if (dateError) setError(dateError)
      else setError(null)
    }
  }

  // Payment amount validation (existing_invoice mode)
  const validatePaymentAmount = (amount: string) => {
    const paymentAmount = parseFloat(amount)
    if (!amount || isNaN(paymentAmount)) {
      setPaymentValidation({ isValid: false, message: 'Please enter a valid payment amount' })
      return
    }
    if (paymentAmount <= 0) {
      setPaymentValidation({ isValid: false, message: 'Payment amount must be greater than zero' })
      return
    }
    if (selectedInvoiceData) {
      if (paymentAmount > selectedInvoiceData.montant_restant) {
        setPaymentValidation({
          isValid: false,
          message: `Payment amount (${paymentAmount.toFixed(2)} TND) cannot exceed remaining balance (${selectedInvoiceData.montant_restant.toFixed(2)} TND)`
        })
        return
      }
      if (paymentAmount > selectedInvoiceData.montant_ttc) {
        setPaymentValidation({
          isValid: false,
          message: `Payment amount (${paymentAmount.toFixed(2)} TND) cannot exceed invoice total (${selectedInvoiceData.montant_ttc.toFixed(2)} TND)`
        })
        return
      }
      if (paymentAmount === selectedInvoiceData.montant_restant && selectedInvoiceData.montant_restant > 0) {
        setPaymentValidation({ isValid: true, message: `✅ This payment will fully pay the invoice` })
        return
      }
    }
    setPaymentValidation({ isValid: true, message: selectedInvoiceData ? `Valid payment amount` : '' })
  }

  // Validate payment date
  const validatePaymentDate = (date: string) => {
    if (!date) return null
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (selectedDate > today) return 'Payment date cannot be in the future'
    if (creationMode === 'existing_invoice' && selectedInvoiceData?.date) {
      const invoiceCreateDate = new Date(selectedInvoiceData.date)
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
      const invoiceDateOnly = new Date(invoiceCreateDate.getFullYear(), invoiceCreateDate.getMonth(), invoiceCreateDate.getDate())
      if (selectedDateOnly < invoiceDateOnly) {
        return 'Payment date cannot be before invoice creation date'
      }
    }
    return null
  }

  // Helper: add an item row
  const addItemRow = () => {
    setInvoiceItems(prev => [
      ...prev,
      {
        rowId: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        quantity: 1,
        total: 0,
      }
    ])
  }

  // Helper: remove an item row
  const removeItemRow = (rowId: string) => {
    setInvoiceItems(prev => prev.filter(r => r.rowId !== rowId))
  }

  // Helper: update item fields and recalc totals
  const updateItemRow = (rowId: string, updates: Partial<InvoiceItemUI>) => {
    setInvoiceItems(prev => prev.map(row => {
      if (row.rowId !== rowId) return row
      const next: InvoiceItemUI = { ...row, ...updates }
      const q = Number(next.quantity || 0)
      const p = Number(next.unit_price || 0)
      next.total = q > 0 && p > 0 ? q * p : 0
      return next
    }))
  }

  const selectedInvoice = invoices.find(inv => inv.id.toString() === formData.invoice_id) as Invoice | undefined

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const amount = parseFloat(formData.montant)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid payment amount')
      return
    }
    const dateError = validatePaymentDate(formData.date_paiement)
    if (dateError) { setError(dateError); return }

    // Mode-specific validations
    if (creationMode === 'existing_invoice') {
      if (!formData.invoice_id || !formData.montant || !formData.date_paiement || !formData.mode_paiement) {
        setError('Please fill in all required fields (Invoice, Amount, Payment Date, Payment Method)')
        return
      }
      if (selectedInvoiceData) {
        const remainingBalance = selectedInvoiceData.montant_restant
        if (amount > remainingBalance) {
          setError(`Payment amount (${amount.toFixed(2)} TND) cannot exceed remaining balance (${remainingBalance.toFixed(2)} TND)`)
          return
        }
        if (selectedInvoiceData.date) {
          const paymentDate = new Date(formData.date_paiement)
          const invoiceDate = new Date(selectedInvoiceData.date)
          const paymentDateOnly = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), paymentDate.getDate())
          const invoiceDateOnly = new Date(invoiceDate.getFullYear(), invoiceDate.getMonth(), invoiceDate.getDate())
          if (paymentDateOnly < invoiceDateOnly) {
            setError('Payment date cannot be before the invoice creation date')
            return
          }
        }
      }
    }

    if (creationMode === 'existing_client' || creationMode === 'new_client') {
      // Must have items
      if (invoiceItems.length === 0) {
        setError('Please add at least one product to the invoice')
        return
      }
      // compute itemsTotal
      const invoiceAmount = itemsTotal
      if (invoiceAmount <= 0) {
        setError('Invoice total must be greater than zero')
        return
      }
      if (invoiceAmount < amount) {
        setError('Invoice amount cannot be less than payment amount')
        return
      }
      if (!formData.due_date) {
        setError('Please fill in due date')
        return
      }
      const dueDateOnly = new Date(formData.due_date)
      const today = new Date(); today.setHours(0,0,0,0)
      if (dueDateOnly < today) {
        setError('Due date cannot be in the past')
        return
      }
    }

    if (creationMode === 'new_client') {
      if (!formData.client_nom || !formData.client_email) {
        setError('Please fill in client name and email'); return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.client_email)) {
        setError('Please enter a valid email address')
        return
      }
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        setError('You must be logged in to create a payment. Redirecting to login...')
        setTimeout(() => { router.push(`/login?redirect=${encodeURIComponent('/paiements/new')}`) }, 2000)
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const requestBody: any = {
        montant: amount,
        date_paiement: formData.date_paiement,
        mode_paiement: formData.mode_paiement,
        reference: formData.reference || null,
        notes: formData.notes || null,
      }

      if (creationMode === 'existing_invoice') {
        requestBody.invoiceId = formData.invoice_id
      }

      // Build invoice_items from UI rows for the two auto-create modes
      const invoice_items =
        (creationMode === 'existing_client' || creationMode === 'new_client')
          ? invoiceItems.map(it => ({
              product_id: it.product_id,
              name: it.name,
              unit_price: it.unit_price,
              quantity: it.quantity,
            }))
          : undefined

      if (creationMode === 'existing_client') {
        requestBody.auto_create_invoice = true
        requestBody.client_id = selectedClientId
        requestBody.invoice_montant = itemsTotal.toFixed(2)
        requestBody.due_date = formData.due_date
        requestBody.invoice_description = formData.invoice_description || null
        requestBody.invoice_items = invoice_items
      }

      if (creationMode === 'new_client') {
        requestBody.auto_create_invoice = true
        requestBody.client_nom = formData.client_nom
        requestBody.client_email = formData.client_email
        requestBody.client_telephone = formData.client_telephone || null
        requestBody.client_adresse = formData.client_adresse || null
        requestBody.invoice_montant = itemsTotal.toFixed(2)
        requestBody.due_date = formData.due_date
        requestBody.invoice_description = formData.invoice_description || null
        requestBody.invoice_items = invoice_items

        // Calculate payment_terms from due date (days from today)
        const today = new Date()
        const dueDate = new Date(formData.due_date)
        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        requestBody.payment_terms = Math.max(1, diffDays)
      }

      const response = await fetch(`${apiUrl}/api/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        setError('Your session has expired. Redirecting to login...')
        setTimeout(() => { router.push(`/login?redirect=${encodeURIComponent('/paiements/new')}`) }, 2000)
        return
      }

      if (!response.ok) {
        let errorMessage = 'Failed to create payment'
        try {
          const errorData = await response.json()
          if (errorData.error) {
            if (errorData.error.includes('Cannot add payment to a cancelled invoice')) {
              errorMessage = '❌ Cannot add payment to a cancelled invoice. Please select a different invoice.'
            } else if (errorData.error.includes('Cannot add payment to an already fully paid invoice')) {
              errorMessage = '❌ This invoice is already fully paid. No additional payments are needed.'
            } else if (errorData.error.includes('Cannot add payment to an uncollectible invoice')) {
              errorMessage = '❌ This invoice is uncollectible (past due date). Contact the client for resolution.'
            } else if (errorData.error.includes('ne peut pas être antérieure')) {
              errorMessage = '❌ Payment date cannot be before the invoice creation date. Please select a valid payment date.'
            } else if (errorData.error.includes('cannot exceed remaining balance')) {
              errorMessage = '❌ Payment amount exceeds the remaining balance. Please adjust the amount.'
            } else if (errorData.error.includes('cannot exceed invoice total')) {
              errorMessage = '❌ Payment amount cannot exceed the invoice total. Please check the amount.'
            } else {
              errorMessage = `❌ ${errorData.error}`
            }
          }
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError)
        }
        throw new Error(errorMessage)
      }

      const paymentData = await response.json()
      console.log('✅ Payment created successfully:', paymentData)

      let successMessage = `✅ Success! Payment of ${amount.toFixed(2)} TND created successfully.`
      if (paymentData.invoice_numero) {
        successMessage = `✅ Success! Payment of ${amount.toFixed(2)} TND applied to Invoice: ${paymentData.invoice_numero}.`
      }
      if (paymentData.invoiceStatus) {
        const statusMessages: Record<string, string> = {
          paid: '🎉 Invoice is now fully paid!',
          unpaid: '📊 Invoice has remaining balance',
          overdue: '⚠️ Invoice is still overdue',
        }
        const suffix = statusMessages[paymentData.invoiceStatus] ?? `Status: ${paymentData.invoiceStatus}`
        successMessage += ` ${suffix}`
      }

      setSuccess(successMessage)
      setTimeout(() => { router.push('/paiements?refresh=' + Date.now()) }, 2500)
    } catch (err: any) {
      const token = localStorage.getItem('token')
      if (token?.startsWith('demo_token_')) {
        setSuccess('Payment recorded (demo mode). Connect to backend API to save real payments.')
        setTimeout(() => { router.push('/paiements?refresh=' + Date.now()) }, 2000)
      } else {
        const errorMessage = err.message ?? 'Failed to create payment'
        setError(errorMessage)
        if (!errorMessage.includes('❌') && !errorMessage.includes('Cannot add payment')) {
          console.error('Payment creation error details:', {
            message: errorMessage, originalError: err.message, stack: err.stack
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/paiements" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors">
            <ArrowLeft className="h-6 w-6 text-purple-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-purple-900">Professional Payment Management</h1>
            <p className="text-purple-600">Record payments for existing invoices or create new clients with complete billing solutions.</p>
          </div>
        </div>

        {/* Banner */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Building2 className="h-6 w-6 text-blue-600 mt-0.5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Professional Invoice & Payment Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span><strong>New Client:</strong> Create profile + invoice + record payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-blue-600" />
                    <span><strong>Existing Client:</strong> Create invoice & record payment</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span><strong>Existing Invoice:</strong> Apply payment & update status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span><strong>Full Audit:</strong> Complete payment history</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-800 font-medium">Business Rule:</span>
                  <span className="text-amber-700">Invoice Amount = What client owes • Payment Amount = What you received</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode selector */}
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setCreationMode('existing_invoice')
              setSelectedInvoiceData(null)
              setFormData(prev => ({ ...prev, invoice_id: '' }))
              setInvoiceLocked(false)
              setPaymentValidation({ isValid: false, message: '' })
              setError(null)
            }}
            className={`px-3 py-2 rounded-xl border ${creationMode === 'existing_invoice' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-300'}`}
          >
            Existing Invoice
          </button>
          <button
            type="button"
            onClick={() => {
              setCreationMode('existing_client')
              setSelectedInvoiceData(null)
              setFormData(prev => ({ ...prev, invoice_id: '' }))
              setInvoiceLocked(false)
              setPaymentValidation({ isValid: false, message: '' })
              setError(null)
            }}
            className={`px-3 py-2 rounded-xl border ${creationMode === 'existing_client' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-300'}`}
          >
            Existing Client + New Invoice
          </button>
          <button
            type="button"
            onClick={() => {
              setCreationMode('new_client')
              setSelectedInvoiceData(null)
              setFormData(prev => ({ ...prev, invoice_id: '' }))
              setInvoiceLocked(false)
              setPaymentValidation({ isValid: false, message: '' })
              setError(null)
            }}
            className={`px-3 py-2 rounded-xl border ${creationMode === 'new_client' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-300'}`}
          >
            New Client + New Invoice
          </button>
        </div>

        {/* Errors / Success */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl border ${error.includes('❌') || error.includes('Cannot add payment') ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-2">
              <div className={`text-lg ${error.includes('❌') || error.includes('Cannot add payment') ? 'text-amber-600' : 'text-red-600'}`}>
                {error.includes('❌') || error.includes('Cannot add payment') ? '⚠️' : '❌'}
              </div>
              <div>
                <p className={`font-medium ${error.includes('❌') || error.includes('Cannot add payment') ? 'text-amber-800' : 'text-red-800'}`}>
                  {error.includes('❌') || error.includes('Cannot add payment') ? error.replace('❌ ', '').replace('Cannot add payment', 'Payment blocked') : error}
                </p>
                {(error.includes('cancelled') || error.includes('fully paid') || error.includes('uncollectible')) && (
                  <p className="text-sm text-gray-600 mt-1">
                    Please select a different invoice or contact the client for resolution.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Body */}
        {invoicesLoading && (
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
            <LoadingSpinner />
          </div>
        )}

        {!invoicesLoading && (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Existing Invoice */}
            {creationMode === 'existing_invoice' && (
              <div className="border-b border-purple-200 pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-purple-900">Invoice Selection</h2>
                    <p className="text-sm text-purple-600">Choose an existing invoice</p>
                  </div>
                </div>

                {/* Select invoice */}
                <div>
                  <label htmlFor="invoice_id" className="block text-sm font-semibold text-purple-900 mb-2">
                    Invoice *
                  </label>
                  <select
                    id="invoice_id"
                    name="invoice_id"
                    value={formData.invoice_id}
                    onChange={handleChange}
                    required
                    disabled={invoiceLocked}
                    className={`w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900 bg-white ${invoiceLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select an existing invoice</option>
                    {invoices.map((invoice) => {
                      const canAddPayment = invoice.statut !== 'paid' && invoice.statut !== 'void';
                      const statusText = invoice.statut === 'paid' ? 'PAID' :
                        invoice.statut === 'unpaid' ? 'UNPAID' :
                        invoice.statut === 'partially_paid' ? 'PARTIALLY PAID' :
                        invoice.statut === 'overdue' ? 'OVERDUE' :
                        invoice.statut?.toUpperCase() ?? 'UNKNOWN';
                      const dueDateDisplay = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('fr-FR') : 'No due date';
                      return (
                        <option key={invoice.id} value={invoice.id} disabled={!canAddPayment}>
                          {invoice.numero} - {invoice.client_nom ?? 'Unknown'} - {(invoice.montant_ttc ?? 0).toFixed(2)} TND
                          {invoice.dueDate && ` - Due: ${dueDateDisplay}`} ({statusText})
                          {!canAddPayment && ' - Cannot add payment'}
                        </option>
                      );
                    })}
                  </select>

                  {/* Lock controls and info */}
                  {invoiceLocked && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        🔒 Invoice locked - Click reset to change
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, invoice_id: '' }))
                          setSelectedInvoiceData(null)
                          setInvoiceLocked(false)
                          setPaymentValidation({ isValid: false, message: '' })
                          setError(null)
                        }}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
                      >
                        Reset
                      </button>
                    </div>
                  )}

                  {/* Selected invoice details */}
                  {selectedInvoiceData && (
                    <div className="mt-4 space-y-4">
                      {selectedInvoiceData.statut === 'overdue' && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 text-xl">⚠️</span>
                            <div>
                              <h4 className="font-semibold text-red-900">Invoice is Overdue</h4>
                              <p className="text-red-700 text-sm">This invoice is past its due date. Payment is still accepted but consider following up with the client.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Info */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-3">📄 Invoice Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <p className="text-blue-700"><strong>Invoice Number:</strong> {selectedInvoiceData.numero}</p>
                            <p className="text-blue-700"><strong>Client:</strong> {selectedInvoiceData.client_nom}</p>
                            {selectedInvoiceData.client_email && (
                              <p className="text-blue-700"><strong>Email:</strong> {selectedInvoiceData.client_email}</p>
                            )}
                            <p className="text-blue-700">
                              <strong>Status:</strong>
                              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                                selectedInvoiceData.statut === 'paid' ? 'bg-green-100 text-green-800' :
                                selectedInvoiceData.statut === 'unpaid' ? 'bg-blue-100 text-blue-800' :
                                selectedInvoiceData.statut === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' :
                                selectedInvoiceData.statut === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {selectedInvoiceData.statut === 'partially_paid' ? 'PARTIALLY PAID' :
                                 selectedInvoiceData.statut === 'unpaid' ? 'UNPAID' :
                                 selectedInvoiceData.statut === 'paid' ? 'PAID' :
                                 selectedInvoiceData.statut === 'overdue' ? 'OVERDUE' :
                                 selectedInvoiceData.statut?.toUpperCase()}
                              </span>
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-blue-700"><strong>Invoice Amount:</strong> {selectedInvoiceData.montant_ttc.toFixed(2)} TND</p>
                            <p className="text-blue-700"><strong>Total Paid:</strong> {selectedInvoiceData.montant_paye.toFixed(2)} TND</p>
                            <p className="text-blue-700"><strong>Remaining Amount:</strong> {selectedInvoiceData.montant_restant.toFixed(2)} TND</p>
                            {selectedInvoiceData.dueDate && (
                              <p className="text-blue-700">
                                <strong>Due Date:</strong> {(() => { try { return new Date(selectedInvoiceData.dueDate).toLocaleDateString('fr-FR'); } catch { return 'Invalid date'; } })()}
                                {(() => {
                                  const today = new Date()
                                  const dueDate = new Date(selectedInvoiceData.dueDate)
                                  const diffTime = dueDate.getTime() - today.getTime()
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                  if (diffDays < 0) return <span className="ml-2 text-red-600 font-medium">(Overdue by {Math.abs(diffDays)} days)</span>
                                  if (diffDays === 0) return <span className="ml-2 text-orange-600 font-medium">(Due today)</span>
                                  if (diffDays <= 7) return <span className="ml-2 text-yellow-600 font-medium">(Due in {diffDays} days)</span>
                                  return <span className="ml-2 text-green-600 font-medium">(Due in {diffDays} days)</span>
                                })()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Limits & Rules */}
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">💰 Payment Information</h4>
                        <div className="text-green-700 text-sm space-y-1">
                          <p><strong>Maximum Payment Allowed:</strong> {selectedInvoiceData.montant_restant.toFixed(2)} TND</p>
                          <p><strong>Invoice Total Amount:</strong> {selectedInvoiceData.montant_ttc.toFixed(2)} TND</p>
                          <p><strong>Outstanding Balance:</strong> {selectedInvoiceData.montant_restant.toFixed(2)} TND</p>
                          {selectedInvoiceData.montant_paye === 0 && (
                            <p className="text-blue-600 font-medium">💡 This is the first payment for this invoice</p>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-2">📋 Payment Rules</h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>• Due date belongs to the invoice only (cannot be edited here)</li>
                          <li>• Payment amount must be ≤ remaining balance</li>
                          <li>• Payment date cannot be in the future</li>
                          <li>• Invoice status will update automatically after payment</li>
                          <li>• Paid invoices cannot receive additional payments</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Existing Client + New Invoice */}
            {creationMode === 'existing_client' && (
              <div className="border-b border-purple-200 pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-purple-900">Select Existing Client</h2>
                    <p className="text-sm text-purple-600">We will create a new invoice for this client, add products, and record the payment.</p>
                  </div>
                </div>

                {/* Client dropdown */}
                <label className="block text-sm font-semibold text-purple-900 mb-2">Client *</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-purple-200 rounded-xl bg-white text-purple-900"
                >
                  <option value="">Select client</option>
                  {clientsLoading && <option value="">Loading clients...</option>}
                  {!clientsLoading && clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom ?? c.name ?? 'Unknown Customer'} {c.email ? `— ${c.email}` : ''}
                    </option>
                  ))}
                </select>

                {/* Due date & description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="due_date" className="block text-sm font-semibold text-purple-900 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      id="due_date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                    />
                    <p className="text-xs text-purple-600 mt-1">Deadline for payment - used to calculate overdue status</p>
                  </div>
                  <div className="md:col-span-1">
                    <label htmlFor="invoice_description" className="block text-sm font-semibold text-purple-900 mb-2">
                      Invoice Description
                    </label>
                    <textarea
                      id="invoice_description"
                      name="invoice_description"
                      value={formData.invoice_description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-purple-900"
                      placeholder="Optional description of services"
                    />
                  </div>
                </div>

                {/* Product selection */}
                <div className="mt-6 p-4 bg-white border border-purple-200 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-purple-900">Products</h3>
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold"
                    >
                      <Plus className="h-4 w-4" /> Add product
                    </button>
                  </div>

                  {productsLoading && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-800">
                      Loading products...
                    </div>
                  )}

                  {!productsLoading && invoiceItems.length === 0 && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-800">
                      No products added yet. Click <strong>Add product</strong> to start.
                    </div>
                  )}

                  {!productsLoading && invoiceItems.length > 0 && (
                    <div className="space-y-3">
                      {invoiceItems.map((row) => (
                        <div key={row.rowId} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                          {/* Product select */}
                          <div className="md:col-span-5">
                            <label className="block text-xs font-semibold text-purple-900 mb-1">Product *</label>
                            <select
                              value={row.product_id ?? ''}
                              onChange={(e) => {
                                const pid = e.target.value
                                const p = products.find(pr => String(pr.id) === pid)
                                updateItemRow(row.rowId, {
                                  product_id: pid || undefined,
                                  name: p?.name,
                                  unit_price: p?.price ?? 0,
                                })
                              }}
                              required
                              className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white text-purple-900"
                            >
                              <option value="">Select product</option>
                              {products.map(p => (
                                <option key={p.id} value={String(p.id)}>
                                  {p.name} — {(p.price ?? 0).toFixed(2)} TND
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Unit price */}
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-purple-900 mb-1">Unit price</label>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              value={row.unit_price ?? 0}
                              onChange={(e) => updateItemRow(row.rowId, { unit_price: Number(e.target.value) })}
                              className="w-full px-3 py-2 border border-purple-200 rounded-lg text-purple-900"
                              placeholder="0.00"
                            />
                          </div>

                          {/* Quantity */}
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-purple-900 mb-1">Qty</label>
                            <input
                              type="number"
                              min={1}
                              step={1}
                              value={row.quantity}
                              onChange={(e) => updateItemRow(row.rowId, { quantity: Number(e.target.value) })}
                              className="w-full px-3 py-2 border border-purple-200 rounded-lg text-purple-900"
                              placeholder="1"
                            />
                          </div>

                          {/* Line total */}
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-purple-900 mb-1">Line total</label>
                            <div className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-gray-50 text-purple-900">
                              {(row.total || 0).toFixed(2)} TND
                            </div>
                          </div>

                          {/* Remove */}
                          <div className="md:col-span-1">
                            <button
                              type="button"
                              onClick={() => removeItemRow(row.rowId)}
                              className="w-full inline-flex items-center justify-center px-3 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50"
                              title="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Totals */}
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-800 font-medium">Invoice total (auto)</span>
                      <span className="text-lg text-purple-900 font-bold">{itemsTotal.toFixed(2)} TND</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">
                      The invoice total is calculated automatically from selected products (unit price × quantity).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* New Client + New Invoice */}
            {creationMode === 'new_client' && (
              <>
                {/* Client Information */}
                <div className="border-b border-purple-200 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-purple-900">Client Information</h2>
                      <p className="text-sm text-purple-600">Create a new customer profile</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="client_nom" className="block text-sm font-semibold text-purple-900 mb-2">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        id="client_nom"
                        name="client_nom"
                        value={formData.client_nom}
                        onChange={handleChange}
                        required={creationMode === 'new_client'}
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <label htmlFor="client_email" className="block text-sm font-semibold text-purple-900 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="client_email"
                        name="client_email"
                        value={formData.client_email}
                        onChange={handleChange}
                        required={creationMode === 'new_client'}
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                        placeholder="client@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="client_telephone" className="block text-sm font-semibold text-purple-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="client_telephone"
                        name="client_telephone"
                        value={formData.client_telephone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="client_adresse" className="block text-sm font-semibold text-purple-900 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        id="client_adresse"
                        name="client_adresse"
                        value={formData.client_adresse}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                        placeholder="Street address, city, country"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Information */}
                <div className="border-b border-purple-200 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Receipt className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-purple-900">Invoice Information</h2>
                      <p className="text-sm text-purple-600">Add products and set the billing terms</p>
                    </div>
                  </div>

                  {/* Due date & description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="due_date" className="block text-sm font-semibold text-purple-900 mb-2">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        id="due_date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        required={creationMode === 'new_client'}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label htmlFor="invoice_description" className="block text-sm font-semibold text-purple-900 mb-2">
                        Invoice Description
                      </label>
                      <textarea
                        id="invoice_description"
                        name="invoice_description"
                        value={formData.invoice_description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-purple-900"
                        placeholder="Optional description of services"
                      />
                    </div>
                  </div>

                  {/* Product selection */}
                  <div className="mt-6 p-4 bg-white border border-purple-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-purple-900">Products</h3>
                      <button
                        type="button"
                        onClick={addItemRow}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold"
                      >
                        <Plus className="h-4 w-4" /> Add product
                      </button>
                    </div>

                    {productsLoading && (
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-800">
                        Loading products...
                      </div>
                    )}

                    {!productsLoading && invoiceItems.length === 0 && (
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-800">
                        No products added yet. Click <strong>Add product</strong> to start.
                      </div>
                    )}

                    {!productsLoading && invoiceItems.length > 0 && (
                      <div className="space-y-3">
                        {invoiceItems.map((row) => (
                          <div key={row.rowId} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            {/* Product select */}
                            <div className="md:col-span-5">
                              <label className="block text-xs font-semibold text-purple-900 mb-1">Product *</label>
                              <select
                                value={row.product_id ?? ''}
                                onChange={(e) => {
                                  const pid = e.target.value
                                  const p = products.find(pr => String(pr.id) === pid)
                                  updateItemRow(row.rowId, {
                                    product_id: pid || undefined,
                                    name: p?.name,
                                    unit_price: p?.price ?? 0,
                                  })
                                }}
                                required
                                className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-white text-purple-900"
                              >
                                <option value="">Select product</option>
                                {products.map(p => (
                                  <option key={p.id} value={String(p.id)}>
                                    {p.name} — {(p.price ?? 0).toFixed(2)} TND
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Unit price */}
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-purple-900 mb-1">Unit price</label>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={row.unit_price ?? 0}
                                onChange={(e) => updateItemRow(row.rowId, { unit_price: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-purple-200 rounded-lg text-purple-900"
                                placeholder="0.00"
                              />
                            </div>

                            {/* Quantity */}
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-purple-900 mb-1">Qty</label>
                              <input
                                type="number"
                                min={1}
                                step={1}
                                value={row.quantity}
                                onChange={(e) => updateItemRow(row.rowId, { quantity: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-purple-200 rounded-lg text-purple-900"
                                placeholder="1"
                              />
                            </div>

                            {/* Line total */}
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-purple-900 mb-1">Line total</label>
                              <div className="w-full px-3 py-2 border border-purple-200 rounded-lg bg-gray-50 text-purple-900">
                                {(row.total || 0).toFixed(2)} TND
                              </div>
                            </div>

                            {/* Remove */}
                            <div className="md:col-span-1">
                              <button
                                type="button"
                                onClick={() => removeItemRow(row.rowId)}
                                className="w-full inline-flex items-center justify-center px-3 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50"
                                title="Remove"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Totals */}
                    <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-purple-800 font-medium">Invoice total (auto)</span>
                        <span className="text-lg text-purple-900 font-bold">{itemsTotal.toFixed(2)} TND</span>
                      </div>
                      <p className="text-xs text-purple-600 mt-1">
                        The invoice total is calculated automatically from selected products (unit price × quantity).
                      </p>
                    </div>
                  </div>

                  {/* Business logic explanation */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-900 mb-3">Professional Accounting Logic</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Receipt className="h-4 w-4 text-yellow-600" />
                              <div>
                                <div className="font-medium text-yellow-800">Invoice Amount</div>
                                <div className="text-yellow-700">Total amount client owes</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-yellow-600" />
                              <div>
                                <div className="font-medium text-yellow-800">Due Date</div>
                                <div className="text-yellow-700">Payment deadline for overdue calculation</div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-yellow-600" />
                              <div>
                                <div className="font-medium text-yellow-800">Payment Amount</div>
                                <div className="text-yellow-700">Amount received now (can be partial)</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-yellow-600" />
                              <div>
                                <div className="font-medium text-yellow-800">Auto Status</div>
                                <div className="text-yellow-700">UNPAID → PARTIALLY_PAID → PAID</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-800 font-medium">Business Rule:</span>
                            <span className="text-blue-700">Payment Amount ≤ Invoice Amount. Partial payments allowed.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Payment Information (common) */}
            <div className="border-b border-purple-200 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-purple-900">Payment Information</h2>
                  <p className="text-sm text-purple-600">Record the payment received from the client</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="montant" className="block text-sm font-semibold text-purple-900 mb-2">
                    Payment Amount (TND) *
                  </label>
                  <input
                    type="number"
                    id="montant"
                    name="montant"
                    value={formData.montant}
                    onChange={handleChange}
                    required
                    min="0.01"
                    max={creationMode === 'existing_invoice' && selectedInvoiceData ? selectedInvoiceData.montant_restant : undefined}
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900 ${
                      creationMode === 'existing_invoice'
                        ? (paymentValidation.isValid === false
                            ? 'border-red-300 bg-red-50 focus:ring-red-500'
                            : paymentValidation.isValid === true
                              ? 'border-green-300 bg-green-50 focus:ring-green-500'
                              : 'border-purple-200')
                        : 'border-purple-200'
                    }`}
                    placeholder={
                      creationMode === 'new_client'
                        ? "Amount received now (can be partial)"
                        : creationMode === 'existing_client'
                          ? "Amount received now (≤ invoice amount)"
                          : (selectedInvoiceData ? `Max: ${selectedInvoiceData.montant_restant.toFixed(2)} TND` : "Amount to pay now")
                    }
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-purple-600">
                      {creationMode === 'new_client'
                        ? "Amount received from client now (can be partial payment)"
                        : creationMode === 'existing_client'
                          ? "Amount that will be applied to the new invoice for this client"
                          : "Amount applied to the selected invoice"}
                    </p>
                    {creationMode === 'existing_invoice' && selectedInvoiceData && (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-blue-600">
                          Remaining balance: <strong>{selectedInvoiceData.montant_restant.toFixed(2)} TND</strong>
                        </p>
                        {selectedInvoiceData.montant_restant === 0 && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Invoice is fully paid
                          </span>
                        )}
                      </div>
                    )}
                    {creationMode === 'existing_invoice' && paymentValidation.message && (
                      <div className={`text-xs p-2 rounded ${
                        paymentValidation.isValid === false
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : paymentValidation.isValid === true
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {paymentValidation.message}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="date_paiement" className="block text-sm font-semibold text-purple-900 mb-2">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    id="date_paiement"
                    name="date_paiement"
                    value={formData.date_paiement}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                  />
                  <p className="text-xs text-purple-600 mt-1">Date when the payment was received (cannot be in the future)</p>
                </div>

                <div>
                  <label htmlFor="mode_paiement" className="block text-sm font-semibold text-purple-900 mb-2">
                    Payment Method *
                  </label>
                  <select
                    id="mode_paiement"
                    name="mode_paiement"
                    value={formData.mode_paiement}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900 bg-white"
                  >
                    <option value="virement">Virement</option>
                    <option value="cheque">Chèque</option>
                    <option value="especes">Espèces</option>
                    <option value="carte">Carte bancaire</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reference" className="block text-sm font-semibold text-purple-900 mb-2">
                    Reference
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                    placeholder="Payment reference number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-semibold text-purple-900 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-purple-900"
                    placeholder="Additional notes about this payment"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-purple-200">
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Save className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Ready to Process</h3>
                    <p className="text-sm text-purple-600">Review your information and create the transaction</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/paiements"
                    className="px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-sm hover:shadow-md"
                  >
                    Back to Payments
                  </Link>
                  <button
                    type="submit"
                    disabled={loading || (creationMode === 'existing_invoice' && selectedInvoiceData && !paymentValidation.isValid) ||
                      (creationMode === 'existing_invoice' && selectedInvoiceData && selectedInvoiceData.statut === 'paid')
                    }
                    className="flex-1 group inline-flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span className="text-lg">Processing Transaction...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span className="text-lg">
                          {creationMode === 'new_client'
                            ? 'Create Client & Invoice'
                            : creationMode === 'existing_client'
                              ? 'Create Invoice & Record Payment'
                              : 'Record Payment'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {(creationMode === 'new_client') && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-blue-800 font-medium">
                        This will create a new client profile, invoice (from selected products), and record the payment in one professional transaction.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default function NewPaymentPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NewPaymentPageContent />
    </Suspense>
  )
}
