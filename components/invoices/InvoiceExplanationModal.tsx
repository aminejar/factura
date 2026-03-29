import React from 'react'
import { CheckCircle, Calendar, CreditCard, FileText, X } from 'lucide-react'
import EnhancedModalBackground from '@/components/ui/EnhancedModalBackground'

interface InvoiceExplanationModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

export default function InvoiceExplanationModal({
  isOpen,
  onClose,
  onContinue
}: InvoiceExplanationModalProps) {
  const steps = [
    {
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      title: "Create or select a client",
      description: "Choose an existing customer or create a new client profile"
    },
    {
      icon: <CreditCard className="h-5 w-5 text-green-600" />,
      title: "Enter invoice details",
      description: "Set the invoice amount and due date for payment tracking"
    },
    {
      icon: <Calendar className="h-5 w-5 text-orange-600" />,
      title: "Optionally add a payment",
      description: "Record any payment received (can be partial)"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-purple-600" />,
      title: "Track invoice status",
      description: "Monitor: Unpaid → Partially Paid → Paid → Overdue"
    }
  ]

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-6 py-3 bg-white/80 hover:bg-white text-gray-700 font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200/50"
      >
        Cancel
      </button>
      <button
        onClick={onContinue}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Continue to Create Invoice
      </button>
    </>
  )

  if (!isOpen) return null

  return (
    <>
      <EnhancedModalBackground />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-200/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create a New Invoice
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="text-gray-600 text-base leading-relaxed">
                Creating an invoice involves setting up billing for your client. Follow these simple steps:
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex-shrink-0 mt-1 p-2 bg-white rounded-lg shadow-sm">
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 px-3 py-1 rounded-full shadow-sm">
                          Step {index + 1}
                        </span>
                        <h4 className="text-base font-semibold text-gray-900">{step.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-800 leading-relaxed">
                    <strong className="font-semibold">Note:</strong> Invoice due date is different from payment date. The due date tracks when payment is expected, while payment date records when you actually received the money.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-4 p-8 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50 rounded-b-3xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
