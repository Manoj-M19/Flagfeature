import { authenticateRequest } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { success } from "zod";

export async function GET(req:NextRequest) {
  const auth = await authenticateRequest(req)
  if('error' in auth) {
    return NextResponse.json({ error:auth.error},{status:auth.status})
  }

  try {
    const apikeys = await prisma.apiKey.findMany({
      where:{userId:auth.user.id},
      orderBy:{ createdAt:'desc'},
      select:{
        id:true,
        name:true,
        key:true,
        createdAt:true,
        lastUsed:true,
      },
    })

    const maskedKeys = apikeys.map(k=> ({
      ...k,
      key:`ff_${'*'.repeat(56)}${k.key.slice(-4)}`
    }))

    return NextResponse.json({apikeys:maskedKeys})
  } catch (error) {
    console.error("Get API keys error:",error)
    return NextResponse.json(
      { error:"Failed to fetch API keys"},
      {status:500}
    );
  };
}

export async function POST(req:NextRequest) {
  const auth = await authenticateRequest(req)
  if('error' in auth ) {
    return NextResponse.json({error:auth.error},{status:auth.status})
  }

  try {
    const {name} = await req.json()

    if(!name) {
      return NextResponse.json(
        {error:"API key name is required"},
        {status:400}
      )
    }
    const key = `ff_${randomBytes(32).toString('hex')}`

    const apikey = await prisma.apiKey.create({
      data:{
        name,
        key,
        userId:auth.user.id,
      },
    })

    return NextResponse.json({apikey},{status:201})
  } catch (error) {
    console.error("Create API Key error:",error)
    return NextResponse.json(
      {error:"Failed to create API Key"},
      {status:500}
    )
  }
}

