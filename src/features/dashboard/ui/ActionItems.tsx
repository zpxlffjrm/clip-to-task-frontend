import { ArrowRight, Circle } from "lucide-react-native"
import { useMemo } from "react"
import { Pressable, Text, View } from "react-native"

import { format } from "date-fns"

import { useGetDashboardActionItems } from "@/features/dashboard/hooks"

export const ActionItems = () => {
  const { data: actionItems } = useGetDashboardActionItems()

  const ActionItemsItem = useMemo(() => {
    return actionItems || []
  }, [actionItems])
  return (
    <View className="mb-5">
      <View className="mb-2.5 flex-row items-center justify-between">
        <Text className="text-sm font-bold text-slate-50">
          액션 아이템 ({ActionItemsItem.length})
        </Text>
        <Pressable className="flex-row items-center">
          <Text className="mr-0.5 text-xs font-medium text-indigo-400">
            전체보기
          </Text>
          <ArrowRight size={12} color="#818CF8" />
        </Pressable>
      </View>
      <View className="card-surface p-3">
        {ActionItemsItem.map((item) => (
          <Pressable
            className="flex-row items-center border-b border-slate-800/80 py-2"
            key={item.id}
          >
            <Circle size={16} color="#64748B" />
            <Text
              className="ml-2.5 flex-1 text-xs font-medium text-slate-200"
              numberOfLines={1}
            >
              {item.task}
            </Text>
            <Text className="ml-2 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] text-indigo-300">
              {item.deadline
                ? format(new Date(item.deadline), "yyyy-MM-dd")
                : "D-0"}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}
