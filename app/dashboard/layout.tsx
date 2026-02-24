'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/auth-store'
import { SocketProvider } from '@/lib/socket-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated()) {
      router.push('/login')
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted) {
    return null
  }

  if (!isAuthenticated()) {
    return null
  }

  return (
    <SocketProvider>
      <div className="min-h-screen bg-[#0D1117]">
        <nav className="bg-[#161B22] border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-8">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
                  <h1 className="text-xl font-bold text-white">FlagFeature</h1>
                </Link>
                <div className="flex gap-6">
                  <Link 
                    href="/dashboard" 
                    className="text-sm text-gray-300 hover:text-white transition font-medium"
                  >
                    Projects
                  </Link>
                  <Link 
                    href="/dashboard/settings" 
                    className="text-sm text-gray-300 hover:text-white transition font-medium"
                  >
                    API Keys
                  </Link>
                  <Link 
                    href="/docs" 
                    className="text-sm text-gray-300 hover:text-white transition font-medium"
                  >
                    Docs
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-300">{user?.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout()
                    router.push('/login')
                  }}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </div>
    </SocketProvider>
  )
}