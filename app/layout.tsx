import { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/layout/LayoutWrapper'
import { AuthProvider } from '@/lib/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Facturaa - Electronic Invoicing Made Simple',
  description: 'Transform your invoicing workflow with our powerful platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </AuthProvider>
      </body>
    </html>
  )
}