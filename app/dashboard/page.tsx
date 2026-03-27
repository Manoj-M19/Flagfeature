'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'
import CreateProjectModal from '@/components/create-project-modal'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

interface Project {
  id: string
  name: string
  description: string | null
  createdAt: string
  _count: { flags: number; environments: number }
}

interface ChartDay {
  date: string
  label: string
  toggles: number
  created: number
  rollouts: number
}

interface ApiKeyUsage {
  id: string
  name: string
  lastUsed: string | null
  createdAt: string
}

interface Analytics {
  chartData: ChartDay[]
  apiKeys: ApiKeyUsage[]
  totalActivity: number
  totalToggles: number
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30)  return `${days}d ago`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#161B22] border border-gray-700 rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-gray-400 mb-2 font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-gray-300 capitalize">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const user  = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  const [projects, setProjects]     = useState<Project[]>([])
  const [loading, setLoading]       = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [analytics, setAnalytics]   = useState<Analytics | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchProjects()
      fetchAnalytics()
    }
  }, [token])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setProjects(Array.isArray(data) ? data : (data.projects || []))
    } catch (err) {
      console.error('Failed to fetch projects:', err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleProjectCreated = () => {
    setTimeout(() => fetchProjects(), 500)
  }

  const totalFlags = projects.reduce((sum, p) => sum + (p._count?.flags || 0), 0)
  const totalEnvs  = projects.reduce((sum, p) => sum + (p._count?.environments || 0), 0)

  // Check if there's any activity in the chart
  const hasActivity = analytics?.chartData.some(
    (d) => d.toggles > 0 || d.created > 0 || d.rollouts > 0
  )

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">
            Welcome back, {user?.name || 'User'} 👋
          </h2>
          <p className="text-gray-400">Manage your feature flags across all environments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            {
              label: 'Total Projects', value: projects.length,
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />,
              color: 'blue', sub: `${projects.length} active`,
            },
            {
              label: 'Feature Flags', value: totalFlags,
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />,
              color: 'cyan', sub: 'across all projects',
            },
            {
              label: 'Environments', value: totalEnvs,
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
              color: 'purple', sub: 'dev / staging / prod',
            },
            {
              label: 'Toggles (14d)', value: analytics?.totalToggles ?? '—',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
              color: 'green', sub: `${analytics?.totalActivity ?? 0} total actions`,
            },
          ].map((card) => (
            <div key={card.label} className={`bg-[#161B22] border border-gray-800 p-6 rounded-xl hover:border-${card.color}-500/50 transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 bg-${card.color}-500/10 rounded-lg flex items-center justify-center`}>
                  <svg className={`w-5 h-5 text-${card.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {card.icon}
                  </svg>
                </div>
                <span className="text-xs text-gray-500">{card.sub}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-sm text-gray-400">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Analytics Chart + API Keys */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Bar Chart — 2/3 width */}
          <div className="lg:col-span-2 bg-[#161B22] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Flag Activity</h3>
                <p className="text-sm text-gray-400 mt-0.5">Last 14 days across all projects</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />Toggles</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />Created</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-yellow-500 inline-block" />Rollouts</span>
              </div>
            </div>

            {analyticsLoading ? (
              <div className="h-56 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
              </div>
            ) : !hasActivity ? (
              <div className="h-56 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No activity yet — start toggling flags!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={224}>
                <BarChart data={analytics?.chartData} barSize={8} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={1}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width={24}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="toggles" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="created" fill="#22c55e" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="rollouts" fill="#eab308" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* API Key Usage — 1/3 width */}
          <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">API Keys</h3>
                <p className="text-sm text-gray-400 mt-0.5">Last used</p>
              </div>
              <Link
                href="/dashboard/settings"
                className="text-xs text-blue-400 hover:text-blue-300 transition"
              >
                Manage →
              </Link>
            </div>

            {analyticsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-800/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : !analytics?.apiKeys.length ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm text-center">No API keys yet</p>
                <Link href="/dashboard/settings" className="text-xs text-blue-400 hover:text-blue-300">
                  Create one →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {analytics.apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between px-3 py-2.5 bg-[#0D1117] rounded-lg border border-gray-800 hover:border-gray-700 transition">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${key.lastUsed ? 'bg-green-400' : 'bg-gray-600'}`} />
                      <span className="text-sm text-gray-300 truncate">{key.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">
                      {key.lastUsed ? timeAgo(key.lastUsed) : 'Never'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-linear-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">🚀 Quick Actions</h3>
              <p className="text-sm text-gray-400">Get started with common tasks</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg transition font-medium text-sm"
              >
                + New Project
              </button>
              <Link
                href="/dashboard/settings"
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition border border-gray-700 font-medium text-sm"
              >
                🔑 API Keys
              </Link>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="bg-[#161B22] border border-gray-800 rounded-2xl">
          <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">Your Projects</h3>
              <p className="text-sm text-gray-400 mt-1">Manage feature flags across environments</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg transition font-medium text-sm"
            >
              + New Project
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto" />
              <p className="text-gray-400 mt-4">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
              <p className="text-gray-400 mb-6">Create your first project to start managing feature flags</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium cursor-pointer"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="group bg-[#0D1117] border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 hover:bg-[#161B22] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-white mb-2 text-lg group-hover:text-blue-400 transition">
                    {project.name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-gray-400">{project._count?.flags || 0} flags</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                      <span className="text-gray-400">{project._count?.environments || 0} envs</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  )
}