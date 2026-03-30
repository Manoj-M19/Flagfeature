<div align="center">
<img src="public/screenshots/landing.png" alt="FlagFeature Landing Page" width="100%" style="border-radius: 12px" />

FlagFeature

Production-grade feature flag platform built with Next.js 15
Ship features safely. Roll out gradually. Never break production.

📸 Screenshots
<div align="center">
Dashboard & Analytics
<img src="public/screenshots/dashboard.png" alt="Dashboard" width="100%" style="border-radius: 8px; margin-bottom: 16px" />
Feature Flag Management
<img src="public/screenshots/flags.png" alt="Feature Flags" width="100%" style="border-radius: 8px; margin-bottom: 16px" />
Audit Log
<img src="public/screenshots/audit.png" alt="Audit Log" width="100%" style="border-radius: 8px" />
</div>

What is FlagFeature?
FlagFeature is a self-hosted feature flag management platform — similar to LaunchDarkly or Flagsmith — built entirely from scratch. It lets development teams safely ship features by controlling who sees what, without redeploying code.
Instead of merging a feature and praying it works, you:

Deploy the code behind a flag (disabled by default)
Enable it for 5% of users first
Watch for errors — gradually increase to 100%
If something breaks — disable in 1 click, no rollback needed

Feature                 Description
Percentage Rollouts   Roll out to 5% → 50% → 100% using deterministic user hashing — no flickering
Multi-Environment     Manage flags independently across development, staging, production
Analytics Dashboard   14-day bar chart of flag activity + API key lastUsed tracking
Audit Log             Every toggle, rollout change, flag deletion and member action is logged
Team Management       Invite members with OWNER / ADMIN / MEMBER / VIEWER roles
API Key Auth          Secure SDK endpoint with per-key usage tracking
SDK Endpoint          Single GET returns all flag states in <10ms
Flag Deletion         Safe delete with inline confirmation + audit trail

Tech Stack
Layer           Technology                 Why
Framework       Next.js 15 App Router     Full-stack, edge-ready
Language        TypeScript                Type safety end to end
Database        PostgreSQL via Neon       Serverless, free tier
ORM             Prisma                    Type-safe DB queries
Auth            JWT + bcrypt              Simple, no vendor lock-in
State           Zustand                   Lightweight client state
Charts          Recharts                  Analytics visualization
Styling         Tailwind CSS              Dark theme design system
Deploy          Vercel                    ero-config deployment

🚀 Getting Started
Prerequisites
Node.js 18+
A Neon account (free)

Local Development
bash# 1. Clone the repo
git clone https://github.com/Manoj-M19/flag-feature.git
cd flag-feature

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET

# 4. Run migrations
npx prisma migrate dev

# 5. Start dev server
npm run dev

Environment Variables
env# Get from neon.tech → your project → connection string
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your-64-char-hex-secret"

⚡ SDK Integration
Integrate feature flags into any project with a single fetch call:
GET /api/sdk/evaluate?projectId=YOUR_ID&environment=production&userId=user_123
x-api-key: YOUR_API_KEY

React Hook
import { useEffect, useState } from 'react'

export function useFlags(userId: string) {
  const [flags, setFlags] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(
      `https://flagfeature.vercel.app/api/sdk/evaluate?projectId=${process.env.NEXT_PUBLIC_PROJECT_ID}&environment=production&userId=${userId}`,
      { headers: { 'x-api-key': process.env.NEXT_PUBLIC_FLAG_API_KEY! } }
    )
      .then(r => r.json())
      .then(data => setFlags(data.flags ?? {}))
  }, [userId])

  return flags
}

// Usage — control any UI with a flag
const flags = useFlags(user.id)

if (flags.new_checkout) return <NewCheckout />
return <OldCheckout />

🔢 How Rollout Percentage Works
userId: "user_abc" + flagKey: "new_ui"
→ deterministic hash → 34

rollout 10%  →  34 < 10?  ❌  user does NOT see the feature
rollout 50%  →  34 < 50?  ✅  user sees the feature
rollout 100% →  34 < 100? ✅  everyone sees the feature

🌐 Deployment
Vercel + Neon (Free)

👨‍💻 Author
Manoj M

📄 License
MIT © Manoj M

<div align="center">
Built with ❤️ using Next.js, Prisma, and PostgreSQL
⭐ Star this repo if you found it useful!
</div>