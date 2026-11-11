import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

type QueueItem = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: QueueItem[] = []
let onUnauthorized: (() => void) | null = null

export function setOnUnauthorized(callback: (() => void) | null) {
  onUnauthorized = callback
}

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
      return
    }

    if (token) {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

async function clearAuthAndRedirect() {
  await SecureStore.deleteItemAsync("accessToken")
  await SecureStore.deleteItemAsync("refreshToken")
  await SecureStore.deleteItemAsync("userId")
  onUnauthorized?.()
  router.replace("/(auth)/login")
}

async function reissueAccessToken() {
  const storedRefreshToken = await SecureStore.getItemAsync("refreshToken")

  if (!storedRefreshToken) {
    throw new Error("Refresh token not found")
  }

  const { data } = await axios.post<{
    accessToken: string
    refreshToken: string
  }>(
    `${process.env.EXPO_PUBLIC_API_HOST?.toString()}/auth/sign-in/refresh`,
    { refreshToken: storedRefreshToken },
    { timeout: 10000 },
  )

  await SecureStore.setItemAsync("accessToken", data.accessToken)
  await SecureStore.setItemAsync("refreshToken", data.refreshToken)

  return data.accessToken
}

function shouldSkipTokenRefresh(url?: string) {
  if (!url) {
    return false
  }

  return (
    url.endsWith("/auth/sign-in") ||
    url.includes("/auth/sign-out") ||
    url.includes("/auth/sign-in/refresh")
  )
}

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_HOST?.toString(),
  timeout: 10000,
})

apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken")

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  async (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (res) => {
    const { config } = res

    if (config.responseType === "stream") {
      return res
    }

    return res
  },
  async (err: AxiosError) => {
    const originalRequest = err.config as RetryableRequestConfig | undefined
    const status = err.response?.status

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(err)
    }

    if (shouldSkipTokenRefresh(originalRequest.url)) {
      if (originalRequest.url?.includes("/auth/sign-in/refresh")) {
        await clearAuthAndRedirect()
      }
      return Promise.reject(err)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const newAccessToken = await reissueAccessToken()
      processQueue(null, newAccessToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      await clearAuthAndRedirect()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export { apiClient }
