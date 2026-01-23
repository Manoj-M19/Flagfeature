import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-indigo-600">FlagFeature</h1>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Feature Flags Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Control your features, rollout with confidence, and iterate faster with real-time feature flag management.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-medium"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition text-lg font-medium"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instant Deployment
              </h3>
              <p className="text-gray-600">
                Toggle features on/off without deploying code
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600">
                Changes propagate instantly via WebSocket
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Multi-Environment
              </h3>
              <p className="text-gray-600">
                Manage flags across dev, staging, and production
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2026 FlagFeature. Built with Next.js & PostgreSQL.</p>
        </div>
      </footer>
    </div>
  )
}
