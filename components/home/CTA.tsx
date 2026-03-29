'use client';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Invoicing?
        </h2>
        <p className="text-purple-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Join thousands of businesses streamlining their finances with Facturaa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/register" className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105">
            Start Free Trial
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </a>
          <a href="/demo" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
            Watch Demo
          </a>
        </div>
        <p className="text-purple-200 text-sm mt-6">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}