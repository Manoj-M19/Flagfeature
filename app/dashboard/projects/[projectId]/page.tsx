'use client'

import { useEffect, useState} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'
import CreateFlagModal from '@/components/create-flag-modal'

interface FlagState {
  id: string
  enabled: boolean
  rolloutPercentage: number
  environment: { id: string; name: string }
}

interface Flag {
  id: string
  key: string
  name: string
  description: string | null
  createdAt: string
  states: FlagState[]
}

interface Environment {
  id: string
  name: string
}

interface Member {
  id: string
  role: string
  user: { id: string; name: string | null; email: string }
}

interface AuditLog {
  id: string
  action: string
  details: any
  createdAt: string
  user: { id: string; name: string | null; email: string }
}

interface Project {
  id: string
  name: string
  description: string | null
  environments: Environment[]
  flags: Flag[]
  members: Member[]
}

const ENV_COLORS: Record<string, { tab: string; badge: string; dot: string }> = {
  production:  { tab: 'border-red-500/60 text-red-400 bg-red-500/10',          badge: 'text-red-400 bg-red-500/10 border-red-500/30',         dot: 'bg-red-400'    },
  staging:     { tab: 'border-yellow-500/60 text-yellow-400 bg-yellow-500/10', badge: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', dot: 'bg-yellow-400' },
  development: { tab: 'border-green-500/60 text-green-400 bg-green-500/10',    badge: 'text-green-400 bg-green-500/10 border-green-500/30',    dot: 'bg-green-400'  },
}

const ROLE_COLORS: Record<string, string> = {
  OWNER:  'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  ADMIN:  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  MEMBER: 'text-gray-300 bg-gray-500/10 border-gray-500/30',
  VIEWER: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
}

function getEnvTheme(name: string) {
  return ENV_COLORS[name.toLowerCase()] ?? {
    tab:   'border-blue-500/60 text-blue-400 bg-blue-500/10',
    badge: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    dot:   'bg-blue-400',
  }
}

function getInitials(name: string | null, email: string) {
  if (name) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  return email[0].toUpperCase()
}

function getRolloutColor(pct: number) {
  if (pct === 100) return 'bg-green-500'
  if (pct >= 50)   return 'bg-blue-500'
  if (pct >= 10)   return 'bg-yellow-500'
  return 'bg-red-500'
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const token = useAuthStore((state) => state.token)
  const user  = useAuthStore((state) => state.user)

  const [project, setProject]       = useState<Project | null>(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeEnvId, setActiveEnvId] = useState<string | null>(null)

  const [inviteEmail, setInviteEmail]     = useState('')
  const [inviteRole, setInviteRole]       = useState('MEMBER')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError]     = useState('')
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [removingId, setRemovingId]       = useState<string | null>(null)

  const [pendingRollout, setPendingRollout] = useState<Record<string, ReturnType<typeof setTimeout>>>({})

  const [auditLogs, setAuditLogs]       = useState<AuditLog[]>([])
  const [auditLoading, setAuditLoading] = useState(false)

  useEffect(() => {
    if (params.projectId && token) {
      fetchProject()
      fetchAuditLogs()
    }
  }, [params.projectId, token])

  useEffect(() => {
    if (project?.environments?.length && !activeEnvId) {
      const prod = project.environments.find((e) => e.name.toLowerCase() === 'production')
      setActiveEnvId(prod?.id ?? project.environments[0].id)
    }
  }, [project])

  const fetchProject = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/projects/${params.projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 404) {
        setError('Project not found')
        setTimeout(() => router.push('/dashboard'), 2000)
        return
      }
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to load project')
        return
      }
      const data = await res.json()
      setProject(data.project)
    } catch {
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const fetchAuditLogs = async () => {
    setAuditLoading(true)
    try {
      const res = await fetch(`/api/projects/${params.projectId}/audit`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAuditLogs(data.logs)
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err)
    } finally {
      setAuditLoading(false)
    }
  }

  const ACTION_META: Record<string, { label: string; icon: string; color: string }> = {
    FLAG_CREATED:    { label: 'Flag created',    icon: '🚩', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'       },
    FLAG_TOGGLED:    { label: 'Flag toggled',    icon: '🔄', color: 'text-green-400 bg-green-500/10 border-green-500/30'     },
    ROLLOUT_UPDATED: { label: 'Rollout updated', icon: '📊', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'  },
    MEMBER_INVITED:  { label: 'Member invited',  icon: '👤', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    MEMBER_REMOVED:  { label: 'Member removed',  icon: '🚫', color: 'text-red-400 bg-red-500/10 border-red-500/30'          },
  }

  function getAuditDescription(action: string, details: any): string {
    switch (action) {
      case 'FLAG_CREATED':    return `Created flag "${details?.flagName}" (${details?.flagKey})`
      case 'FLAG_TOGGLED':    return `${details?.to ? 'Enabled' : 'Disabled'} "${details?.flagName}" in ${details?.environment}`
      case 'ROLLOUT_UPDATED': return `Set "${details?.flagName}" rollout to ${details?.rolloutPercentage}% in ${details?.environment}`
      case 'MEMBER_INVITED':  return `Invited ${details?.invitedEmail} as ${details?.role}`
      case 'MEMBER_REMOVED':  return `Removed ${details?.removedEmail} from project`
      default: return action
    }
  }

  function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1)  return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24)  return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const toggleFlag = async (flagId: string, environmentId: string, enabled: boolean) => {
    setProject((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        flags: prev.flags.map((f) =>
          f.id !== flagId ? f : {
            ...f,
            states: f.states.map((s) =>
              s.environment.id === environmentId ? { ...s, enabled } : s
            ),
          }
        ),
      }
    })
    try {
      const res = await fetch(`/api/projects/${params.projectId}/flags/${flagId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ environmentId, enabled }),
      })
      if (!res.ok) {
        setProject((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            flags: prev.flags.map((f) =>
              f.id !== flagId ? f : {
                ...f,
                states: f.states.map((s) =>
                  s.environment.id === environmentId ? { ...s, enabled: !enabled } : s
                ),
              }
            ),
          }
        })
      } else {
        fetchAuditLogs()
      }
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  // Update rollout percentage with 600ms debounce to avoid hammering the API
  const updateRollout = (flagId: string, environmentId: string, rolloutPercentage: number) => {
    // Optimistic UI update immediately
    setProject((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        flags: prev.flags.map((f) =>
          f.id !== flagId ? f : {
            ...f,
            states: f.states.map((s) =>
              s.environment.id === environmentId ? { ...s, rolloutPercentage } : s
            ),
          }
        ),
      }
    })

    // Debounce the API call
    const key = `${flagId}-${environmentId}`
    setPendingRollout((prev) => {
      if (prev[key]) clearTimeout(prev[key])
      const timer = setTimeout(async () => {
        try {
          await fetch(`/api/projects/${params.projectId}/flags/${flagId}/toggle`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ environmentId, rolloutPercentage }),
          })
          fetchAuditLogs();
        } catch (err) {
          console.error('Rollout update error:', err)
        }
      }, 600)
      return { ...prev, [key]: timer }
    })
  }

  const handleFlagCreated = (newFlag: Flag) => {
    setProject((prev) => {
      if (!prev) return prev
      return { ...prev, flags: [newFlag, ...prev.flags] }
    })
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError('')
    setInviteSuccess('')
    setInviteLoading(true)
    try {
      const res = await fetch(`/api/projects/${params.projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      const data = await res.json()
      if (!res.ok) { setInviteError(data.error || 'Failed to invite member'); return }
      setInviteSuccess(`${inviteEmail} added successfully!`)
      setInviteEmail('')
      setProject((prev) => prev ? { ...prev, members: [...prev.members, data.member] } : prev)
      setTimeout(() => setInviteSuccess(''), 3000)
    } catch { setInviteError('Something went wrong') }
    finally { setInviteLoading(false) }
  }

  const handleRemoveMember = async (memberId: string) => {
    setRemovingId(memberId)
    try {
      const res = await fetch(`/api/projects/${params.projectId}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ memberId }),
      })
      if (res.ok) {
        setProject((prev) => prev ? { ...prev, members: prev.members.filter((m) => m.id !== memberId) } : prev)
      }
    } catch (err) { console.error('Remove member error:', err) }
    finally { setRemovingId(null) }
  }

  const activeEnv      = project?.environments.find((e) => e.id === activeEnvId)
  const filteredFlags  = (project?.flags ?? []).filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.key.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const enabledCount   = filteredFlags.filter((f) => f.states.find((s) => s.environment.id === activeEnvId)?.enabled).length
  const currentMember  = project?.members.find((m) => m.user.id === user?.id)
  const canManage      = currentMember && ['OWNER', 'ADMIN'].includes(currentMember.role)

  if (loading) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4" />
        <p className="text-gray-400">Loading project...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => router.push('/dashboard')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">Back to Dashboard</button>
      </div>
    </div>
  )

  if (!project) return null

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div>
          <button onClick={() => router.push('/dashboard')} className="text-blue-400 hover:text-blue-300 mb-5 flex items-center gap-2 transition text-sm group cursor-pointer">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">{project.name}</h2>
              <p className="text-gray-400 mt-1 text-sm">{project.description || 'No description'}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V4m0 0l9-2 9 2v11l-9-2-9 2V4z" />
                </svg>
                {project.flags.length} flags
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {project.members.length} members
              </div>
            </div>
          </div>
        </div>

        {/* Environment Tabs */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 ">Select Environment</p>
          <div className="flex gap-2 flex-wrap ">
            {project.environments.map((env) => {
              const isActive = activeEnvId === env.id
              const theme = getEnvTheme(env.name)
              const flagsEnabled = project.flags.filter((f) => f.states.find((s) => s.environment.id === env.id)?.enabled).length
              return (
                <button key={env.id} onClick={() => setActiveEnvId(env.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    isActive ? `${theme.tab} shadow-sm` : 'text-gray-500 bg-transparent border-gray-800 hover:border-gray-600 hover:text-gray-300 cursor-pointer'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? theme.dot : 'bg-gray-700'}`} />
                  <span className="capitalize">{env.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-black/20' : 'bg-gray-800 text-gray-600'}`}>
                    {flagsEnabled}/{project.flags.length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Flags Table ───────────────────────────────────────── */}
        <div className="bg-[#161B22] border border-gray-800 rounded-2xl">
          <div className="px-6 py-5 border-b border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">Feature Flags</h3>
                  {activeEnv && (
                    <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium capitalize ${getEnvTheme(activeEnv.name).badge}`}>
                      {activeEnv.name}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {enabledCount} of {filteredFlags.length} enabled
                  {activeEnv && <span className="text-gray-500"> in {activeEnv.name}</span>}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center gap-2 text-sm cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Flag
              </button>
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search flags by name or key..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0D1117] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm transition"
              />
            </div>
          </div>

          {filteredFlags.length === 0 ? (
            <div className="p-14 text-center">
              <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{searchTerm ? 'No flags match your search' : 'No flags yet'}</h3>
              <p className="text-gray-400 text-sm mb-6">{searchTerm ? 'Try a different search term' : 'Create your first feature flag to get started'}</p>
              {!searchTerm && (
                <button onClick={() => setIsModalOpen(true)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm cursor-pointer">
                  Create Your First Flag
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Flag</th>
                    <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Key</th>
                    <th className="text-center py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-64">Rollout</th>
                    <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredFlags.map((flag) => {
                    const state      = flag.states.find((s) => s.environment.id === activeEnvId)
                    const isEnabled  = state?.enabled ?? false
                    const rollout    = state?.rolloutPercentage ?? 100

                    return (
                      <tr key={flag.id} className="hover:bg-[#0D1117]/60 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-medium text-white">{flag.name}</p>
                          {flag.description && <p className="text-xs text-gray-500 mt-0.5">{flag.description}</p>}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs text-gray-400 bg-[#0D1117] px-2.5 py-1 rounded border border-gray-700">
                            {flag.key}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-3">
                            <span className={`text-xs font-medium w-14 text-right ${isEnabled ? 'text-green-400' : 'text-gray-500 '}`}>
                              {isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <button
                              onClick={() => toggleFlag(flag.id, activeEnvId!, !isEnabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                isEnabled ? 'bg-green-500 cursor-pointer' : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </div>
                        </td>

                        {/* Rollout slider */}
                        <td className="py-4 px-6">
                          <div className={`space-y-1.5 ${!isEnabled ? 'opacity-40 pointer-events-none' : ''}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">Rollout</span>
                              <span className={`text-xs font-semibold font-mono ${
                                rollout === 100 ? 'text-green-400' :
                                rollout >= 50   ? 'text-blue-400'  :
                                rollout >= 10   ? 'text-yellow-400': 'text-red-400'
                              }`}>
                                {rollout}%
                              </span>
                            </div>
                            {/* Progress bar background */}
                            <div className="relative h-1.5 bg-gray-700 rounded-full">
                              <div
                                className={`absolute left-0 top-0 h-full rounded-full transition-all ${getRolloutColor(rollout)}`}
                                style={{ width: `${rollout}%` }}
                              />
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              step={5}
                              value={rollout}
                              onChange={(e) => updateRollout(flag.id, activeEnvId!, Number(e.target.value))}
                              className="w-full cursor-pointer"
                              style={{ accentColor: '#3b82f6' }}
                            />
                            <div className="flex justify-between text-[10px] text-gray-600">
                              <span>0%</span>
                              <span>50%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-sm text-gray-500">
                          {new Date(flag.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Members Section ──────────────────────────────────── */}
        <div className="bg-[#161B22] border border-gray-800 rounded-2xl">
          <div className="px-6 py-5 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white">Team Members</h3>
            <p className="text-sm text-gray-400 mt-1">{project.members.length} member{project.members.length !== 1 ? 's' : ''} in this project</p>
          </div>

          {canManage && (
            <div className="px-6 py-5 border-b border-gray-800 bg-[#0D1117]/40 " >
              <p className="text-sm font-medium text-gray-300 mb-3">Invite a member</p>
              <form onSubmit={handleInvite} className="flex gap-3 flex-wrap">
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com" required
                  className="flex-1 min-w-50 px-4 py-2.5 bg-[#0D1117] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm transition "
                />
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                  className="px-4 py-2.5 bg-[#0D1117] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition cursor-pointer"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                  <option value="VIEWER">Viewer</option>
                </select>
                <button type="submit" disabled={inviteLoading || !inviteEmail.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {inviteLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Inviting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Invite
                    </>
                  )}
                </button>
              </form>
              {inviteError   && <p className="mt-2 text-sm text-red-400">{inviteError}</p>}
              {inviteSuccess && <p className="mt-2 text-sm text-green-400">{inviteSuccess}</p>}
            </div>
          )}

          <div className="divide-y divide-gray-800">
            {project.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#0D1117]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {getInitials(member.user.name, member.user.email)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {member.user.name || member.user.email}
                      {member.user.id === user?.id && <span className="ml-2 text-xs text-gray-500">(you)</span>}
                    </p>
                    {member.user.name && <p className="text-xs text-gray-500">{member.user.email}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${ROLE_COLORS[member.role] ?? ROLE_COLORS.MEMBER}`}>
                    {member.role}
                  </span>
                  {canManage && member.role !== 'OWNER' && member.user.id !== user?.id && (
                    <button onClick={() => handleRemoveMember(member.id)} disabled={removingId === member.id}
                      className="text-xs text-red-500 hover:text-red-400 transition font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 disabled:opacity-50"
                    >
                      {removingId === member.id ? 'Removing...' : 'Remove'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Audit Log ─────────────────────────────────────────── */}
        <div className="bg-[#161B22] border border-gray-800 rounded-2xl">
          <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Audit Log</h3>
              <p className="text-sm text-gray-400 mt-1">Last 50 actions in this project</p>
            </div>
            <button
              onClick={fetchAuditLogs}
              className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-800 border border-gray-700"
            >
              <svg className="w-3.5 h-3.5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {auditLoading ? (
            <div className="p-10 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto" />
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {auditLogs.map((log) => {
                const meta = ACTION_META[log.action] ?? { label: log.action, icon: '•', color: 'text-gray-400 bg-gray-500/10 border-gray-500/30' }
                return (
                  <div key={log.id} className="flex items-start gap-4 px-6 py-4 hover:bg-[#0D1117]/40 transition-colors">
                    <div className={`text-lg w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${meta.color}`}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{getAuditDescription(log.action, log.details)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{log.user.name || log.user.email}</span>
                        <span className="text-gray-700">·</span>
                        <span className="text-xs text-gray-600">{timeAgo(log.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium shrink-0 ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      <CreateFlagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.id}
        onFlagCreated={handleFlagCreated}
      />
    </div>
  )
}