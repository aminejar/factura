'use client';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
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
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-purple-900 leading-tight">
            Privacy
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Policy
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
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Introduction</h2>
              <p className="text-purple-700 leading-relaxed">
                At Facturaa, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our invoicing 
                platform and services.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-purple-600" size={28} />
                <h2 className="text-3xl font-bold text-purple-900">Information We Collect</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Personal Information</h3>
                  <p className="text-purple-700 leading-relaxed">
                    When you create an account, we collect information such as your name, email address, and password. 
                    We may also collect billing information if you subscribe to a paid plan.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Business Information</h3>
                  <p className="text-purple-700 leading-relaxed">
                    To provide our invoicing services, we collect information about your business, including client details, 
                    invoice data, payment records, and other financial information you choose to store in our platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Usage Data</h3>
                  <p className="text-purple-700 leading-relaxed">
                    We automatically collect information about how you interact with our platform, including pages visited, 
                    features used, and time spent on the platform. This helps us improve our services.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-purple-600" size={28} />
                <h2 className="text-3xl font-bold text-purple-900">How We Use Your Information</h2>
              </div>
              
              <ul className="space-y-3">
                {[
                  'To provide, maintain, and improve our invoicing services',
                  'To process transactions and send related information',
                  'To send you technical notices, updates, and support messages',
                  'To respond to your comments, questions, and requests',
                  'To monitor and analyze usage patterns and trends',
                  'To detect, prevent, and address technical issues and security threats',
                  'To comply with legal obligations and enforce our terms',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-purple-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-purple-600" size={28} />
                <h2 className="text-3xl font-bold text-purple-900">Data Security</h2>
              </div>
              
              <p className="text-purple-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h4 className="font-semibold text-purple-900 mb-2">Encryption</h4>
                  <p className="text-purple-700 text-sm">All data is encrypted in transit and at rest using SSL/TLS encryption.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h4 className="font-semibold text-purple-900 mb-2">Access Controls</h4>
                  <p className="text-purple-700 text-sm">Strict access controls ensure only authorized personnel can access your data.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h4 className="font-semibold text-purple-900 mb-2">Regular Backups</h4>
                  <p className="text-purple-700 text-sm">Your data is regularly backed up to prevent loss.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h4 className="font-semibold text-purple-900 mb-2">Security Monitoring</h4>
                  <p className="text-purple-700 text-sm">We continuously monitor for security threats and vulnerabilities.</p>
                </div>
              </div>
            </div>

            {/* Data Sharing */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Data Sharing and Disclosure</h2>
              <p className="text-purple-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="space-y-2 text-purple-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our platform, such as payment processors and email services.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span><strong>With Your Consent:</strong> We may share information with your explicit consent.</span>
                </li>
              </ul>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Your Rights</h2>
              <p className="text-purple-700 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <div className="space-y-3">
                {[
                  { title: 'Access', desc: 'Request access to your personal data' },
                  { title: 'Correction', desc: 'Request correction of inaccurate data' },
                  { title: 'Deletion', desc: 'Request deletion of your data' },
                  { title: 'Portability', desc: 'Request transfer of your data' },
                  { title: 'Objection', desc: 'Object to processing of your data' },
                  { title: 'Withdrawal', desc: 'Withdraw consent at any time' },
                ].map((right, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <CheckCircle className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-semibold text-purple-900">{right.title}</h4>
                      <p className="text-purple-700 text-sm">{right.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Cookies and Tracking</h2>
              <p className="text-purple-700 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage, and assist with 
                marketing efforts. You can control cookies through your browser settings, though this may affect some functionality.
              </p>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Data Retention</h2>
              <p className="text-purple-700 leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes 
                outlined in this policy. When you delete your account, we will delete or anonymize your personal information, 
                except where we are required to retain it for legal or regulatory purposes.
              </p>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Children's Privacy</h2>
              <p className="text-purple-700 leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
                information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>

            {/* Changes to Policy */}
            <div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Changes to This Policy</h2>
              <p className="text-purple-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy 
                Policy periodically for any changes.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-purple-100 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-purple-100">
                <p><strong>Email:</strong> privacy@facturaa.tn</p>
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




