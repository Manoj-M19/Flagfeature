import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This ensures a user consistently gets the same flag value across requests
function hashUserFlag(userId: string, flagKey: string): number {
  const str = `${userId}:${flagKey}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash 
  }
  return Math.abs(hash) % 100
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");
  const environment = searchParams.get("environment");
  const userId = searchParams.get("userId"); 

  if (!projectId || !environment) {
    return NextResponse.json(
      { error: "projectId and environment are required" },
      { status: 400 }
    );
  }

  try {
    const validKey = await prisma.apiKey.findUnique({
      where: { key: apiKey },
    });

    if (!validKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Update lastUsed for analytics
    await prisma.apiKey.update({
      where: { id: validKey.id },
      data: { lastUsed: new Date() },
    });

    const flags = await prisma.flag.findMany({
      where: { projectId },
      include: {
        states: {
          where: {
            environment: {
              name: environment,
              projectId,
            },
          },
        },
      },
    });

    const flagStates = flags.reduce(
      (acc, flag) => {
        const state = flag.states[0]

        // Flag is off entirely
        if (!state || !state.enabled) {
          acc[flag.key] = false
          return acc
        }

        const rollout = (state as any).rolloutPercentage ?? 100

        // 100% rollout — everyone gets it
        if (rollout >= 100) {
          acc[flag.key] = true
          return acc
        }

        // 0% rollout — nobody gets it
        if (rollout <= 0) {
          acc[flag.key] = false
          return acc
        }

        // Partial rollout
        if (userId) {
          // Deterministic: same user always gets same result for this flag
          const userHash = hashUserFlag(userId, flag.key)
          acc[flag.key] = userHash < rollout
        } else {
          // No userId provided — use random (not sticky across requests)
          acc[flag.key] = Math.random() * 100 < rollout
        }

        return acc
      },
      {} as Record<string, boolean>
    );

    const response = NextResponse.json({ flags: flagStates });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "x-api-key, Content-Type");
    return response;

  } catch (error) {
    console.error("Flag evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate flags" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "x-api-key, Content-Type");
  return response;
}