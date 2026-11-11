export type UploadableFile = {
  uri: string
  name: string
  type: string
}

export type UploadFileParams = {
  file: UploadableFile
  url: string
  onProgress: (percent: number) => void
}

export type CreateMeetingPayload = {
  userId: string
  fileName: string
  fileType: string
}

export type CreateMeetingResponse = {
  uploadUrl: string
}

export type MeetingItem = {
  id: string // RDB PK
  title: string
  status: string
  duration: number
  createdAt: string
  actionItems: ActionItem[]
  participants: MeetingParticipant[]
  summary: string[]
  timeline: MeetingTimelineItem[]
  speakerMapping: Record<string, string>
}

export type ActionItem = {
  id: string
  meetingRecordId: string
  userId: string
  assignee?: string
  task: string
  deadline?: string
  isCompleted: boolean
  createdAt: string
}

export type MeetingTimelineItem = {
  startTime: string
  endTime: string
  speaker: string
  text: string
}

export type MeetingListItem = {
  id: string // RDB PK
  title: string
  status: string
  duration: number
  createdAt: string
  actionItemCounts: number
  participants: string[]
}

export type MeetingParticipant = {
  id: string
  name: string
  speakerLabel: string
}
