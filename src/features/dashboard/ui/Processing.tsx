import { CheckCircle2 } from "lucide-react-native"
import { useCallback, useEffect, useState } from "react"
import { DimensionValue, Text, View } from "react-native"
import type { Socket } from "socket.io-client"

import queryClient from "@/services/api/queryClient"
import { useIo } from "@/services/socket"

export const DashboardProcessing = () => {
  const io = useIo()

  const [processing, setProcessing] = useState<{
    title: string
    step: string
    progress: string
  }>()

  useEffect(() => {
    let cancelled = false
    let socket: Socket | null = null
    const onProgress = (data: typeof processing) => setProcessing(data)

    io("/meeting-progress")
      .then((instance) => {
        if (cancelled) {
          instance?.disconnect()
          return
        }
        socket = instance
        socket?.on("meeting.progress", onProgress)
      })
      .catch((error) => {
        console.log("error", error)
      })

    return () => {
      cancelled = true
      socket?.off("meeting.progress", onProgress)
      socket?.disconnect()
    }
  }, [io])

  const Progress = useCallback(() => {
    const width = processing?.progress || "0%"
    return (
      <View
        className={`h-full rounded-full bg-amber-400`}
        style={{ width: width as DimensionValue }}
      />
    )
  }, [processing?.progress])

  useEffect(() => {
    if (processing?.progress === "100%") {
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      })
    }
  }, [processing?.progress])

  if (!processing) return null

  const isComplete =
    processing.progress === "100%" || processing.step === "100%"

  if (isComplete) {
    return (
      <View className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
        <View className="flex-row items-center">
          <CheckCircle2 size={18} color="#34D399" />
          <View className="ml-2.5 flex-1">
            <Text
              className="text-xs font-bold text-emerald-300"
              numberOfLines={1}
            >
              {processing.title}
            </Text>
            <Text className="mt-0.5 text-[11px] text-emerald-400/80">
              처리가 완료되었습니다
            </Text>
          </View>
          <Text className="font-mono text-xs font-bold text-emerald-400">
            완료
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
      <View className="mb-1.5 flex-row items-center justify-between">
        <View className="mr-2 flex-1 flex-row items-center">
          <View className="mr-2 h-2 w-2 rounded-full bg-amber-400" />
          <Text className="text-xs font-bold text-amber-300" numberOfLines={1}>
            {processing.title}
          </Text>
        </View>
        <Text className="font-mono text-xs font-bold text-amber-400">
          {processing.progress}
        </Text>
      </View>
      <Text className="mb-2 text-[11px] text-slate-400">{processing.step}</Text>
      <View className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <Progress />
      </View>
    </View>
  )
}
