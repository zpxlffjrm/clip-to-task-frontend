import { useEffect } from "react"
import { Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useLocalSearchParams } from "expo-router"

import { useGetMeetingById } from "@/features/meeting/hooks"

import { ThemedView } from "@/components/themed-view"

export default function MeetingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { data } = useGetMeetingById(id)

  useEffect(() => {
    if (data) {
      console.log(data)
    }
  }, [data])

  return (
    <ThemedView className="bg-background flex-1">
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text className="text-slate-50">회의 상세: {id}</Text>
      </SafeAreaView>
    </ThemedView>
  )
}
