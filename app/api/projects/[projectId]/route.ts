import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-middleware";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { projectId } = await params;

  try {
    console.log("GET /api/projects/[projectId] - Fetching project:", projectId);

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId: auth.user.id,
          },
        },
      },
      include: {
        environments: {
          orderBy: { name: "asc" },
        },
        flags: {
          include: {
            states: {
              include: {
                environment: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!project) {
      console.log("GET /api/projects/[projectId] - Project not found");
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log(
      "GET /api/projects/[projectId] - Success, flags:",
      project.flags.length,
    );
    return NextResponse.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}
