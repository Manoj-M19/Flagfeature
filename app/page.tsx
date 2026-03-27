"use client"

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-[#161B22] backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
              <h1 className="text-2xl font-bold">FlagFeature</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/docs"
                className="px-4 py-2 text-gray-300 hover:text-white transition font-medium"
              >
                Documentation
              </Link>

              {/* Animated Sign In button */}
              <Link
                href="/login"
                style={{
                  display: 'inline-block',
                  width: '120px',
                  height: '44px',
                  lineHeight: '44px',
                  textAlign: 'center',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  boxShadow: '0 10px 24px -6px rgba(238, 103, 97, 0.5)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(3px)'
                  el.style.boxShadow = 'none'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = '0 10px 24px -6px rgba(238, 103, 97, 0.5)'
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.5'
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1'
                }}
              >
                Sign In
              </Link>

              <Link
                href="/register"
                 style={{
                  display: 'inline-block',
                  width: '120px',
                  height: '44px',
                  lineHeight: '44px',
                  textAlign: 'center',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  boxShadow: '0 10px 24px -6px rgba(238, 103, 97, 0.5)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(3px)'
                  el.style.boxShadow = 'none'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = '0 10px 24px -6px rgba(238, 103, 97, 0.5)'
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '0.5'
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = '1'
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-blue-400 font-medium">Feature flags for modern teams</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Ship features with
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                confidence
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Control feature releases, reduce risk, and deliver value faster with
              powerful feature flag management.
            </p>

            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50"
              >
                Start Free Trial
              </Link>
              
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="bg-[#161B22] border border-gray-800 p-8 rounded-xl hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Control</h3>
              <p className="text-gray-400 leading-relaxed">
                Toggle features on or off in milliseconds. No deployments, no waiting, no risk.
              </p>
            </div>

            <div className="bg-[#161B22] border border-gray-800 p-8 rounded-xl hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Environment</h3>
              <p className="text-gray-400 leading-relaxed">
                Manage flags independently across dev, staging, and production environments.
              </p>
            </div>

            <div className="bg-[#161B22] border border-gray-800 p-8 rounded-xl hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-gray-400 leading-relaxed">
                API key authentication with role-based access control and audit logs.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-32 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-gray-800 rounded-2xl p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  &lt;10ms
                </div>
                <div className="text-gray-400 font-medium">Average response time</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  99.99%
                </div>
                <div className="text-gray-400 font-medium">Uptime guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  Free
                </div>
                <div className="text-gray-400 font-medium">Forever plan</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-32 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to ship faster?</h2>
            <p className="text-gray-400 text-lg mb-8">Join teams shipping features with confidence</p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-blue-500/50"
            >
              Get started free
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#161B22] mt-32 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-gray-400">
              © 2026 FlagFeature. Develop and ship fast.
            </div>
            <div className="flex gap-6">
              <Link href="/docs" className="text-gray-400 hover:text-white transition">Docs</Link>
              <a href="https://github.com" className="text-gray-400 hover:text-white transition">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}