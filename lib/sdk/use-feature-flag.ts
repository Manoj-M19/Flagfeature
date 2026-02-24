import { useEffect, useState } from "react";
import type { FlagFeatureClient } from "./client";

export function useFeatureFlags(client:FlagFeatureClient) {
    const [flags,setFlags] = useState<Record<string,boolean>>({})
    const [loading,setLoading] = useState(true)

    useEffect(()=> {
        client.getAllFlags().then((f) => {
            setFlags(f)
            setLoading(false)
        })
    },[client])

    return {flags,loading,isEnabled:(key:string) => flags[key] || false}
}