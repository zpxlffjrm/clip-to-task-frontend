import { SignUpRequest, SignUpResponse } from "@/features/auth/SignUp/types"

import { apiClient } from "@/services/api"

export const signUp = async (data: SignUpRequest) => {
  const response = await apiClient.post<SignUpResponse>("/auth/sign-up", data)
  return response.data
}
