import { authenticateRequest } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { projectId } = await params;
  try {
    const { email, role } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const requestMember = await prisma.projectMember.findFirst({
      where: { projectId, userId: auth.user.id },
    });
    if (!requestMember || !["OWNER", "ADMIN"].includes(requestMember.role)) {
      return NextResponse.json({ error: "Not authorized to invite members" }, { status: 403 });
    }
    const userToInvite = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });
    if (!userToInvite) {
      return NextResponse.json({ error: "No user found with that email address" }, { status: 404 });
    }
    const existing = await prisma.projectMember.findFirst({
      where: { projectId, userId: userToInvite.id },
    });
    if (existing) {
      return NextResponse.json({ error: "User is already a member of this project" }, { status: 400 });
    }
    const member = await prisma.projectMember.create({
      data: { projectId, userId: userToInvite.id, role: role ?? "MEMBER" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    await prisma.auditLog.create({
      data: {
        projectId,
        userId: auth.user.id,
        action: "MEMBER_INVITED",
        details: { invitedEmail: email, role: role ?? "MEMBER" },
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to invite member" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { projectId } = await params;
  try {
    const { memberId } = await req.json();
    if (!memberId) {
      return NextResponse.json({ error: "memberId is required" }, { status: 400 });
    }
    const requesterMember = await prisma.projectMember.findFirst({
      where: { projectId, userId: auth.user.id },
    });
    if (!requesterMember || !["OWNER", "ADMIN"].includes(requesterMember.role)) {
      return NextResponse.json({ error: "Not authorized to remove members" }, { status: 403 });
    }
    const memberToRemove = await prisma.projectMember.findUnique({
      where: { id: memberId },
      include: { user: { select: { email: true } } },
    });
    if (!memberToRemove) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }
    if (memberToRemove.role === "OWNER") {
      return NextResponse.json({ error: "Cannot remove the project owner" }, { status: 400 });
    }
    await prisma.projectMember.delete({ where: { id: memberId } });

    await prisma.auditLog.create({
      data: {
        projectId,
        userId: auth.user.id,
        action: "MEMBER_REMOVED",
        details: { removedEmail: memberToRemove.user.email },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}