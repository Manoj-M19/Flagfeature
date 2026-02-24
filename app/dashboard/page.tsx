'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'
import CreateProjectModal from '@/components/create-project-modal'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  description: string | null
  createdAt: string
  _count: {
    flags: number
    environments: number
  }
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (token) {
      fetchProjects()
    }
  }, [token])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      
      if (!res.ok) {
        setLoading(false)
        return
      }
      
      const data = await res.json()
      const projectsArray = Array.isArray(data) ? data : (data.projects || [])
      setProjects(projectsArray)
    } catch (err) {
      console.error('Failed to fetch projects:', err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = () => {
    setTimeout(() => fetchProjects(), 500)
  }

  const totalFlags = projects.reduce((sum, p) => sum + (p._count?.flags || 0), 0)
  const totalEnvs = projects.reduce((sum, p) => sum + (p._count?.environments || 0), 0)

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'User'} 👋
          </h2>
          <p className="text-gray-400">Manage your feature flags across all environments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#161B22] border border-gray-800 p-6 rounded-xl hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium">+12% this week</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{projects?.length || 0}</div>
            <div className="text-sm text-gray-400">Total Projects</div>
          </div>

          <div className="bg-[#161B22] border border-gray-800 p-6 rounded-xl hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium">Active</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalFlags}</div>
            <div className="text-sm text-gray-400">Feature Flags</div>
          </div>

          <div className="bg-[#161B22] border border-gray-800 p-6 rounded-xl hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium">Managed</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalEnvs}</div>
            <div className="text-sm text-gray-400">Environments</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-linear-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">🚀 Quick Actions</h3>
              <p className="text-sm text-gray-400">Get started with common tasks</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg transition font-medium"
              >
                + New Project
              </button>
              <Link
                href="/dashboard/settings"
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition border border-gray-700 font-medium"
              >
                🔑 API Keys
              </Link>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-[#161B22] border border-gray-800 rounded-xl">
          <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">Your Projects</h3>
              <p className="text-sm text-gray-400 mt-1">Manage feature flags across environments</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg transition font-medium"
            >
              + New Project
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading projects...</p>
            </div>
          ) : projects?.length === 0 ? (
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
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {projects?.map((project) => (
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
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-40px">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-400">{project._count?.flags || 0} flags</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
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