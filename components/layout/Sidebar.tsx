'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    CreditCard,
    PackageSearch
} from 'lucide-react'

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const router = useRouter()

    // Public navigation items (always visible)
    const publicNavItems = [
        { href: '/', label: 'Home', icon: Home },
    ]

    // Protected navigation items (only for authenticated users)
    const protectedNavItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/invoices', label: 'Invoices', icon: FileText },
        { href: '/paiements', label: 'Payments', icon: CreditCard },
        { href: '/products', label: 'Products', icon: PackageSearch },
        { href: '/customers', label: 'Customers', icon: Users },
        { href: '/settings', label: 'Settings', icon: Settings },
    ]

    // Combine navigation items based on auth status
    const navItems = user ? [...publicNavItems, ...protectedNavItems] : publicNavItems

    const handleLogout = () => {
        logout()
        router.push('/login')
        setIsOpen(false)
    }

    const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
    }

    return (
    <>
      {/* Mobile Toggle */}
        <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-3 bg-purple-600 text-white rounded-xl shadow-lg"
        >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      {/* Overlay */}
        {isOpen && (
        <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
        )}

      {/* Sidebar */}
        <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-purple-100 shadow-xl z-40 transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        >
        <div className="flex flex-col h-full">
          {/* Logo */}
            <div className="p-6 border-b border-purple-100">
            <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                F
                </div>
                <span className="text-2xl font-bold text-purple-900">Facturaa</span>
            </Link>
            </div>

          {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                    isActive(href)
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-purple-50'
                }`}
                >
                <Icon className="h-5 w-5" />
                {label}
                </Link>
            ))}
            </nav>

          {/* Logout (only show for authenticated users) */}
          {user && (
            <div className="p-4 border-t border-purple-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          )}
        </div>
        </aside>

      {/* Spacer for desktop */}
        <div className="hidden md:block w-64" />
    </>
    )
}
