import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import * as SecureStore from "expo-secure-store"

import { DashboardActionItem } from "@/features/dashboard/types"

import {
  getDashboardActionItems,
  getRecentMeetings,
  updateActionItemCompletion,
} from "@/features/dashboard/api"

export const useGetRecentMeetings = () => {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    SecureStore.getItemAsync("userId").then((userId) => {
      setUserId(userId)
    })
  }, [])

  return useQuery({
    queryKey: ["dashboard", "recent-meetings"],
    queryFn: () => getRecentMeetings(userId as string),
    enabled: !!userId,
  })
}

export const useGetDashboardActionItems = () => {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    SecureStore.getItemAsync("userId").then((userId) => {
      setUserId(userId)
    })
  }, [])

  return useQuery({
    queryKey: ["dashboard", "action-items"],
    queryFn: () => getDashboardActionItems(userId as string),
    enabled: !!userId,
  })
}

const ACTION_ITEMS_QUERY_KEY = ["dashboard", "action-items"]

type UpdateActionItemCompletionPayload = {
  id: string
  isCompleted: boolean
}

export const useUpdateActionItemCompletion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isCompleted }: UpdateActionItemCompletionPayload) =>
      updateActionItemCompletion(id, isCompleted),

    // 체크 즉시 화면에 반영하고, 실패하면 이전 상태로 되돌린다.
    onMutate: async ({ id, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: ACTION_ITEMS_QUERY_KEY })
      const previous = queryClient.getQueryData<DashboardActionItem[]>(
        ACTION_ITEMS_QUERY_KEY,
      )
      queryClient.setQueryData<DashboardActionItem[]>(
        ACTION_ITEMS_QUERY_KEY,
        (items) =>
          items?.map((item) =>
            item.id === id ? { ...item, isCompleted } : item,
          ),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ACTION_ITEMS_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTION_ITEMS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ["meetings"] })
    },
  })
}
