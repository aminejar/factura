'use client'
import { useState } from 'react'
import SettingsHeader from '@/components/settings/SettingsHeader'
import SettingsTabs from '@/components/settings/SettingsTabs'
import ProfileSettings from '@/components/settings/ProfileSettings'
import CompanySettings from '@/components/settings/CompanySettings'
import SecuritySettings from '@/components/settings/SecuritySettings'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}

function SettingsContent() {
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'security'>('profile')

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <SettingsHeader />
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'company' && <CompanySettings />}
        {activeTab === 'security' && <SecuritySettings />}
      </div>
    </main>
  )
}