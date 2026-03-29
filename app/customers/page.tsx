
'use client'

import { useEffect, useMemo, useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import CustomersHeader from '@/components/customers/CustomersHeader'
import CustomersGrid from '@/components/customers/CustomersGrid'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useCustomers } from '@/lib/hooks/useCustomers'

type Customer = {
  id: string | number
  nom?: string
  name?: string
  email?: string
  telephone?: string
  phone?: string
  [key: string]: any
}

function CustomersPageContent() {
  const searchParams = useSearchParams()
  const { customers, loading, error, refetch } = useCustomers()

  // -----------------------------
  // Refresh on ?refresh=... param
  // -----------------------------
  useEffect(() => {
    const refreshParam = searchParams.get('refresh')
    if (refreshParam) {
      // Remove the param to avoid refetch loops on back/forward nav
      window.history.replaceState({}, '', '/customers')
      setTimeout(() => refetch(), 500)
    }
  }, [searchParams, refetch])

  // -----------------------------
  // Search state with debounce
  // -----------------------------
  const [rawQuery, setRawQuery] = useState<string>('')
  const [query, setQuery] = useState<string>('') // debounced value
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setQuery(rawQuery.trim().toLowerCase())
    }, 250)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [rawQuery])

  // Keyboard helpers: Esc to clear
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setRawQuery('')
      setQuery('')
      inputRef.current?.blur()
    }
  }

  // -----------------------------
  // Client-side filtering
  // -----------------------------
  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) return []
    if (!query) return customers

    return (customers as Customer[]).filter((c) => {
      const name = (c.nom ?? c.name ?? '').toLowerCase()
      const email = (c.email ?? '').toLowerCase()
      const phone = (c.telephone ?? c.phone ?? '').toLowerCase()
      return name.includes(query) || email.includes(query) || phone.includes(query)
    })
  }, [customers, query])

  // -----------------------------
  // Loading state
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Existing header */}
        <CustomersHeader />

        {/* Search bar */}
        <div className="mt-6 mb-4">
          <label
            htmlFor="customer-search"
            className="block text-sm font-semibold text-indigo-900 mb-2"
          >
            Search customers
          </label>
          <div className="relative">
            <input
              id="customer-search"
              ref={inputRef}
              type="text"
              inputMode="search"
              placeholder="Type a name, email, or phone…"
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full px-4 py-3 pr-24 border border-indigo-200 rounded-xl bg-white text-indigo-900
                         placeholder-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            {/* Right controls */}
            <div className="absolute inset-y-0 right-2 flex items-center gap-2">
              {rawQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setRawQuery('')
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  className="px-3 py-1 text-sm rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
              <span
                className="px-2 py-1 text-xs rounded-lg bg-gray-100 text-gray-700 border border-gray-200"
                title="Matching customers"
              >
                {filteredCustomers.length}
              </span>
            </div>
          </div>

          {/* Helper row */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span className="px-2 py-1 rounded bg-white border border-gray-200">Esc: clear</span>
            <span className="px-2 py-1 rounded bg-white border border-gray-200">
              Search covers: name • email • phone
            </span>
            {error && (
              <span className="px-2 py-1 rounded bg-red-50 border border-red-200 text-red-700">
                Error: {String(error)}
              </span>
            )}
          </div>
        </div>

        {/* Results grid */}
        <CustomersGrid customers={filteredCustomers} />
      </div>
    </main>
  )
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProtectedRoute>
        <CustomersPageContent />
      </ProtectedRoute>
    </Suspense>
  )
}
