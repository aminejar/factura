import { useState } from 'react'
import { Lock, Eye, EyeOff, Save } from 'lucide-react'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/lib/context/AuthContext'

export default function SecuritySettings() {
    const { user, loading: authLoading } = useAuth()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPasswords, setShowPasswords] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Block rendering until auth is ready
    if (authLoading || !user) {
        return (
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <span className="ml-3 text-gray-600">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    const handleSave = async () => {
        setError(null)
        setSuccess(null)

        // Frontend validation
        if (!currentPassword.trim()) {
            setError('Current password is required')
            return
        }

        if (!newPassword.trim()) {
            setError('New password is required')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match')
            return
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long')
            return
        }

        setLoading(true)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

            const response = await fetch(`${apiUrl}/api/users/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword.trim(),
                    newPassword: newPassword.trim()
                })
            })

            if (response.ok) {
                setSuccess('Password updated successfully!')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            } else {
                const errorData = await response.json().catch(() => ({}))
                setError(errorData.error || 'Failed to update password')
            }
        } catch (error) {
            console.error('Password update error:', error)
            setError('An error occurred while updating your password')
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
        
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className="space-y-6">
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
                <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
            </div>

            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
            </div>
            </div>

            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
            </div>
            </div>

            <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
            <Save className="h-5 w-5" />
            {loading ? 'Updating...' : 'Update Password'}
            </button>
        </div>
        </div>
    </div>
    )
}