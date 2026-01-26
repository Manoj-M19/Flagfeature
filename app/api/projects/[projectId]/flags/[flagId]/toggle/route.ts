import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth-middleware'
import { emitFlagToggle } from '@/lib/socket-server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string; flagId: string } }
) {
  const auth = await authenticateRequest(req)
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { environmentId, enabled } = await req.json()

    if (!environmentId || typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Environment ID and enabled status required' },
        { status: 400 }
      )
    }

    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: params.projectId,
        userId: auth.user.id,
      },
    })

    if (!projectMember) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await prisma.flagState.updateMany({
      where: {
        flagId: params.flagId,
        environmentId,
      },
      data: {
        enabled,
      },
    })

    const flag = await prisma.flag.findUnique({
      where: { id: params.flagId },
      include: {
        states: {
          include: {
            environment: true,
          },
        },
      },
    })

    emitFlagToggle(params.projectId, flag)

    return NextResponse.json({ flag })
  } catch (error) {
    console.error('Toggle flag error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle flag' },
      { status: 500 }
    )
  }
}