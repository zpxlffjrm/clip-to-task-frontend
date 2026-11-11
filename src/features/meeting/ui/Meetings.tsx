import { FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useGetMeetings } from "@/features/meeting/hooks"

import { MeetingCard } from "@/features/meeting/ui/MeetingCard"

import { ThemedView } from "@/components/themed-view"

export default function Meetings() {
  const { data, fetchNextPage, hasNextPage } = useGetMeetings()

  return (
    <ThemedView className="bg-background flex-1 flex-row  justify-center">
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
        <FlatList
          data={data?.pages.flatMap((page) => page)}
          renderItem={({ item }) => (
            <MeetingCard
              key={item.id}
              id={item.id}
              title={item.title}
              status={item.status}
              duration={item.duration}
              createdAt={item.createdAt}
              actionItemCount={item.actionItems.length}
              participantNames={item.participants.map(
                (participant) => participant.name,
              )}
            />
          )}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage()
            }
          }}
        />
      </SafeAreaView>
    </ThemedView>
  )
}
