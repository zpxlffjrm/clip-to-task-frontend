import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"

import {
  CreateMeetingPayload,
  UploadFileParams,
} from "@/features/meeting/types"

import {
  createMeeting,
  getMeetingById,
  getMeetings,
  uploadFile,
} from "@/features/meeting/api"

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (payload: UploadFileParams) => {
      return uploadFile(payload.file, payload.url, payload.onProgress)
    },
  })
}

export const useCreateMeeting = () => {
  return useMutation({
    mutationFn: (payload: CreateMeetingPayload) => {
      return createMeeting(payload.userId, payload.fileName, payload.fileType)
    },
  })
}

export const useGetMeetings = () => {
  return useInfiniteQuery({
    queryKey: ["meetings"],
    queryFn: ({ pageParam = 1 }) => getMeetings(pageParam, 10),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length > 0 ? pages.length + 1 : undefined,
    initialPageParam: 1,
  })
}

export const useGetMeetingById = (id: string) => {
  return useQuery({
    queryKey: ["meeting", id],
    queryFn: () => getMeetingById(id),
    enabled: !!id,
  })
}
