import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const since = new Date();
    since.setDate(since.getDate() - 14);

    const memberProjects = await prisma.projectMember.findMany({
      where: { userId: auth.user.id },
      select: { projectId: true },
    });
    const projectIds = memberProjects.map((m) => m.projectId);

    const toggleLogs = await prisma.auditLog.findMany({
      where: {
        projectId: { in: projectIds },
        action: { in: ["FLAG_TOGGLED", "FLAG_CREATED", "ROLLOUT_UPDATED"] },
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, action: true },
    });

    // Pre-fill 14 days so chart has no gaps
    const dayMap: Record<string, { toggles: number; created: number; rollouts: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dayMap[key] = { toggles: 0, created: 0, rollouts: 0 };
    }

    for (const log of toggleLogs) {
      const key = log.createdAt.toISOString().split("T")[0];
      if (!dayMap[key]) continue;
      if (log.action === "FLAG_TOGGLED")    dayMap[key].toggles++;
      if (log.action === "FLAG_CREATED")    dayMap[key].created++;
      if (log.action === "ROLLOUT_UPDATED") dayMap[key].rollouts++;
    }

    const chartData = Object.entries(dayMap).map(([date, counts]) => ({
      date,
      label: new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ...counts,
    }));

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: auth.user.id },
      select: { id: true, name: true, lastUsed: true, createdAt: true },
      orderBy: { lastUsed: { sort: "desc", nulls: "last" } },
    });

    const totalActivity = toggleLogs.length;
    const totalToggles  = toggleLogs.filter((l) => l.action === "FLAG_TOGGLED").length;

    return NextResponse.json({ chartData, apiKeys, totalActivity, totalToggles });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}