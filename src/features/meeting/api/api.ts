import { File } from "expo-file-system"

import {
  CreateMeetingResponse,
  MeetingItem,
  UploadableFile,
} from "@/features/meeting/types"

import { apiClient } from "@/services/api"

export const uploadFile = async (
  file: UploadableFile,
  url: string,
  onProgress: (percent: number) => void,
) => {
  const fileRef = new File(file.uri)

  const response = await fileRef.upload(url, {
    httpMethod: "PUT",
    headers: {
      "Content-Type": file.type,
    },

    onProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.bytesSent * 100) / (progressEvent.totalBytes ?? 1),
      )
      onProgress(percent)
    },
  })

  return response.body
}

export const createMeeting = async (
  userId: string,
  fileName: string,
  fileType: string,
): Promise<CreateMeetingResponse> => {
  const response = await apiClient.post("/meetings", {
    userId,
    fileName,
    fileType,
  })

  return response.data
}

export const getMeetings = async (
  page?: number,
  limit?: number,
): Promise<MeetingItem[]> => {
  try {
    const response = await apiClient.get(
      `/meetings?page=${page}&limit=${limit}`,
    )

    return response.data
  } catch (error) {
    console.log("error", error)
    throw error
  }
}

export const getMeetingById = async (id: string): Promise<MeetingItem> => {
  const response = await apiClient.get(`/meetings/${id}`)
  return response.data
}
