import {
  DashboardActionItem,
  DashboardRecentMeetingItem,
} from "@/features/dashboard/types"

import { apiClient } from "@/services/api"

export const getRecentMeetings = async (
  userId: string,
): Promise<DashboardRecentMeetingItem[]> => {
  const response = await apiClient.post("/dashboard/recent-meetings", {
    userId,
  })
  return response.data
}

export const getDashboardActionItems = async (
  userId: string,
): Promise<DashboardActionItem[]> => {
  const response = await apiClient.post("/dashboard/action-items", {
    userId,
  })
  return response.data
}

export const updateActionItemCompletion = async (
  id: string,
  isCompleted: boolean,
): Promise<DashboardActionItem> => {
  const response = await apiClient.patch(`/action-items/${id}/completion`, {
    isCompleted,
  })
  return response.data
}
