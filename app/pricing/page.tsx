'use client';
import { useState } from 'react';
import { Check, Zap, Building2, Rocket, ArrowRight, Star, Shield, Clock, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const pricingPlans = [
  {
    name: 'Starter',
    monthlyPrice: 0,
    annualPrice: 0,
    period: 'forever',
    description: 'Perfect for freelancers and small businesses getting started',
    icon: Zap,
    gradient: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    popular: false,
    features: [
      'Up to 10 invoices per month',
      'Basic invoice templates',
      'PDF generation',
      'Email support',
      'Client management (up to 5 clients)',
      'Basic reporting & analytics',
      'Mobile responsive',
      'Secure cloud storage',
    ],
  },
  {
    name: 'Professional',
    monthlyPrice: 29,
    annualPrice: 23,
    period: 'per month',
    description: 'Ideal for growing businesses and teams',
    icon: Building2,
    gradient: 'from-purple-100 to-pink-100',
    borderColor: 'border-purple-500',
    buttonColor: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    popular: true,
    features: [
      'Unlimited invoices',
      'Professional invoice templates',
      'PDF & Excel export',
      'Priority email support',
      'Unlimited clients',
      'Advanced reporting & analytics',
      'Payment tracking & reminders',
      'Stripe & PayPal integration',
      'Email notifications',
      'Custom branding',
      'Invoice scheduling',
      'Multi-currency support',
    ],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 99,
    annualPrice: 79,
    period: 'per month',
    description: 'For large organizations with advanced needs',
    icon: Rocket,
    gradient: 'from-purple-50 to-pink-50',
    borderColor: 'border-purple-200',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    popular: false,
    features: [
      'Everything in Professional',
      'Multi-user access (up to 10 users)',
      'Advanced permissions & roles',
      'API access & webhooks',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 phone & chat support',
      'Custom invoice fields',
      'Automated workflows',
      'White-label solution',
      'SLA guarantee (99.9%)',
      'Advanced security features',
      'Custom reporting',
      'Onboarding assistance',
    ],
  },
];

const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual Enterprise plans.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required. You can explore all features risk-free.',
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer: 'We\'ll notify you when you\'re approaching your limits. You can upgrade anytime to continue using the service without interruption.',
  },
  {
    question: 'Do you offer discounts for annual plans?',
    answer: 'Yes! Annual plans come with a 20% discount compared to monthly billing. You save money and get the same great features.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. You can cancel your subscription at any time with no cancellation fees. Your data remains accessible for 30 days after cancellation.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use bank-grade encryption and follow industry best practices. Your data is stored securely and backed up regularly.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact us for a full refund.',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Freelance Designer',
    content: 'Facturaa has transformed how I manage my invoices. The free plan is perfect for my needs!',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Small Business Owner',
    content: 'The Professional plan pays for itself. The time saved on invoicing is incredible.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Finance Manager',
    content: 'Enterprise features are exactly what our team needed. Excellent support and powerful tools.',
    rating: 5,
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-purple-900">Trusted by 10,000+ businesses</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-purple-900 leading-tight">
            Simple, Transparent
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Pricing
            </span>
          </h1>
          <p className="text-purple-700 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your business. The Starter plan is free forever, and all paid plans include a 14-day free trial with no credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md mb-8">
            <span className={`font-medium transition-colors ${!isAnnual ? 'text-purple-900' : 'text-purple-600'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-purple-600' : 'bg-purple-200'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-0'
                }`}
              ></span>
            </button>
            <span className={`font-medium transition-colors ${isAnnual ? 'text-purple-900' : 'text-purple-600'}`}>
              Annual
              {isAnnual && <span className="ml-2 text-green-600 font-semibold">Save 20%</span>}
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              const displayPrice = plan.monthlyPrice === 0 ? 'Free' : (isAnnual ? plan.annualPrice : plan.monthlyPrice);
              const savings = isAnnual && plan.monthlyPrice > 0 
                ? Math.round(((plan.monthlyPrice - plan.annualPrice) / plan.monthlyPrice) * 100) 
                : 0;

              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-xl border-2 ${plan.borderColor} overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                    plan.popular ? 'md:-mt-4 md:mb-4 ring-4 ring-purple-200' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6`}>
                      <Icon className="text-purple-600" size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-purple-900 mb-2">{plan.name}</h3>
                    <p className="text-purple-600 mb-6 text-sm">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-purple-900">{displayPrice}</span>
                        {displayPrice !== 'Free' && (
                          <>
                            <span className="text-purple-600 text-xl">TND</span>
                            {isAnnual && savings > 0 && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                                Save {savings}%
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      {plan.period && displayPrice !== 'Free' && (
                        <div className="text-purple-600 text-sm mt-1">
                          {isAnnual ? 'per month, billed annually' : '/month'}
                        </div>
                      )}
                      {displayPrice === 'Free' && (
                        <div className="text-purple-600 text-sm mt-1">forever</div>
                      )}
                    </div>

                    <Link
                      href={plan.name === 'Starter' ? "/register" : `/register?plan=${plan.name.toLowerCase()}&billing=${isAnnual ? 'annual' : 'monthly'}`}
                      className={`block w-full text-center ${plan.buttonColor} text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mb-8 group`}
                    >
                      {displayPrice === 'Free' ? (
                        'Get Started Free'
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Start Free Trial
                          <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                        </span>
                      )}
                    </Link>

                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                          <span className="text-purple-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-purple-100">
              <Shield className="text-purple-600 mx-auto mb-4" size={40} />
              <h3 className="font-bold text-purple-900 mb-2">Bank-Grade Security</h3>
              <p className="text-purple-700 text-sm">Your data is encrypted and secure</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-purple-100">
              <Clock className="text-purple-600 mx-auto mb-4" size={40} />
              <h3 className="font-bold text-purple-900 mb-2">99.9% Uptime</h3>
              <p className="text-purple-700 text-sm">Reliable service you can count on</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-purple-100">
              <Users className="text-purple-600 mx-auto mb-4" size={40} />
              <h3 className="font-bold text-purple-900 mb-2">10,000+ Users</h3>
              <p className="text-purple-700 text-sm">Trusted by businesses worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-12">
            Loved by Our Customers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border border-purple-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                  ))}
                </div>
                <p className="text-purple-700 mb-4 italic">&quot;{testimonial.content}&quot;</p>
                <div>
                  <p className="font-semibold text-purple-900">{testimonial.name}</p>
                  <p className="text-sm text-purple-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border border-purple-100 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-purple-900 mb-2">{faq.question}</h3>
                <p className="text-purple-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-purple-100 text-lg mb-8">
              Join thousands of businesses already using Facturaa. Get started free or try any paid plan for 14 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Contact Sales
            </Link>
          </div>
          <p className="text-purple-200 text-sm mt-6">
            No credit card required for paid plan trials • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
