'use client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ArrowRight } from 'lucide-react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import CTA from '../components/home/CTA';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}