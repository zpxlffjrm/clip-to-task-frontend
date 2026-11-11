import { useMutation } from "@tanstack/react-query"
import { Alert } from "react-native"

import * as SecureStore from "expo-secure-store"

import { LoginResponse } from "@/features/auth/Login/types"

import { login, refreshToken } from "@/features/auth/Login/api"

import { useAuth } from "@/hooks/AppInitializer"

export const useLogin = () => {
  const { signIn } = useAuth()

  return useMutation({
    mutationFn: async ({
      name,
      password,
    }: {
      name: string
      password: string
    }) => await login(name, password),
    onSuccess: async (
      data: LoginResponse,
      variables: { name: string; password: string },
    ) => {
      Alert.alert("로그인 성공", JSON.stringify(data))
      await SecureStore.setItemAsync("accessToken", data.accessToken)
      await SecureStore.setItemAsync("refreshToken", data.refreshToken)
      await SecureStore.setItemAsync("userId", variables.name)
      signIn()
    },
  })
}

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async () => {
      const token = await SecureStore.getItemAsync("refreshToken")
      if (!token) {
        throw new Error("Refresh token not found")
      }
      return await refreshToken(token)
    },
    onSuccess: async (data: LoginResponse) => {
      await SecureStore.setItemAsync("accessToken", data.accessToken)
      await SecureStore.setItemAsync("refreshToken", data.refreshToken)
    },
  })
}
