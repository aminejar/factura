'use client';
import { FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react';
import Footer from '@/components/Footer';

export default function TermsPage() {
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-6">
            <Scale className="text-white" size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-purple-900 leading-tight">
            Terms of
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Service
            </span>
          </h1>
          <p className="text-purple-700 text-lg md:text-xl mb-4">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-purple-100 space-y-8">
            
            {/* Introduction */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Agreement to Terms</h2>
              <p className="text-purple-700 leading-relaxed">
                By accessing and using Facturaa, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to these Terms of Service, please do not use our platform.
              </p>
            </div>

            {/* Use of Service */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-purple-600" size={28} />
                <h2 className="text-3xl font-bold text-purple-900">Use of Service</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Eligibility</h3>
                  <p className="text-purple-700 leading-relaxed">
                    You must be at least 18 years old and have the legal capacity to enter into contracts to use our services. 
                    By using Facturaa, you represent and warrant that you meet these requirements.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Account Responsibility</h3>
                  <p className="text-purple-700 leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                    that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Acceptable Use</h3>
                  <p className="text-purple-700 leading-relaxed mb-2">
                    You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:
                  </p>
                  <ul className="space-y-2 text-purple-700 ml-4">
                    {[
                      'Use the service for any illegal or unauthorized purpose',
                      'Violate any laws in your jurisdiction',
                      'Transmit any viruses, malware, or harmful code',
                      'Attempt to gain unauthorized access to our systems',
                      'Interfere with or disrupt the service or servers',
                      'Use automated systems to access the service without permission',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Subscription and Payment */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Subscription and Payment</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Free Trial</h3>
                  <p className="text-purple-700 leading-relaxed">
                    We offer a 14-day free trial for all paid plans. No credit card is required to start your trial. 
                    You can cancel at any time during the trial period without being charged.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Billing</h3>
                  <p className="text-purple-700 leading-relaxed">
                    Subscriptions are billed in advance on a monthly or annual basis. All fees are non-refundable except 
                    as required by law. Prices are subject to change with 30 days notice.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Cancellation</h3>
                  <p className="text-purple-700 leading-relaxed">
                    You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing 
                    period. You will continue to have access to the service until the end of your paid period.
                  </p>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Intellectual Property</h2>
              <p className="text-purple-700 leading-relaxed">
                The service and its original content, features, and functionality are owned by Facturaa and are protected by 
                international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not 
                reproduce, distribute, modify, or create derivative works of our service without our express written permission.
              </p>
            </div>

            {/* User Content */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">User Content</h2>
              <p className="text-purple-700 leading-relaxed mb-4">
                You retain ownership of all content you upload to our platform, including invoices, client data, and other 
                information. By using our service, you grant us a license to:
              </p>
              <ul className="space-y-2 text-purple-700">
                {[
                  'Store, process, and display your content to provide the service',
                  'Create backups of your data',
                  'Use aggregated, anonymized data for analytics and improvement',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Availability */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Service Availability</h2>
              <p className="text-purple-700 leading-relaxed">
                We strive to maintain 99.9% uptime but do not guarantee uninterrupted access to our service. We may perform 
                scheduled maintenance, and we are not liable for any downtime or service interruptions. We reserve the right 
                to modify or discontinue the service at any time with reasonable notice.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Limitation of Liability</h2>
              <p className="text-purple-700 leading-relaxed">
                To the maximum extent permitted by law, Facturaa shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
                or any loss of data, use, goodwill, or other intangible losses resulting from your use of the service.
              </p>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Indemnification</h2>
              <p className="text-purple-700 leading-relaxed">
                You agree to indemnify and hold harmless Facturaa, its officers, directors, employees, and agents from any 
                claims, damages, losses, liabilities, and expenses (including legal fees) arising out of or relating to your 
                use of the service, violation of these Terms, or infringement of any rights of another.
              </p>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Termination</h2>
              <p className="text-purple-700 leading-relaxed">
                We may terminate or suspend your account and access to the service immediately, without prior notice, for any 
                reason, including breach of these Terms. Upon termination, your right to use the service will cease immediately. 
                You may also terminate your account at any time by contacting us or using the account deletion feature.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Changes to Terms</h2>
              <p className="text-purple-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting 
                the new Terms on this page and updating the "Last updated" date. Your continued use of the service after such 
                modifications constitutes acceptance of the updated Terms.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Governing Law</h2>
              <p className="text-purple-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Tunisia, without regard to its 
                conflict of law provisions. Any disputes arising from these Terms or your use of the service shall be subject 
                to the exclusive jurisdiction of the courts of Tunisia.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-purple-100 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-purple-100">
                <p><strong>Email:</strong> legal@facturaa.tn</p>
                <p><strong>Address:</strong> Tunis, Tunisia</p>
                <p><strong>Phone:</strong> +216 XX XXX XXX</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}




