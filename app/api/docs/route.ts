import { NextResponse } from "next/server";
import { docsData } from "@/lib/docs-data";

export async function GET() {
  return NextResponse.json(docsData, { status: 200 });
}

// keeping old inline data below for reference — delete when ready
const _unused = {
    version: "1.0.0",
    title: "FlagFeature API Documentation",
    description: "Learn how to integrate FlagFeature into your applications",
    baseUrl: "https://your-flagfeature-app.com",

    quickStart: {
      steps: [
        "Go to Dashboard → Settings",
        'Click "Create New API Key"',
        "Give it a name and copy the generated key",
        "Store it securely — you won't see it again!",
      ],
    },

    endpoints: [
      {
        method: "GET",
        path: "/api/sdk/evaluate",
        description: "Fetch all flag states for a project and environment.",
        headers: [
          {
            name: "x-api-key",
            required: true,
            description: "Your API key",
          },
        ],
        queryParams: [
          {
            name: "projectId",
            required: true,
            description: "Your project ID",
          },
          {
            name: "environment",
            required: true,
            description: "Environment name — development, staging, or production",
          },
        ],
        exampleRequest: `curl -X GET "https://your-app.com/api/sdk/evaluate?projectId=YOUR_PROJECT_ID&environment=production" \\
  -H "x-api-key: ff_your_api_key_here"`,
        exampleResponse: {
          flags: {
            new_feature: true,
            beta_mode: false,
            dark_mode: true,
          },
        },
      },
    ],

    sdks: {
      javascript: {
        language: "TypeScript / JavaScript",
        installation: "Copy from lib/sdk/client.ts or use fetch directly.",
        example: `import { FlagFeatureClient } from './sdk/client'

const client = new FlagFeatureClient({
  apiKey: process.env.FLAGFEATURE_API_KEY!,
  projectId: 'your-project-id',
  environment: 'production',
  baseUrl: 'https://your-flagfeature-app.com'
})

const isNewFeatureEnabled = await client.isEnabled('new_feature')

if (isNewFeatureEnabled) {
  renderNewFeature()
} else {
  renderOldFeature()
}`,
      },
      react: {
        language: "React",
        example: `import { useFeatureFlags } from './sdk/use-feature-flags'
import { FlagFeatureClient } from './sdk/client'

const client = new FlagFeatureClient({
  apiKey: process.env.NEXT_PUBLIC_FLAGFEATURE_API_KEY!,
  projectId: 'your-project-id',
  environment: 'production'
})

function MyComponent() {
  const { flags, loading, isEnabled } = useFeatureFlags(client)

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {isEnabled('new_checkout') && <NewCheckout />}
      {!isEnabled('new_checkout') && <OldCheckout />}
      {isEnabled('dark_mode') && <DarkModeToggle />}
    </div>
  )
}`,
      },
    },

    bestPractices: {
      do: [
        "Use environment variables for API keys — never hardcode them",
        "Cache flag values to reduce API calls (SDK does this automatically)",
        "Test in development first before enabling in production",
        'Use descriptive flag names like "new_checkout_flow" not "feature1"',
      ],
      dont: [
        "Don't expose API keys in client-side code in production",
      ],
    },
  };