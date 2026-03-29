'use client'
import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/lib/context/AuthContext'

// Define Customer interface to match API response
interface Customer {
  id: string
  nom: string
  email?: string
  telephone?: string
  adresse?: string
  ville?: string
  code_postal?: string
  pays?: string
  siret?: string
  tva?: string
  created_at?: string
}

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { token, loading: authLoading } = useAuth()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'Tunisie',
    siret: '',
    tva: '',
  })

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!token || authLoading) return

      try {
        setLoading(true)
        setError(null)

        console.log('🔍 FETCHING CUSTOMER FOR EDIT - ID:', resolvedParams.id)

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        const response = await fetch(`${apiUrl}/api/clients/${resolvedParams.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 401) {
          setError('Authentication required. Please log in again.')
          return
        }

        if (!response.ok) {
          if (response.status === 404) {
            setError('Customer not found.')
            return
          }
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Server error (${response.status})`)
        }

        const customerData = await response.json()
        console.log('🔍 CUSTOMER FETCHED FOR EDIT:', customerData)
        setCustomer(customerData)

        // Populate form with customer data
        setFormData({
          nom: customerData.nom || '',
          email: customerData.email || '',
          telephone: customerData.telephone || '',
          adresse: customerData.adresse || '',
          ville: customerData.ville || '',
          code_postal: customerData.code_postal || '',
          pays: customerData.pays || 'Tunisie',
          siret: customerData.siret || '',
          tva: customerData.tva || '',
        })

      } catch (err: any) {
        console.error('🔍 CUSTOMER FETCH ERROR:', err)
        setError(err.message || 'Failed to load customer')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [resolvedParams.id, token, authLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation
    if (!formData.nom || !formData.nom.trim()) {
      setError('Customer name is required')
      return
    }

    if (!formData.email || !formData.email.trim()) {
      setError('Customer email is required')
      return
    }

    try {
      setSaving(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

      const response = await fetch(`${apiUrl}/api/clients/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.nom,
          email: formData.email,
          phone: formData.telephone || null,
          address: formData.adresse || null,
          company: formData.nom, // Use name as company for now
        }),
      })

      if (response.status === 401) {
        setError('Authentication required. Please log in again.')
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error (${response.status})`)
      }

      const updatedCustomer = await response.json()
      console.log('✅ CUSTOMER UPDATED:', updatedCustomer)

      setSuccess('Customer updated successfully!')

      // Redirect to customer detail page after 2 seconds
      setTimeout(() => {
        router.push(`/customers/${resolvedParams.id}`)
      }, 2000)

    } catch (err: any) {
      console.error('Customer update error:', err)
      setError(err.message || 'Failed to update customer')
    } finally {
      setSaving(false)
    }
  }

  // Show loading while auth is loading or customer is being fetched
  if (authLoading || loading) return <LoadingSpinner />

  // Show error state
  if (error && !customer) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-900 mb-4">Error Loading Customer</h1>
          <p className="text-red-600 mb-8">{error}</p>
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition"
          >
            Back to Customers
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/customers/${resolvedParams.id}`}
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-purple-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-purple-900">Edit Customer</h1>
            <p className="text-purple-600">Update customer information</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="border-b border-purple-200 pb-6">
              <h2 className="text-xl font-bold text-purple-900 mb-4">Customer Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-semibold text-purple-900 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                    placeholder="Customer's Full Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-purple-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                    placeholder="customer@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-semibold text-purple-900 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                    placeholder="e.g., +216 12 345 678"
                  />
                </div>

                <div>
                  <label htmlFor="adresse" className="block text-sm font-semibold text-purple-900 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label htmlFor="ville" className="block text-sm font-semibold text-purple-900 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="ville"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label htmlFor="code_postal" className="block text-sm font-semibold text-purple-900 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="code_postal"
                    name="code_postal"
                    value={formData.code_postal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                    placeholder="e.g., 1000"
                  />
                </div>

                <div>
                  <label htmlFor="pays" className="block text-sm font-semibold text-purple-900 mb-2">
                    Country
                  </label>
                  <select
                    id="pays"
                    name="pays"
                    value={formData.pays}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900 bg-white"
                  >
                    <option value="Tunisie">Tunisie</option>
                    <option value="France">France</option>
                    <option value="Canada">Canada</option>
                    <option value="USA">USA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="siret" className="block text-sm font-semibold text-purple-900 mb-2">
                    SIRET
                  </label>
                  <input
                    type="text"
                    id="siret"
                    name="siret"
                    value={formData.siret}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                    placeholder="SIRET number (if applicable)"
                  />
                </div>

                <div>
                  <label htmlFor="tva" className="block text-sm font-semibold text-purple-900 mb-2">
                    TVA
                  </label>
                  <input
                    type="text"
                    id="tva"
                    name="tva"
                    value={formData.tva}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-purple-900"
                    placeholder="TVA number (if applicable)"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Link
                href={`/customers/${resolvedParams.id}`}
                className="px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Updating Customer...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Update Customer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}





