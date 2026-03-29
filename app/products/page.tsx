
'use client'

import { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Boxes, Plus, Save, X, Trash2, Pencil, DollarSign, RefreshCw, Search
} from 'lucide-react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

type Product = {
  id: string | number
  name: string
  description?: string
  price: number
  userId?: string | number
  createdAt?: string
}

function formatCurrency(n: number | string | undefined) {
  const v = typeof n === 'string' ? parseFloat(n) : (typeof n === 'number' ? n : 0)
  if (!isFinite(v)) return '0.00 TND'
  return `${v.toFixed(2)} TND`
}

function ProductsPageContent() {
  const router = useRouter()

  // Data state
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // New product form
  const [newName, setNewName] = useState<string>('')
  const [newPrice, setNewPrice] = useState<string>('') // keep as string for input
  const [newDesc, setNewDesc] = useState<string>('')

  // Inline edit state
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [editName, setEditName] = useState<string>('')
  const [editPrice, setEditPrice] = useState<string>('')
  const [editDesc, setEditDesc] = useState<string>('')

  // UI helpers
  const [busyRow, setBusyRow] = useState<string | number | 'new' | null>(null)

  // Client-side search with debounce
  const [rawQuery, setRawQuery] = useState<string>('')
  const [query, setQuery] = useState<string>('') // debounced
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setQuery(rawQuery.trim().toLowerCase())
    }, 250)
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current) }
  }, [rawQuery])

  const filtered = useMemo(() => {
    if (!query) return products
    return products.filter(p => {
      const name = (p.name ?? '').toLowerCase()
      const desc = (p.description ?? '').toLowerCase()
      const price = String(p.price ?? '').toLowerCase()
      return name.includes(query) || desc.includes(query) || price.includes(query)
    })
  }, [products, query])

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const res = await fetch(`${apiUrl}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.status === 401) {
        setError('Authentication required. Please log in again.')
        return
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `Failed to load products (${res.status})`)
      }
      const data = await res.json()
      const list: Product[] = Array.isArray(data) ? data : []
      setProducts(list)
    } catch (e: any) {
      setError(e.message ?? 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Create product
  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const priceNum = parseFloat(newPrice)
    if (!newName.trim()) { setError('Please enter a product name'); return }
    if (isNaN(priceNum) || priceNum <= 0) { setError('Please enter a valid price (> 0)'); return }

    try {
      setBusyRow('new')
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), description: newDesc || undefined, price: priceNum })
      })
      if (res.status === 401) { setError('Authentication required.'); return }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `Failed to create product (${res.status})`)
      }
      const created = await res.json()
      setProducts(prev => [created, ...prev])
      setNewName(''); setNewPrice(''); setNewDesc('')
      setSuccess('✅ Product created successfully')
    } catch (e: any) {
      setError(e.message ?? 'Failed to create product')
    } finally {
      setBusyRow(null)
    }
  }

  // Edit helpers
  const startEdit = (p: Product) => {
    setEditingId(p.id)
    setEditName(p.name)
    setEditPrice(String(p.price ?? ''))
    setEditDesc(p.description ?? '')
  }
  const cancelEdit = () => {
    setEditingId(null)
    setEditName(''); setEditPrice(''); setEditDesc('')
  }

  // Save edit
  const saveEdit = async (id: string | number) => {
    setError(null); setSuccess(null)
    const priceNum = parseFloat(editPrice)
    if (!editName.trim()) { setError('Please enter a product name'); return }
    if (isNaN(priceNum) || priceNum <= 0) { setError('Please enter a valid price (> 0)'); return }

    try {
      setBusyRow(id)
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const res = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), description: editDesc || undefined, price: priceNum })
      })
      if (res.status === 401) { setError('Authentication required.'); return }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `Failed to update product (${res.status})`)
      }
      const updated = await res.json()
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)))
      setSuccess('✅ Product updated successfully')
      cancelEdit()
    } catch (e: any) {
      setError(e.message ?? 'Failed to update product')
    } finally {
      setBusyRow(null)
    }
  }

  // Delete product
  const deleteProduct = async (id: string | number) => {
    setError(null); setSuccess(null)
    const confirm = window.confirm('Delete this product? This action cannot be undone.')
    if (!confirm) return

    try {
      setBusyRow(id)
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
      const res = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.status === 401) { setError('Authentication required.'); return }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `Failed to delete product (${res.status})`)
      }
      setProducts(prev => prev.filter(p => p.id !== id))
      setSuccess('✅ Product deleted successfully')
    } catch (e: any) {
      setError(e.message ?? 'Failed to delete product')
    } finally {
      setBusyRow(null)
    }
  }

  const refresh = async () => {
    setSuccess(null)
    await fetchProducts()
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Boxes className="h-8 w-8 text-indigo-700" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-indigo-900">Products</h1>
              <p className="text-indigo-700">
                Add, update, or delete products. They’ll be available when creating invoices in the Payment page.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Link
              href="/paiements/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              <DollarSign className="h-4 w-4" />
              New Payment
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
            {success}
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Add product card */}
          <section className="lg:col-span-5">
            <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Plus className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-indigo-900">Add a new product</h2>
                  <p className="text-sm text-indigo-700">Name and price are required.</p>
                </div>
              </div>

              <form onSubmit={onCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 mb-2">Name *</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Product name (e.g., Consulting hour)"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-indigo-900"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-indigo-900 mb-2">Price (TND) *</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-indigo-900"
                      required
                    />
                    <p className="mt-1 text-xs text-indigo-600">Unit price used when selecting this product in invoices.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-indigo-900 mb-2">Description</label>
                    <input
                      type="text"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Optional short description"
                      className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-indigo-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={busyRow === 'new'}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                  >
                    {busyRow === 'new' ? <LoadingSpinner /> : <Save className="h-4 w-4" />}
                    Save product
                  </button>
                </div>
              </form>
            </div>

            {/* Helper block */}
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-800 text-sm">
              Products are scoped to your account. In the Payment page, you can select these products to auto‑calculate the invoice total (unit price × quantity).
            </div>
          </section>

          {/* Right: Search + list */}
          <section className="lg:col-span-7">
            {/* Search bar */}
            <div className="mb-4">
              <label htmlFor="product-search" className="block text-sm font-semibold text-indigo-900 mb-2">
                Search products
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-indigo-500">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  id="product-search"
                  type="text"
                  inputMode="search"
                  placeholder="Type a name, description, or price…"
                  value={rawQuery}
                  onChange={(e) => setRawQuery(e.target.value)}
                  className="w-full pl-9 pr-24 px-4 py-3 border border-indigo-200 rounded-xl bg-white text-indigo-900
                             placeholder-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                  {rawQuery && (
                    <button
                      type="button"
                      onClick={() => { setRawQuery(''); setQuery('') }}
                      className="px-3 py-1 text-sm rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                    >
                      Clear
                    </button>
                  )}
                  <span className="px-2 py-1 text-xs rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                    {filtered.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-white border border-indigo-100 rounded-t-2xl text-xs font-semibold text-indigo-900">
              <div className="col-span-5">Product</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* List / rows */}
            <div className="bg-white border-x border-b border-indigo-100 rounded-b-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-indigo-100">
                {filtered.map((p) => {
                  const isEditing = editingId === p.id
                  const rowBusy = busyRow === p.id
                  return (
                    <div key={p.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4">
                      {/* Name */}
                      <div className="md:col-span-5">
                        <div className="md:hidden text-xs text-indigo-800 mb-1">Product</div>
                        {!isEditing ? (
                          <div className="text-indigo-900 font-medium">{p.name}</div>
                        ) : (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-indigo-900"
                          />
                        )}
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2">
                        <div className="md:hidden text-xs text-indigo-800 mb-1">Price</div>
                        {!isEditing ? (
                          <div className="text-indigo-900">{formatCurrency(p.price)}</div>
                        ) : (
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-indigo-900"
                          />
                        )}
                      </div>

                      {/* Description */}
                      <div className="md:col-span-3">
                        <div className="md:hidden text-xs text-indigo-800 mb-1">Description</div>
                        {!isEditing ? (
                          <div className="text-indigo-900">{p.description || <span className="text-indigo-400">—</span>}</div>
                        ) : (
                          <input
                            type="text"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-indigo-900"
                            placeholder="Optional"
                          />
                        )}
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-2 flex items-center justify-end gap-2">
                        {!isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => startEdit(p)}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white border-2 border-indigo-600 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProduct(p.id)}
                              disabled={!!rowBusy}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white border-2 border-red-500 text-red-600 text-sm font-semibold hover:bg-red-50 transition disabled:opacity-60"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEdit(p.id)}
                              disabled={!!rowBusy}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                            >
                              {rowBusy ? <LoadingSpinner /> : <Save className="h-4 w-4" />}
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}

                {filtered.length === 0 && (
                  <div className="px-6 py-10 text-center">
                    <div className="inline-block px-4 py-3 border border-indigo-100 rounded-xl bg-indigo-50">
                      <div className="text-sm font-semibold text-indigo-900 mb-1">No products found</div>
                      <p className="text-indigo-700 text-sm">
                        Create a product on the left, or adjust your search.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProtectedRoute>
        <ProductsPageContent />
      </ProtectedRoute>
    </Suspense>
  )
}
