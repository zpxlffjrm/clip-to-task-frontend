import { AxiosError } from "axios"

import { LoginResponse } from "@/features/auth/Login/types"

import { apiClient } from "@/services/api"

export const login = async (name: string, password: string) => {
  try {
    console.log("login", name, password)
    const response = await apiClient.post<Promise<LoginResponse>>(
      "/auth/sign-in",
      { name, password },
    )
    console.log("response", response.data)

    return response.data
  } catch (error) {
    console.log((error as Error).stack)
    console.log((error as AxiosError).status)
    throw error
  }
}

export const logout = async () => {
  const response = await apiClient.post("/auth/sign-out")
  return response.data
}

export const refreshToken = async (token: string) => {
  const response = await apiClient.post("/auth/sign-in/refresh", {
    refreshToken: token,
  })
  return response.data
}
