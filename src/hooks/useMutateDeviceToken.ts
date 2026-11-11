import { useMutation } from "@tanstack/react-query"

import { updateDeviceToken } from "@/api/common"

type UpdateDeviceTokenParams = {
  id: string
  deviceToken: string
}

export const useMutateDeviceToken = () => {
  return useMutation({
    mutationFn: (payload: UpdateDeviceTokenParams) => {
      return updateDeviceToken(payload.id, payload.deviceToken)
    },
  })
}
