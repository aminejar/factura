
'use client';
import { useState } from 'react';
import { Play, CheckCircle, Zap, Shield, FileText, TrendingUp, Users, CreditCard, Mail, Download, X } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const demoFeatures = [
  {
    icon: FileText,
    title: 'Create Invoices in Seconds',
    description: 'Generate professional invoices with our intuitive interface. Add products, calculate totals automatically, and send to clients instantly.',
  },
  {
    icon: Users,
    title: 'Manage Your Clients',
    description: 'Keep all your client information organized in one place. Track contact details, payment history, and invoice records.',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Analytics',
    description: 'Monitor your business performance with comprehensive dashboards. Track revenue, outstanding payments, and client statistics.',
  },
  {
    icon: CreditCard,
    title: 'Payment Tracking',
    description: 'Record and track payments easily. Automatic invoice status updates when payments are received.',
  },
  {
    icon: Mail,
    title: 'Email Integration',
    description: 'Send invoices directly to clients via email. Automated reminders for overdue payments.',
  },
  {
    icon: Download,
    title: 'Export & Reports',
    description: 'Export invoices and reports to PDF or Excel. Perfect for accounting and record-keeping.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Sign Up',
    description: 'Create your free account in less than a minute. No credit card required.',
  },
  {
    number: '02',
    title: 'Add Your Clients',
    description: 'Import or manually add your clients with their contact information.',
  },
  {
    number: '03',
    title: 'Create Your First Invoice',
    description: 'Use our templates or create custom invoices. Add products, set prices, and calculate totals automatically.',
  },
  {
    number: '04',
    title: 'Send & Get Paid',
    description: 'Send invoices via email, track payments, and manage your cash flow effortlessly.',
  },
];

// Video configuration - You can change this to your video URL
// Options:
// 1. YouTube: Use the video ID from YouTube URL (e.g., "dQw4w9WgXcQ" from "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
// 2. Vimeo: Use the video ID from Vimeo URL (e.g., "123456789" from "https://vimeo.com/123456789")
// 3. Local video: Place video file in /public/videos/ folder and use "/videos/your-video.mp4"
const VIDEO_CONFIG = {
  type: 'youtube', // 'youtube', 'vimeo', or 'local'
  youtubeId: 'dQw4w9WgXcQ', // Replace with your YouTube video ID
  vimeoId: '', // Replace with your Vimeo video ID if using Vimeo
  localPath: '/videos/demo.mp4', // Path to local video file if using local video
  thumbnail: '/images/video-thumbnail.jpg', // Optional: Custom thumbnail image
};

export default function DemoPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const getVideoEmbedUrl = (): string | undefined => {
    if (VIDEO_CONFIG.type === 'youtube') {
      return `https://www.youtube.com/embed/${VIDEO_CONFIG.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    } else if (VIDEO_CONFIG.type === 'vimeo') {
      return `https://player.vimeo.com/video/${VIDEO_CONFIG.vimeoId}?autoplay=1`;
    }
    return undefined;
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    setShowVideoModal(true);
  };

  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
    setShowVideoModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-purple-900 leading-tight">
              See Facturaa
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                In Action
              </span>
            </h1>
            <p className="text-purple-700 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Watch how easy it is to manage your invoicing and get paid faster with our powerful platform.
            </p>
          </div>

          {/* Video/Demo Section */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100 mb-12">
            <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 relative flex items-center justify-center overflow-hidden">
              {!isVideoPlaying ? (
                <>
                  {/* Video Thumbnail/Preview */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                      backgroundImage: VIDEO_CONFIG.thumbnail 
                        ? `url(${VIDEO_CONFIG.thumbnail})` 
                        : 'none'
                    }}
                  ></div>
                  <div className="relative z-10 text-center">
                    <button
                      onClick={handlePlayVideo}
                      className="group w-24 h-24 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 mb-4"
                      aria-label="Play video"
                    >
                      <Play className="text-purple-600 ml-1" size={40} fill="currentColor" />
                    </button>
                    <p className="text-white font-semibold text-lg">Watch Demo Video</p>
                    <p className="text-purple-100 text-sm mt-2">See how Facturaa works</p>
                  </div>
                </>
              ) : VIDEO_CONFIG.type === 'local' ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onEnded={() => setIsVideoPlaying(false)}
                >
                  <source src={VIDEO_CONFIG.localPath} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={getVideoEmbedUrl()}
                  title="Facturaa Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>

          {/* Video Modal for better viewing experience */}
          {showVideoModal && VIDEO_CONFIG.type !== 'local' && (
            <div 
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={handleCloseVideo}
            >
              <div 
                className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleCloseVideo}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Close video"
                >
                  <X size={24} />
                </button>
                <iframe
                  className="w-full h-full"
                  src={getVideoEmbedUrl()}
                  title="Facturaa Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-xl text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Free Trial
              <Zap className="group-hover:scale-110 transition-transform" size={20} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-xl text-purple-900 text-lg font-semibold shadow-md hover:shadow-lg transition-all border border-purple-200"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">
              Everything You Need
            </h2>
            <p className="text-purple-600 text-lg max-w-2xl mx-auto">
              Discover all the powerful features that make Facturaa the perfect invoicing solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-purple-100 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 mb-2">{feature.title}</h3>
                  <p className="text-purple-700 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-purple-900">
              How It Works
            </h2>
            <p className="text-purple-600 text-lg max-w-2xl mx-auto">
              Get started in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-white rounded-xl p-6 shadow-md border border-purple-100"
              >
                <div className="text-6xl font-bold text-purple-100 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">{step.title}</h3>
                <p className="text-purple-700">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-purple-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-purple-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">5M+</div>
              <div className="text-purple-100">Invoices Created</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-purple-100">Uptime</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-purple-100">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center bg-white rounded-2xl shadow-xl p-12 border border-purple-100">
          <h2 className="text-4xl font-bold text-purple-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-purple-700 text-lg mb-8">
            Join thousands of businesses already using Facturaa to streamline their invoicing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Your Free Trial
              <CheckCircle className="group-hover:scale-110 transition-transform" size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
            >
              Contact Sales
            </Link>
          </div>
          <p className="text-purple-600 text-sm mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
