'use client';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-8">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-purple-900">Trusted by 10,000+ businesses</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-purple-900 leading-tight">
          Electronic Invoicing
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Made Simple
          </span>
        </h1>
        
        <p className="text-purple-700 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Transform your invoicing workflow with our powerful platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="/register" className="group inline-flex items-center gap-2 bg-purple-600 px-8 py-4 rounded-xl text-white text-lg font-semibold shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all transform hover:scale-105">
            Start Free Trial
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </a>
          <a href="/demo" className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-xl text-purple-900 text-lg font-semibold shadow-md hover:shadow-lg transition-all">
            See How It Works
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-900">99.9%</div>
            <div className="text-sm text-purple-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-900">5M+</div>
            <div className="text-sm text-purple-600">Invoices Sent</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-900">24/7</div>
            <div className="text-sm text-purple-600">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
