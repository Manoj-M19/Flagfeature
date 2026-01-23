"use client"

import { useAuthStore } from "@/lib/store/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
    children,
}:{
    children:React.ReactNode
}) {
    const router = useRouter()
    const {user,logout,isAuthenticated} = useAuthStore()

    useEffect(()=> {
        if(!isAuthenticated) {
            router.push('/login')
        }
    },[isAuthenticated,router])

    if(!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-indigo-600">FlagFeature</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">{user?.email}</span>
                            <button
                            onClick={() => {
                                logout()
                                router.push('/login')
                            }}
                            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    )
}