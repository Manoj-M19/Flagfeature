import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");
  const environment = searchParams.get("environment");

  if (!projectId || !environment) {
    return NextResponse.json(
      { error: "projectId and environment are required" },
      { status: 400 },
    );
  }

  try {
    const validKey = await prisma.apiKey.findUnique({
      where: { key: apiKey },
    });

    if (!validKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

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
        acc[flag.key] = flag.states[0]?.enabled || false;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  } catch (error) {
    console.error("Flag evaluation error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate flags" },
      { status: 500 },
    );
  }
}
