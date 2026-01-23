import type { NextRequest } from "next/server";
import { verifyToken } from "./auth";
import { prisma } from "./prisma";

export async function authenticateRequest(req:NextRequest) {
    const authHeader = req.headers.get('authorization')
    
    if(!authHeader || !authHeader.startsWith('Bearer')) {
       return {error:'Unauthorized',status:401}
    }
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if(!decoded) {
        return {error:'Invalid token',status:401}
    }

    const user = await prisma.user.findUnique({
        where:{ id:decoded.userId},
        select:{id:true,email:true,name:true,role:true},
    })

    if(!user) {
        return {error:'User not found',status:401}
    }

    return {user}
}