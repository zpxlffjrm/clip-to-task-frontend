import { Clock, Sparkles } from "lucide-react-native"
import { Pressable, Text, View } from "react-native"

import { format } from "date-fns"
import { useRouter } from "expo-router"

import { parseSeconds } from "@/utils"

type MeetingCardProps = {
  title: string
  status: string
  duration: number
  createdAt: string
  actionItemCount: number
  participantNames: string[]
  id: string
}

export const MeetingCard = ({
  title,
  status,
  duration,
  createdAt,
  actionItemCount,
  participantNames,
  id,
}: MeetingCardProps) => {
  const router = useRouter()
  const handlePress = () => {
    router.push({ pathname: "/meetings/[id]", params: { id } })
  }
  return (
    <Pressable
      className="card-surface mb-3 p-4 active:opacity-80"
      onPress={handlePress}
    >
      <View className="mb-2 flex-row items-start justify-between">
        <Text
          className="mr-2 flex-1 text-base font-bold text-slate-50"
          numberOfLines={1}
        >
          {title}
        </Text>
        <View className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5">
          <Text className="text-xs font-semibold text-emerald-400">
            {status}
          </Text>
        </View>
      </View>

      <View className="my-1.5 flex-row items-center">
        <View className="mr-4 flex-row items-center">
          <Clock size={13} color="#94A3B8" />
          <Text className="ml-1 text-xs text-slate-400">
            {parseSeconds(duration)}
          </Text>
        </View>
        <View className="flex-row items-center">
          {participantNames.map((name, idx) => (
            <View
              key={idx}
              className="-ml-1 h-5 w-5 items-center justify-center rounded-full border border-slate-700 bg-slate-800"
            >
              <Text className="text-[9px] font-bold text-slate-300">
                {name?.slice?.(0, 1)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-2 flex-row items-center justify-between border-t border-slate-800/80 pt-2">
        <View className="flex-row items-center rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-1">
          <Sparkles size={12} color="#818CF8" />
          <Text className="ml-1.5 text-xs font-medium text-indigo-300">
            {actionItemCount}개 추출됨
          </Text>
        </View>
        <Text className="text-[11px] text-slate-500">
          {format(new Date(createdAt), "yyyy-MM-dd")}
        </Text>
      </View>
    </Pressable>
  )
}
