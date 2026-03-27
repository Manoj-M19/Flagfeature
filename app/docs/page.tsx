'use client'

import { docsData } from '@/lib/docs-data'
import { useState } from 'react'

const METHOD_COLORS: Record<string, string> = {
  GET:    'text-green-400 bg-green-500/10 border-green-500/30',
  POST:   'text-blue-400 bg-blue-500/10 border-blue-500/30',
  PATCH:  'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/30',
}

const ENV_COLORS: Record<string, string> = {
  green:  'text-green-400 bg-green-500/10 border-green-500/30',
  yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  red:    'text-red-400 bg-red-500/10 border-red-500/30',
}

export default function DocsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Documentation</h1>
          <p className="text-gray-400">Everything you need to integrate FlagFeature into your app.</p>
        </div>

        {/* Quick Start */}
        <section className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-1">{docsData.quickStart.title}</h2>
          <p className="text-gray-400 text-sm mb-5">{docsData.quickStart.description}</p>
          <ol className="space-y-3">
            {docsData.quickStart.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-300 text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* SDK Usage */}
        <section className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-1">{docsData.sdk.title}</h2>
          <p className="text-gray-400 text-sm mb-5">{docsData.sdk.description}</p>

          <div className="bg-[#0D1117] border border-gray-700 rounded-lg px-4 py-2 mb-5 flex items-center gap-3">
            <span className="text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded">GET</span>
            <code className="text-sm text-gray-300 font-mono">{docsData.sdk.endpoint}</code>
          </div>

          <p className="text-sm font-medium text-gray-300 mb-3">Query Parameters</p>
          <div className="overflow-x-auto mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Param</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Type</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Required</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {docsData.sdk.params.map((p) => (
                  <tr key={p.name}>
                    <td className="py-2 px-3 font-mono text-blue-400">{p.name}</td>
                    <td className="py-2 px-3 text-gray-400">{p.type}</td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium ${p.required ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-gray-500 bg-gray-500/10 border-gray-700'}`}>
                        {p.required ? 'required' : 'optional'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-400">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="relative">
            <pre className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-x-auto">
              {docsData.sdk.example}
            </pre>
            <button
              onClick={() => copy(docsData.sdk.example, 'sdk')}
              className="absolute top-3 right-3 text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 px-2 py-1 rounded transition"
            >
              {copied === 'sdk' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </section>

        {/* React Integration */}
        <section className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-1">{docsData.react.title}</h2>
          <p className="text-gray-400 text-sm mb-5">{docsData.react.description}</p>
          <div className="relative">
            <pre className="bg-[#0D1117] border border-gray-700 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-x-auto">
              {docsData.react.example}
            </pre>
            <button
              onClick={() => copy(docsData.react.example, 'react')}
              className="absolute top-3 right-3 text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 px-2 py-1 rounded transition"
            >
              {copied === 'react' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </section>

        {/* Rollouts */}
        <section className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-1">{docsData.rollout.title}</h2>
          <p className="text-gray-400 text-sm mb-5">{docsData.rollout.description}</p>
          <ul className="space-y-2">
            {docsData.rollout.points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-blue-400 mt-0.5">→</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* Environments */}
        <section className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-1">{docsData.environments.title}</h2>
          <p className="text-gray-400 text-sm mb-5">{docsData.environments.description}</p>
          <div className="space-y-3">
            {docsData.environments.envs.map((env) => (
              <div key={env.name} className="flex items-center gap-4 px-4 py-3 bg-[#0D1117] border border-gray-800 rounded-lg">
                <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium capitalize ${ENV_COLORS[env.color]}`}>
                  {env.name}
                </span>
                <span className="text-sm text-gray-400">{env.description}</span>
              </div>
            ))}
          </div>
        </section>

        {/* API Reference */}
        <section className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-1">{docsData.apiReference.title}</h2>
          <p className="text-gray-400 text-sm mb-5">All endpoints require a Bearer JWT token unless noted.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Method</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Endpoint</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Auth</th>
                  <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {docsData.apiReference.routes.map((route) => (
                  <tr key={`${route.method}-${route.path}`}  className="hover:bg-[#0D1117]/40 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium font-mono ${METHOD_COLORS[route.method]}`}>
                        {route.method}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-gray-300">{route.path}</td>
                    <td className="py-2.5 px-3 text-xs text-gray-500">{route.auth}</td>
                    <td className="py-2.5 px-3 text-gray-400 text-xs">{route.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}