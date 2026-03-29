'use client';
import { Zap, CheckCircle, Shield, FileText, TrendingUp, Wifi } from 'lucide-react';

const mainFeatures = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Create and send invoices in seconds.', gradient: 'from-purple-50' },
  { icon: CheckCircle, title: 'User-Friendly', desc: 'Intuitive design with zero learning curve.', gradient: 'from-pink-50' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'Enterprise-level encryption.', gradient: 'from-purple-50' },
];

const subFeatures = [
  { icon: FileText, title: 'Professional Templates', desc: 'Beautiful, customizable designs' },
  { icon: TrendingUp, title: 'Real-Time Analytics', desc: 'Track payments and insights' },
  { icon: Wifi, title: 'Cloud Sync', desc: 'Access anywhere, anytime' },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">Why Choose Facturaa</h2>
          <p className="text-purple-600 text-lg max-w-2xl mx-auto">
            Everything you need to manage invoices efficiently
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {mainFeatures.map((f, i) => (
            <div key={i} className={`group bg-gradient-to-br ${f.gradient} to-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100`}>
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="text-white" size={32} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-3">{f.title}</h3>
              <p className="text-purple-700 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {subFeatures.map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-6 bg-purple-50/50 rounded-xl">
              <f.icon className="text-purple-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">{f.title}</h4>
                <p className="text-sm text-purple-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}