'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, CreditCard, ArrowLeft, Shield, Star, Building2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Mock payment component - in real app, this would integrate with Stripe/PayPal
function PaymentForm({ onSuccess, onCancel, plan }: {
  onSuccess: () => void
  onCancel: () => void
  plan: string
}) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      onSuccess()
    }, 2000)
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h2>
          <p className="text-gray-600">
            Your payment information is encrypted and secure
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="MMYY"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400"
                required
              />
            </div>

            {/* CVV */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black bg-white placeholder-gray-400"
              required
            />
          </div>

          {/* Security notice */}
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <strong>256-bit SSL encryption</strong> - Your payment information is secure
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              type="submit"
              loading={processing}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {processing ? 'Processing Payment...' : `Pay for ${plan} Plan`}
            </Button>

            <Button
              type="button"
              onClick={onCancel}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Plan configuration - moved outside component for validation
const planConfig = {
  professional: {
    name: 'Professional',
    monthlyPrice: 29,
    annualPrice: 23,
    icon: Building2,
    features: [
      'Unlimited invoices',
      'Professional templates',
      'Priority support',
      'Advanced analytics',
      'Payment reminders',
      'Multi-currency support',
      '14-day free trial included'
    ]
  }
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Validate parameters
  const validPlans = Object.keys(planConfig)
  const planParam = searchParams.get('plan') || 'professional'
  const validatedPlanParam = validPlans.includes(planParam) ? planParam : 'professional'

  const billingParam = searchParams.get('billing') || 'monthly'
  const validatedBillingParam = billingParam === 'annual' ? 'annual' : 'monthly'

  const [registrationData, setRegistrationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Calculate current pricing based on billing cycle
  const basePlan = planConfig[validatedPlanParam as keyof typeof planConfig]
  const currentPrice = validatedBillingParam === 'annual' ? basePlan.annualPrice : basePlan.monthlyPrice
  const currentPeriod = validatedBillingParam === 'annual' ? 'per month, billed annually' : 'per month'

  const currentPlan = {
    ...basePlan,
    price: currentPrice,
    period: currentPeriod
  }

  useEffect(() => {
    // Load pending registration data
    const pendingData = localStorage.getItem('pendingRegistration')
    if (pendingData) {
      try {
        const data = JSON.parse(pendingData)
        // Check if data is not too old (24 hours)
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          setRegistrationData(data)
        } else {
          setError('Registration session expired. Please start over.')
          localStorage.removeItem('pendingRegistration')
        }
      } catch (err) {
        setError('Invalid registration data. Please start over.')
        localStorage.removeItem('pendingRegistration')
      }
    } else {
      setError('No registration data found. Please complete registration first.')
    }
    setLoading(false)
  }, [])

  const handlePaymentSuccess = async () => {
    if (!registrationData) return

    try {
      // Create the account after successful payment
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registrationData.fullName,
          email: registrationData.email,
          password: registrationData.password,
          company: registrationData.companyName,
          phone: registrationData.phone,
          plan: registrationData.plan,
          // Add payment confirmation flag
          paymentConfirmed: true
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Account creation failed')
      }

      // Clear pending registration data
      localStorage.removeItem('pendingRegistration')

      setPaymentSuccess(true)

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)

    } catch (err: any) {
      setError(err.message || 'Account creation failed')
    }
  }

  const handlePaymentCancel = () => {
    router.push(`/register?plan=${planParam}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-red-200 p-8 max-w-md w-full text-center">
          <div className="bg-red-100 p-3 rounded-full mx-auto mb-4 w-fit">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href={`/register?plan=${planParam}`}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Registration
          </Link>
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-green-200 p-8 max-w-md w-full text-center">
          <div className="bg-green-100 p-3 rounded-full mx-auto mb-4 w-fit">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Welcome to Facturaa! Your Professional account has been created.
          </p>
          <div className="text-sm text-gray-500">
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    )
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Invalid plan selected.</p>
          <Link
            href="/pricing"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            View pricing plans
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href={`/register?plan=${planParam}`}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Registration
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">
            Secure checkout for your {currentPlan.name} plan
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
              <h3 className="text-xl font-bold text-black mb-6">Order Summary</h3>

              {/* Plan Information */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <currentPlan.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">{currentPlan.name} Plan</h4>
                    <p className="text-sm text-gray-600">{currentPlan.period}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-black">${currentPlan.price}</div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-semibold text-black">${currentPlan.price}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-3">
                  <span className="text-black">Total</span>
                  <span className="text-black">${currentPlan.price}</span>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-3">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Details Preview */}
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="font-semibold text-black">{registrationData?.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="font-semibold text-black">{registrationData?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Company:</span>
                  <span className="font-semibold text-black">{registrationData?.companyName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Plan:</span>
                  <span className="font-semibold text-black">{registrationData?.plan?.charAt(0).toUpperCase() + registrationData?.plan?.slice(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:sticky lg:top-8">
            <PaymentForm
              plan={currentPlan.name}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
