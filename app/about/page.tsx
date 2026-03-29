'use client';
import { Target, Users, Zap, Shield, Heart, Award, TrendingUp, Globe, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We\'re committed to simplifying invoicing for businesses of all sizes, making financial management accessible and efficient.',
  },
  {
    icon: Heart,
    title: 'Customer-Centric',
    description: 'Your success is our success. We listen to feedback and continuously improve based on what our users need.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We stay ahead of the curve, constantly adding new features and improving our platform with the latest technology.',
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Your data security is our top priority. We use enterprise-grade encryption and follow industry best practices.',
  },
];

const milestones = [
  {
    year: '2020',
    title: 'Founded',
    description: 'Facturaa was born from a simple idea: make invoicing easy for everyone.',
  },
  {
    year: '2021',
    title: 'First 1,000 Users',
    description: 'Reached our first milestone with businesses trusting us with their invoicing.',
  },
  {
    year: '2022',
    title: '100K Invoices',
    description: 'Processed over 100,000 invoices, helping businesses get paid faster.',
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description: 'Expanded to serve businesses worldwide with multi-currency support.',
  },
  {
    year: '2024',
    title: '10,000+ Users',
    description: 'Reached 10,000+ active users and processed over 5 million invoices.',
  },
];

const stats = [
  { icon: Users, value: '10,000+', label: 'Active Users' },
  { icon: TrendingUp, value: '5M+', label: 'Invoices Created' },
  { icon: Globe, value: '50+', label: 'Countries Served' },
  { icon: Award, value: '99.9%', label: 'Uptime' },
];

const team = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    description: 'Passionate about simplifying business operations for entrepreneurs.',
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    description: 'Tech enthusiast focused on building scalable and secure solutions.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Product',
    description: 'Dedicated to creating intuitive user experiences that delight customers.',
  },
  {
    name: 'David Kim',
    role: 'Head of Customer Success',
    description: 'Ensuring every customer gets the most value from Facturaa.',
  },
];

export default function AboutPage() {
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-purple-900 leading-tight">
            About
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Facturaa
            </span>
          </h1>
          <p className="text-purple-700 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            We're on a mission to revolutionize how businesses manage their invoicing and get paid faster.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-purple-100">
            <h2 className="text-4xl font-bold text-purple-900 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-purple-700 space-y-4">
              <p>
                Facturaa was founded in 2020 with a simple yet powerful vision: to make invoicing effortless for businesses of all sizes. 
                We recognized that many businesses were struggling with outdated, time-consuming invoicing processes that took away from 
                what they do best - running their business.
              </p>
              <p>
                What started as a solution to a common problem has grown into a comprehensive invoicing platform trusted by over 10,000 
                businesses worldwide. We've processed millions of invoices and helped countless businesses streamline their financial operations, 
                get paid faster, and focus on growth.
              </p>
              <p>
                Today, Facturaa continues to evolve, adding new features and capabilities based on feedback from our amazing community of users. 
                We're committed to being the invoicing solution that grows with your business, from startup to enterprise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md border border-purple-100 text-center hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-purple-600" size={32} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">{stat.value}</div>
                  <div className="text-purple-600 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">Our Values</h2>
            <p className="text-purple-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-md border border-purple-100 hover:shadow-xl transition-all"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-3">{value.title}</h3>
                  <p className="text-purple-700 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">Our Journey</h2>
            <p className="text-purple-600 text-lg max-w-2xl mx-auto">
              Key milestones in our growth
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-purple-200 transform md:-translate-x-1/2"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg transform md:-translate-x-1/2 z-10"></div>

                  {/* Content */}
                  <div
                    className={`ml-16 md:ml-0 md:w-5/12 ${
                      index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                    }`}
                  >
                    <div className="bg-white rounded-xl p-6 shadow-md border border-purple-100 hover:shadow-xl transition-all">
                      <div className="text-purple-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-purple-900 mb-2">{milestone.title}</h3>
                      <p className="text-purple-700">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">Meet Our Team</h2>
            <p className="text-purple-600 text-lg max-w-2xl mx-auto">
              The passionate people behind Facturaa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border border-purple-100 text-center hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-purple-600" size={40} />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-1">{member.name}</h3>
                <p className="text-purple-600 text-sm mb-3">{member.role}</p>
                <p className="text-purple-700 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
            <h2 className="text-4xl font-bold mb-8 text-center">Why Choose Facturaa?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Easy to use - No training required',
                'Affordable pricing for businesses of all sizes',
                'Secure and reliable - 99.9% uptime',
                '24/7 customer support',
                'Regular updates and new features',
                'Mobile-friendly interface',
                'Multi-currency support',
                'Export to PDF and Excel',
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-white flex-shrink-0 mt-0.5" size={24} />
                  <span className="text-purple-100">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center bg-white rounded-2xl shadow-xl p-12 border border-purple-100">
          <h2 className="text-4xl font-bold text-purple-900 mb-4">
            Join Us on This Journey
          </h2>
          <p className="text-purple-700 text-lg mb-8">
            Be part of the Facturaa community and transform how you manage your invoicing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}






