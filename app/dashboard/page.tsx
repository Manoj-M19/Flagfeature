'use client'

import { useAuthStore } from '@/lib/store/auth-store'

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}!
        </h2>
        <p className="text-gray-600 mt-2">Manage your feature flags</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
          <p className="text-sm text-gray-500 mt-2">No projects yet</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Flags</h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
          <p className="text-sm text-gray-500 mt-2">No flags created</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Environments</h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
          <p className="text-sm text-gray-500 mt-2">Setup environments</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Create Project
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            Create Flag
          </button>
        </div>
      </div>
    </div>
  )
}
