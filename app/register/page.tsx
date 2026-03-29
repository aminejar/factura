'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Star, Building2, ArrowRight, Mail, Lock, Eye, EyeOff, User, Phone, Building, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/context/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

function RegisterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan') || 'starter'
  const billingParam = searchParams.get('billing') || 'monthly'
  const { login } = useAuth()

  // États du formulaire
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    companyAddress: '',
    plan: planParam,
    billingCycle: billingParam,
    acceptTerms: false
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Validation des champs
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Configuration des plans
  const planConfig = {
    starter: {
      name: 'Starter',
      description: 'Perfect for freelancers getting started',
      monthlyPrice: 0,
      annualPrice: 0,
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    professional: {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      monthlyPrice: 29,
      annualPrice: 23,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
      borderColor: 'border-purple-300',
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For large organizations',
      monthlyPrice: 99,
      annualPrice: 79,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  }

  // Calculate current pricing based on billing cycle
  const basePlan = planConfig[planParam as keyof typeof planConfig] || planConfig.starter
  const currentPrice = billingParam === 'annual' ? basePlan.annualPrice : basePlan.monthlyPrice
  const currentPeriod = billingParam === 'annual' ? 'per month, billed annually' : 'per month'

  const currentPlan = {
    ...basePlan,
    price: currentPrice,
    period: billingParam === 'annual' ? 'per month, billed annually' : 'per month'
  }

  // Avantages du plan Professional
  const professionalFeatures = [
    'Unlimited invoices',
    'Professional templates',
    'Priority support',
    'Advanced analytics',
    'Payment reminders',
    'Multi-currency support'
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Validation nom complet
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Validation mot de passe
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Validation entreprise
    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required'
    }

    // Validation téléphone
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    }

    // Validation adresse entreprise
    if (!formData.companyAddress.trim()) {
      errors.companyAddress = 'Company address is required'
    }

    // Validation termes et conditions
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // For paid plans, store registration data and redirect to checkout
      if (formData.plan !== 'starter') {
        // Store registration data temporarily
        const registrationData = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          phone: formData.phone,
          plan: formData.plan,
          billingCycle: formData.billingCycle,
          acceptTerms: formData.acceptTerms,
          timestamp: Date.now()
        }

        // Store in localStorage (you might want to use a more secure method)
        localStorage.setItem('pendingRegistration', JSON.stringify(registrationData))

        // Redirect to checkout with billing cycle
        router.push(`/checkout?plan=${formData.plan}&billing=${formData.billingCycle}`)
        return
      }

      // For free plans, create account directly
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          company: formData.companyName,
          phone: formData.phone,
          address: formData.companyAddress,
          plan: formData.plan,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Automatically log in the user after successful registration
      await login(data.token, data.user)
      setSuccess('Account created successfully!')

      // Navigate to dashboard
      router.push('/dashboard')

    } catch (err: any) {
      setError(err.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header avec badge du plan */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${currentPlan.bgColor} ${currentPlan.borderColor} border-2 mb-4`}>
            <currentPlan.icon className={`h-5 w-5 ${currentPlan.color}`} />
            <span className={`font-semibold ${currentPlan.color}`}>
              {currentPlan.name} Plan
            </span>
            {planParam === 'professional' && (
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                Most Popular
              </span>
            )}
          </div>

          {/* Pricing display for paid plans */}
          {currentPlan.price > 0 && (
            <div className="mb-6">
              <div className="inline-flex items-baseline gap-2 bg-white rounded-xl shadow-lg border border-purple-200 px-6 py-4">
                <span className="text-3xl font-bold text-gray-900">${currentPlan.price}</span>
                <span className="text-lg text-gray-600">{currentPlan.period}</span>
                {planParam === 'professional' && (
                  <span className="text-sm text-green-600 font-medium ml-2">
                    14-day free trial
                  </span>
                )}
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your {currentPlan.name} Account
          </h1>
          <p className="text-gray-600">
            {currentPlan.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulaire d'inscription */}
          <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom complet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400 ${
                        fieldErrors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400 ${
                        fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="you@company.com"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400 ${
                        fieldErrors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Confirmation mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400 ${
                        fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Nom de l'entreprise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400 ${
                        fieldErrors.companyName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Your company name"
                    />
                  </div>
                  {fieldErrors.companyName && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.companyName}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400 ${
                        fieldErrors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Adresse entreprise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400 ${
                        fieldErrors.companyAddress ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123 Business Street, City, Country"
                    />
                  </div>
                  {fieldErrors.companyAddress && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.companyAddress}</p>
                  )}
                </div>

                {/* Plan (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan
                  </label>
                  <input
                    type="text"
                    value={currentPlan.name}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Termes et conditions */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">
                      I accept the{' '}
                      <Link href="/terms" className="text-purple-600 hover:text-purple-700 underline">
                        Terms and Conditions
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {fieldErrors.acceptTerms && (
                    <p className="text-red-600 text-sm mt-1">{fieldErrors.acceptTerms}</p>
                  )}
                </div>

                {/* Messages d'erreur et de succès */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-800 text-sm">{success}</p>
                  </div>
                )}

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  {loading
                    ? 'Processing...'
                    : formData.plan === 'starter'
                      ? `Create ${currentPlan.name} Account`
                      : `Continue to Payment`
                  }
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>

              {/* Lien vers login */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Avantages du plan (côté droit) */}
          <div className="space-y-6">
            {planParam === 'professional' && (
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Professional Plan Includes
                </h3>
                <ul className="space-y-3">
                  {professionalFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>14-day free trial</strong> - No credit card required
                  </p>
                </div>
              </div>
            )}

            {/* Support */}
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Need Help?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Our support team is here to help you get started.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                Contact Support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterPageContent />
    </Suspense>
  )
}
