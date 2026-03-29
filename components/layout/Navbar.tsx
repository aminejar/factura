'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              F
            </div>
            <span className="text-2xl font-bold text-purple-900">Facturaa</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-purple-600 font-medium transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-purple-600 font-medium transition">
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials(user.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-purple-600 hover:text-purple-700 font-semibold transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/#features"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg font-medium transition"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg font-medium transition"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg font-medium transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg font-medium transition"
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-purple-100 space-y-2">
              {user ? (
                <div className="px-4 py-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {getUserInitials(user.name)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors border border-red-200 rounded-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-purple-600 font-semibold text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-center shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
