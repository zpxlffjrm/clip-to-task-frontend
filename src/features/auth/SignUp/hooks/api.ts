import { useMutation } from "@tanstack/react-query"

import * as SecureStore from "expo-secure-store"

import { SignUpRequest, SignUpResponse } from "@/features/auth/SignUp/types"

import { signUp } from "@/features/auth/SignUp/api"

import { useAuth } from "@/hooks/AppInitializer"

export const useSignUp = () => {
  const { signIn } = useAuth()

  return useMutation({
    mutationFn: (data: SignUpRequest) => signUp(data),
    onSuccess: async (data: SignUpResponse, variables: SignUpRequest) => {
      // 가입 응답에 토큰이 포함되므로 바로 로그인 상태로 전환
      await SecureStore.setItemAsync("accessToken", data.accessToken)
      await SecureStore.setItemAsync("refreshToken", data.refreshToken)
      await SecureStore.setItemAsync("userId", variables.name)
      signIn()
    },
  })
}
