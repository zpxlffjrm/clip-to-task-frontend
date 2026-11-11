import { ArrowRight } from "lucide-react-native"
import { useMemo } from "react"
import { Pressable, Text, View } from "react-native"

import { useGetRecentMeetings } from "@/features/dashboard/hooks"

import { MeetingCard } from "@/features/meeting/ui/MeetingCard"

export const RecentMeeting = () => {
  const { data: recentMeetings } = useGetRecentMeetings()

  const RecentMeetingItem = useMemo(() => {
    return recentMeetings || []
  }, [recentMeetings])

  return (
    <View className="mb-8">
      <View className="mb-2.5 flex-row items-center justify-between">
        <Text className="text-sm font-bold text-slate-50">최근 회의록</Text>
        <Pressable className="flex-row items-center">
          <Text className="mr-0.5 text-xs font-medium text-indigo-400">
            전체보기
          </Text>
          <ArrowRight size={12} color="#818CF8" />
        </Pressable>
      </View>

      {RecentMeetingItem.map((item) => (
        <MeetingCard
          key={item.id}
          id={item.id}
          title={item.title}
          status={item.status}
          duration={item.duration}
          createdAt={item.createdAt}
          actionItemCount={item.actionItemCounts}
          participantNames={item.participants}
        />
      ))}
    </View>
  )
}
