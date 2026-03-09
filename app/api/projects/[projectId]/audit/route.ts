import { authenticateRequest } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
    req:NextRequest,
    {params}:{params:Promise<{projectId:string}>}
) {
   const auth = await  authenticateRequest(req);
   if("error" in auth) {
    return NextResponse.json({ error:auth.error},{status:auth.status});
   }
   const {projectId} = await params;
   try {
    const member = await prisma.projectMember.findFirst({
        where:{projectId,userId:auth.user.id},
    });
    if(!member) {
        return NextResponse.json({error:"Project not found"},{status:404});
    }
    const logs = await prisma.auditLog.findMany({
        where:{projectId},
        orderBy:{createdAt:"desc"},
        take:50,
        include:{
            user:{select:{id:true,name:true,email:true}},
        },
    });
    return NextResponse.json({logs});
   } catch (error) {
    return NextResponse.json({ error:"Failed to fetch audit logs"},{status:500});
   }
}