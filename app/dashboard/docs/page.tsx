export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-indigo-600">FlagFeature</h1>
            <a href="/dashboard" className="text-indigo-600 hover:text-indigo-700">
              Go to Dashboard →
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
        <p className="text-xl text-gray-600 mb-12">
          Learn how to integrate FlagFeature into your applications
        </p>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start</h2>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">1. Generate an API Key</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Go to Dashboard → Settings</li>
              <li>Click "Create New API Key"</li>
              <li>Give it a name and copy the generated key</li>
              <li>⚠️ Store it securely - you won't see it again!</li>
            </ol>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3 text-red-800">2. Use the API</h3>
            <p className="text-gray-700 mb-3 ">Make a GET request to fetch your flags:</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
{`curl -X GET "https://your-app.com/api/sdk/evaluate?projectId=YOUR_PROJECT_ID&environment=production" \\
  -H "x-api-key: ff_your_api_key_here"`}
            </pre>
            <p className="text-gray-700 mt-3 mb-2">Response:</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
{`{
  "flags": {
    "new_feature": true,
    "beta_mode": false,
    "dark_mode": true
  }
}`}
            </pre>
          </div>
        </section>

        {/* JavaScript Integration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">JavaScript/TypeScript SDK</h2>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-red-800">3.Installation</h3>
            <p className="text-gray-700 mb-3">Copy the SDK client to your project:</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
{`// Copy from lib/sdk/client.ts
// Or use fetch directly (see examples below)`}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3 text-red-800">4.Usage Example</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import { FlagFeatureClient } from './sdk/client'

// Initialize client
const client = new FlagFeatureClient({
  apiKey: process.env.FLAGFEATURE_API_KEY!,
  projectId: 'your-project-id',
  environment: 'production',
  baseUrl: 'https://your-flagfeature-app.com'
})

// Check if a flag is enabled
const isNewFeatureEnabled = await client.isEnabled('new_feature')

if (isNewFeatureEnabled) {
  // Show new feature
  renderNewFeature()
} else {
  // Show old feature
  renderOldFeature()
}`}
            </pre>
          </div>
        </section>

        {/* React Integration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">React Integration</h2>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3 text-red-800">5.Using the Hook</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`import { useFeatureFlags } from './sdk/use-feature-flags'
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
}`}
            </pre>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          
          <div className="bg-white rounded-lg shadow p-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Use environment variables</strong> for API keys - never hardcode them</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Cache flag values</strong> to reduce API calls (SDK does this automatically)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Test in development</strong> first before enabling in production</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Use descriptive flag names</strong> like "new_checkout_flow" not "feature1"</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">✗</span>
                <span><strong>Don't expose API keys</strong> in client-side code in production</span>
              </li>
            </ul>
          </div>
        </section>

        {/* API Reference */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h2>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3 text-rose-800 text-b">GET /api/sdk/evaluate</h3>
            <p className="text-gray-700 mb-3">Fetch all flag states for a project and environment.</p>
            
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Headers:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li><code>x-api-key</code>: Your API key (required)</li>
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Query Parameters:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li><code>projectId</code>: Your project ID (required)</li>
                <li><code>environment</code>: Environment name - development, staging, or production (required)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Response:</h4>
              <pre className="bg-gray-100 p-3 text-green-800 rounded text-sm overflow-x-auto">
{`{
  "flags": {
    "flag_key": boolean,
    ...
  }
}`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}