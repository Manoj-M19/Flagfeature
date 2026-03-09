import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-middleware";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; flagId: string }> }
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { projectId, flagId } = await params;
  try {
    const { environmentId, enabled, rolloutPercentage } = await req.json();
    if (!environmentId) {
      return NextResponse.json({ error: "environmentId is required" }, { status: 400 });
    }
    if (typeof enabled !== "boolean" && typeof rolloutPercentage !== "number") {
      return NextResponse.json({ error: "enabled or rolloutPercentage required" }, { status: 400 });
    }
    const projectMember = await prisma.projectMember.findFirst({
      where: { projectId, userId: auth.user.id },
    });
    if (!projectMember) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (typeof enabled === "boolean") updateData.enabled = enabled;
    if (typeof rolloutPercentage === "number") {
      if (rolloutPercentage < 0 || rolloutPercentage > 100) {
        return NextResponse.json({ error: "rolloutPercentage must be between 0 and 100" }, { status: 400 });
      }
      updateData.rolloutPercentage = rolloutPercentage;
    }

    const environment = await prisma.environment.findUnique({
      where: { id: environmentId },
      select: { name: true },
    });

    const flag = await prisma.flag.findUnique({
      where: { id: flagId },
      select: { name: true, key: true },
    });

    await prisma.flagState.updateMany({
      where: { flagId, environmentId },
      data: updateData,
    });

    const action = typeof enabled === "boolean" ? "FLAG_TOGGLED" : "ROLLOUT_UPDATED";
    const details: any = { environment: environment?.name, flagName: flag?.name, flagKey: flag?.key };
    if (typeof enabled === "boolean") { details.from = !enabled; details.to = enabled; }
    if (typeof rolloutPercentage === "number") { details.rolloutPercentage = rolloutPercentage; }

    await prisma.auditLog.create({
      data: { projectId, userId: auth.user.id, flagId, action, details },
    });

    const updatedFlag = await prisma.flag.findUnique({
      where: { id: flagId },
      include: { states: { include: { environment: true } } },
    });

    return NextResponse.json({ flag: updatedFlag });
  } catch (error) {
    console.error("Toggle flag error:", error);
    return NextResponse.json({ error: "Failed to toggle flag" }, { status: 500 });
  }
}