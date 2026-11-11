import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import * as SecureStore from "expo-secure-store"

import {
  getDashboardActionItems,
  getRecentMeetings,
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
