import { apiClient } from "@/services/api"

export const updateDeviceToken = async (id: string, deviceToken: string) => {
  console.log("updateDeviceToken", id, deviceToken)
  const response = await apiClient.put(`/users/${id}/device-token`, {
    id,
    deviceToken,
  })
  return response.data
}
