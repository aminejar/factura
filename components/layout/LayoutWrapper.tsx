'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const publicPages = ['/', '/login', '/register', '/forgot-password']
const authPages = ['/login', '/register', '/forgot-password']

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isPublicPage = publicPages.includes(pathname)
    const isAuthPage = authPages.includes(pathname)

  // Pages d'authentification (pas de navbar, pas de sidebar)
    if (isAuthPage) {
    return <>{children}</>
    }

  // Page d'accueil (navbar uniquement)
    if (pathname === '/') {
    return (
        <>
        <Navbar />
        <div className="pt-16">{children}</div>
        </>
    )
    }

  // Pages protégées (sidebar uniquement)
    return (
    <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">{children}</div>
    </div>
    )
}
