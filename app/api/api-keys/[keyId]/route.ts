import { authenticateRequest } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";
import { parseEnv } from "util";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ keyId: string }> },
) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { keyId } = await params;

  try {
    const apikey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: auth.user.id,
      },
    });

    if (!apikey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    await prisma.apiKey.delete({
      where: { id: keyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete API key error:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 },
    );
  }
}
