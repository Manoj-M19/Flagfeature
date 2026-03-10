import Link from "next/link";
import { docsData } from "@/lib/docs-data";

export const metadata = {
  title: "Documentation — FlagFeature",
  description: "Learn how to integrate FlagFeature into your applications",
};

export default function DocsPage() {
  const docs = docsData;

  return (
    <div className="min-h-screen bg-[#0D1117]">

      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-[#161B22] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V4m0 0l9-2 9 2v11l-9-2-9 2V4z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">FlagFeature</span>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition group"
            >
              ← Back to Dashboard
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">{docs.title}</h1>
          <p className="text-lg text-gray-400">{docs.description}</p>
        </div>

        {/* Quick Start */}
        <section className="mb-10">
          <SectionHeader index="1" title="Quick Start" />
          <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-6 mb-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Generate an API Key</h3>
            <ol className="space-y-2 text-sm text-gray-300">
              {docs.quickStart.steps.map((step, i) =>
                i < 3 ? (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 text-gray-500 text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ) : (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span className="text-yellow-400/80">{step}</span>
                  </li>
                )
              )}
            </ol>
          </div>

          {docs.endpoints.map((endpoint) => (
            <div key={endpoint.path} className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Use the API</h3>
              <p className="text-sm text-gray-400 mb-3">Make a {endpoint.method} request to fetch your flags:</p>
              <CodeBlock>{endpoint.exampleRequest}</CodeBlock>
              <p className="text-sm text-gray-400 mt-4 mb-3">Response:</p>
              <CodeBlock>{JSON.stringify(endpoint.exampleResponse, null, 2)}</CodeBlock>
            </div>
          ))}
        </section>

        {/* JavaScript SDK */}
        <section className="mb-10">
          <SectionHeader index="2" title="JavaScript / TypeScript SDK" />
          <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-6 mb-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Installation</h3>
            <p className="text-sm text-gray-400 mb-3">{docs.sdks.javascript.installation}</p>
            <CodeBlock>{`// Copy from lib/sdk/client.ts\n// Or use fetch directly (see examples below)`}</CodeBlock>
          </div>
          <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Usage Example</h3>
            <CodeBlock>{docs.sdks.javascript.example}</CodeBlock>
          </div>
        </section>

        {/* React Integration */}
        <section className="mb-10">
          <SectionHeader index="3" title="React Integration" />
          <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">Using the Hook</h3>
            <CodeBlock>{docs.sdks.react.example}</CodeBlock>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-10">
          <SectionHeader index="4" title="Best Practices" />
          <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
            <ul className="space-y-3 text-sm">
              {docs.bestPractices.do.map((tip, i) => (
                <BestPracticeItem key={`do-${i}`} ok={true} text={tip} />
              ))}
              {docs.bestPractices.dont.map((tip, i) => (
                <BestPracticeItem key={`dont-${i}`} ok={false} text={tip} />
              ))}
            </ul>
          </div>
        </section>

        {/* API Reference */}
        <section>
          <SectionHeader index="5" title="API Reference" />
          {docs.endpoints.map((endpoint) => (
            <div key={`ref-${endpoint.path}`} className="bg-[#161B22] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg font-mono">
                  {endpoint.method}
                </span>
                <code className="text-sm text-gray-300 font-mono">{endpoint.path}</code>
              </div>
              <p className="text-sm text-gray-400 mb-5">{endpoint.description}</p>

              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Headers</h4>
                  <div className="bg-[#0D1117] border border-gray-700 rounded-lg divide-y divide-gray-800 text-sm">
                    {endpoint.headers.map((h) => (
                      <div key={h.name} className="px-4 py-3 flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-blue-400">{h.name}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-400">{h.description}</span>
                        {h.required && <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded font-mono">required</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Query Parameters</h4>
                  <div className="bg-[#0D1117] border border-gray-700 rounded-lg divide-y divide-gray-800 text-sm">
                    {endpoint.queryParams.map((p) => (
                      <div key={p.name} className="px-4 py-3 flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-blue-400">{p.name}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-400">{p.description}</span>
                        {p.required && <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded font-mono">required</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Response</h4>
                  <CodeBlock>{`{\n  "flags": {\n    "flag_key": boolean,\n    ...\n  }\n}`}</CodeBlock>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

// ── Shared components ─────────────────────────────────────────────

function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <span className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-mono">
        {index}
      </span>
      {title}
    </h2>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-[#0D1117] border border-gray-700 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed whitespace-pre">
      {children}
    </pre>
  );
}

function BestPracticeItem({ ok, text }: { ok: boolean; text: string }) {
  const parts = text.split(" — ");
  const bold = parts[0];
  const rest = parts.slice(1).join(" — ");
  return (
    <li className="flex items-start gap-3">
      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${ok ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
        {ok ? "✓" : "✗"}
      </span>
      <span className="text-sm">
        <strong className="text-white">{bold}</strong>
        {rest && <span className="text-gray-400"> — {rest}</span>}
      </span>
    </li>
  );
}