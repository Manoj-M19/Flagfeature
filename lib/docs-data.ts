export const docsData = {
  quickStart: {
    title: "Quick Start",
    description: "Get up and running with FlagFeature in under 5 minutes.",
    steps: [
      "Register an account at FlagFeature",
      "Create a new project from the dashboard",
      "Generate an API key in Settings → API Keys",
      "Create your first feature flag",
      "Call the SDK evaluate endpoint from your app",
    ],
  },
  sdk: {
    title: "SDK Usage",
    description: "Evaluate feature flags from any language using our REST API.",
    endpoint: "GET /api/sdk/evaluate",
    params: [
      { name: "projectId", type: "string", required: true, description: "Your project ID" },
      { name: "environment", type: "string", required: true, description: "Environment name: development, staging, production" },
      { name: "userId", type: "string", required: false, description: "User ID for deterministic rollout hashing" },
    ],
    example: `const res = await fetch(
  'https://your-app.vercel.app/api/sdk/evaluate?projectId=PROJ_ID&environment=production&userId=user_123',
  { headers: { 'x-api-key': 'YOUR_API_KEY' } }
)
const { flags } = await res.json()

if (flags.new_feature) {
  // show new feature
}`,
  },
  react: {
    title: "React Integration",
    description: "Use this custom hook to evaluate flags in any React component.",
    example: `import { useEffect, useState } from 'react'

export function useFlags(userId: string) {
  const [flags, setFlags] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(
      \`/api/sdk/evaluate?projectId=PROJ_ID&environment=production&userId=\${userId}\`,
      { headers: { 'x-api-key': process.env.NEXT_PUBLIC_FLAG_API_KEY! } }
    )
      .then(r => r.json())
      .then(data => setFlags(data.flags))
  }, [userId])

  return flags
}

// In your component:
const flags = useFlags(user.id)
if (flags.dark_mode) return <DarkTheme />`,
  },
  rollout: {
    title: "Percentage Rollouts",
    description: "Gradually roll out features to a percentage of your users.",
    points: [
      "Set rollout from 0% to 100% using the slider on the project page",
      "Pass a userId to the SDK for deterministic, sticky rollouts",
      "The same user always gets the same flag result — no flickering",
      "Increasing rollout from 50% to 75% keeps the original 50% cohort in",
      "Without a userId, rollout is random per request (not sticky)",
    ],
  },
  environments: {
    title: "Environments",
    description: "Each project has three environments by default.",
    envs: [
      { name: "development", color: "green", description: "For local development and testing" },
      { name: "staging", color: "yellow", description: "For QA and pre-production validation" },
      { name: "production", color: "red", description: "Live traffic — change with care" },
    ],
  },
  apiReference: {
    title: "API Reference",
    routes: [
      { method: "POST", path: "/api/auth/register", auth: "None", description: "Create account" },
      { method: "POST", path: "/api/auth/login", auth: "None", description: "Login, returns JWT" },
      { method: "GET", path: "/api/projects", auth: "JWT", description: "List your projects" },
      { method: "POST", path: "/api/projects", auth: "JWT", description: "Create a project" },
      { method: "GET", path: "/api/projects/:id", auth: "JWT", description: "Project detail + flags + members" },
      { method: "POST", path: "/api/projects/:id/flags", auth: "JWT", description: "Create a flag" },
      { method: "PATCH", path: "/api/projects/:id/flags/:id/toggle", auth: "JWT", description: "Toggle flag or update rollout %" },
      { method: "POST", path: "/api/projects/:id/members", auth: "JWT", description: "Invite a member" },
      { method: "DELETE", path: "/api/projects/:id/members", auth: "JWT", description: "Remove a member" },
      { method: "GET", path: "/api/projects/:id/audit", auth: "JWT", description: "Audit log (last 50)" },
      { method: "GET", path: "/api/analytics", auth: "JWT", description: "Dashboard analytics" },
      { method: "GET", path: "/api/sdk/evaluate", auth: "API Key", description: "Evaluate all flags for a project" },
    ],
  },
}