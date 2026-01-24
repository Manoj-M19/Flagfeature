import { authenticateRequest } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: params.projectId,
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
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}
