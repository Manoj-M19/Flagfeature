import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-middleware";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { projectId } = await params;
  try {
    const { key, name, description } = await req.json();
    if (!key || !name) {
      return NextResponse.json(
        { error: "Key and name are required" },
        { status: 400 },
      );
    }
    const projectMember = await prisma.projectMember.findFirst({
      where: { projectId, userId: auth.user.id },
    });
    if (!projectMember) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    const environments = await prisma.environment.findMany({
      where: { projectId },
    });
    const flag = await prisma.flag.create({
      data: {
        key,
        name,
        description,
        projectId,
        createdBy: auth.user.id,
        states: {
          create: environments.map((env) => ({
            environmentId: env.id,
            enabled: false,
          })),
        },
      },
      include: {
        states: { include: { environment: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        projectId,
        userId: auth.user.id,
        flagId: flag.id,
        action: "FLAG_CREATED",
        details: { flagName: name, flagKey: key },
      },
    });

    return NextResponse.json({ flag }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Flag key already exists in this project" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create flag" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: "auth.error" }, { status: auth.status });
  }

  const { projectId } = await params;

  try {
    const { flagId } = await req.json();

    if (!flagId) {
      return NextResponse.json(
        { error: "flagIs is required" },
        { status: 400 },
      );
    }

    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId: auth.user.id },
    });

    if (!member || !["OWNER", "ADMIN"].includes(member.role)) {
      return NextResponse.json(
        { error: "Not authorized to delete flags" },
        { status: 403 },
      );
    }
    await prisma.flag.delete({ where: { id: flagId } });

    await prisma.auditLog.create({
      data: {
        projectId,
        userId: auth.user.id,
        flagId,
        action: "FLAG_DELETED",
        details: {},
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete flag" },
      { status: 500 },
    );
  }
}
