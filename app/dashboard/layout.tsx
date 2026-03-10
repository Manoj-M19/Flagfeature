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

  if (!mounted) return null;
  if (!isAuthenticated()) return null;

  return (
    <SocketProvider>
      <div className="min-h-screen bg-[#0D1117]">
        <nav className="bg-[#161B22] border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">

              {/* Left — logo + links */}
              <div className="flex items-center gap-8">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg" />
                  <h1 className="text-xl font-bold text-white">FlagFeature</h1>
                </Link>
                <div className="flex gap-6">
                  <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition font-medium">
                    Projects
                  </Link>
                  <Link href="/dashboard/settings" className="text-sm text-gray-300 hover:text-white transition font-medium">
                    API Keys
                  </Link>
                  <Link href="/dashboard/docs" className="text-sm text-gray-300 hover:text-white transition font-medium">
                    Docs
                  </Link>
                </div>
              </div>

              {/* Right — email + logout */}
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-300">{user?.email}</span>
                </div>

                {/* Animated logout button — expands on hover */}
                <button
                  onClick={() => { logout(); router.push('/login') }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    background: 'linear-linear(to right, #3b82f6, #ef4444)',
                    boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
                    transition: 'width 0.4s, border-radius 0.4s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget
                    btn.style.width = '130px'
                    btn.style.borderRadius = '20px'
                    const icon = btn.querySelector('.logout-icon') as HTMLElement
                    const text = btn.querySelector('.logout-text') as HTMLElement
                    if (icon) { icon.style.width = '30%'; icon.style.paddingLeft = '10px' }
                    if (text) { text.style.opacity = '1'; text.style.width = '70%' }
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget
                    btn.style.width = '42px'
                    btn.style.borderRadius = '50%'
                    const icon = btn.querySelector('.logout-icon') as HTMLElement
                    const text = btn.querySelector('.logout-text') as HTMLElement
                    if (icon) { icon.style.width = '100%'; icon.style.paddingLeft = '0' }
                    if (text) { text.style.opacity = '0'; text.style.width = '0%' }
                  }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(2px,2px)' }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = 'translate(0,0)' }}
                >
                  {/* Icon */}
                  <span
                    className="logout-icon"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'width 0.4s, padding 0.4s',
                      flexShrink: 0,
                    }}
                  >
                    <svg viewBox="0 0 512 512" style={{ width: '16px', fill: 'white' }}>
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>
                  </span>

                  {/* Text */}
                  <span
                    className="logout-text"
                    style={{
                      position: 'absolute',
                      right: 0,
                      width: '0%',
                      opacity: 0,
                      color: 'white',
                      fontSize: '0.85em',
                      fontWeight: 600,
                      transition: 'opacity 0.4s, width 0.4s',
                      paddingRight: '10px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    Logout
                  </span>
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