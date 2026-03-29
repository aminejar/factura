import { User, Building2, Lock } from 'lucide-react'

interface SettingsTabsProps {
  activeTab: 'profile' | 'company' | 'security'
  onTabChange: (tab: 'profile' | 'company' | 'security') => void
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'company', label: 'Company', icon: Building2 },
    { key: 'security', label: 'Security', icon: Lock },
  ] as const

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
            activeTab === key
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-purple-100'
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  )
}