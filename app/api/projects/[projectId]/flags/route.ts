import { authenticateRequest } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function POST (req:NextRequest,
    {params}:{params:{ projectId:string}}
) {
    const auth  = await authenticateRequest(req) 
    if('error' in auth ) {
        return NextResponse.json({ error:auth.error},{status:auth.status})
    }

    try {
        const {key,name,description} = await req.json()

        if(!key || !name) {
            return NextResponse.json (
                {error:'Key and name are required'},
                {status :400}
            )
        }
       
        const projectMember = await prisma.projectMember.findFirst({
            where:{
                projectId:params.projectId,
                userId:auth.user.id,
            },
        })

        if(!projectMember) {
            return NextResponse.json(
                {error:'Project not found'},
                {status:404}
            )
        }

        const environments = await prisma.environment.findMany({
            where:{ projectId:params.projectId},
        })

        const flag = await prisma.flag.create({
            data:{
                key,
                name,
                description,
                projectId:params.projectId,
                createdBy:auth.user.id,
                states:{
                    create:environments.map((env)=> ({
                        environmentId:env.id,
                        enabled:false,
                    })),
                },
            },
            include:{
                states:{
                    include:{
                        environment:true,
                    },
                },
            },
        })

        return NextResponse.json ({flag},{status:201})
    } catch (error:any) {
        console.error("Create flag error:",error)

        if(error.code === 'P2002') {
            return NextResponse.json(
                {error:'Flag key already exists in this project'},
                {status:400}
            )
        }

        return NextResponse.json(
            {error:'Failed to create flag'},
            {status:500}
        )
    }
}