import { useState, useEffect } from 'react'
import { User, Mail, Building, Save } from 'lucide-react'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/lib/context/AuthContext'

export default function ProfileSettings() {
  const { user, refreshUser, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  // Block rendering until auth is ready
  if (authLoading || !user) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  // Synchronize form state when user data arrives
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? '',
        email: user.email ?? '',
        company: user.company?.name ?? ''
      })
    }
  }, [user])

  const handleSave = async () => {
    // Frontend validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setSuccess(null)
      return
    }

    // Check if data actually changed
    const hasNameChanged = formData.name.trim() !== (user?.name || '')
    const hasEmailChanged = formData.email.trim() !== (user?.email || '')
    const hasCompanyChanged = formData.company.trim() !== (user?.company?.name || '')

    if (!hasNameChanged && !hasEmailChanged && !hasCompanyChanged) {
      setSuccess('No changes to save')
      return
    }

    setLoading(true)
    setSuccess(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

      const response = await fetch(`${apiUrl}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim()
        })
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setSuccess('Profile updated successfully!')

        // Refresh user data in context
        await refreshUser()

        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to update profile')
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      setSuccess(null)
      // You might want to show an error state here
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
        
        {success && <Alert type="success" message={success} />}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="Your company name (optional)"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
