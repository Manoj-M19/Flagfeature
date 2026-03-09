import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth-middleware";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        key: true,
        createdAt: true,
        lastUsed: true,
      },
    });

    const maskedKeys = apiKeys.map((k) => ({
      ...k,
      key: `ff_${"*".repeat(56)}${k.key.slice(-4)}`,
    }));

    return NextResponse.json({ apiKeys: maskedKeys });
  } catch (error) {
    console.error("Get API keys error:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "API key name is required" },
        { status: 400 },
      );
    }

    // Generate random API key
    const key = `ff_${randomBytes(32).toString("hex")}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key,
        userId: auth.user.id,
      },
    });

    return NextResponse.json({ apiKey }, { status: 201 });
  } catch (error) {
    console.error("Create API key error:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 },
    );
  }
}
