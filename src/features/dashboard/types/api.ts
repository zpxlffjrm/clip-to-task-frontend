export type DashboardRecentMeetingItem = {
  id: string // RDB PK
  title: string
  status: string
  duration: number
  createdAt: string
  actionItemCounts: number
  participants: string[]
}

export type DashboardActionItem = {
  id: string
  meetingRecordId: string
  userId: string
  assignee?: string
  task: string
  deadline?: string
  isCompleted: boolean
  createdAt: string
}
