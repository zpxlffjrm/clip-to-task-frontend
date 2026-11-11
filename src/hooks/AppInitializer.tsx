import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import * as Notifications from "expo-notifications"
import * as SecureStore from "expo-secure-store"

import { useMutateDeviceToken } from "@/hooks/useMutateDeviceToken"
import { setOnUnauthorized } from "@/services/api/apiClient"

type AuthContextValue = {
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
  signIn: () => {},
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

async function getAuthTokens() {
  const accessToken = await SecureStore.getItemAsync("accessToken")
  const refreshToken = await SecureStore.getItemAsync("refreshToken")
  const userId = await SecureStore.getItemAsync("userId")

  console.log({ accessToken, refreshToken, userId })
  return { accessToken, refreshToken, userId }
}

export default function AppInitializer({
  children,
}: {
  children: ReactNode
}): ReactNode {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const { mutate: updateDeviceToken } = useMutateDeviceToken()

  const getDeviceToken = async () => {
    const expoPushToken = await Notifications.getExpoPushTokenAsync()

    updateDeviceToken({
      id: userId || "",
      deviceToken: expoPushToken.data,
    })
  }

  useEffect(() => {
    let cancelled = false

    const fetchAuthTokens = async () => {
      try {
        const { accessToken, refreshToken, userId } = await getAuthTokens()
        if (!cancelled) {
          setIsAuthenticated(!!accessToken && !!refreshToken)
          setUserId(userId)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchAuthTokens()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setOnUnauthorized(() => {
      setIsAuthenticated(false)
      setUserId(null)
    })

    return () => {
      setOnUnauthorized(null)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      getDeviceToken()
    }
  }, [userId])

  const signIn = () => {
    setIsAuthenticated(true)
  }

  const signOut = async () => {
    await SecureStore.deleteItemAsync("accessToken")
    await SecureStore.deleteItemAsync("refreshToken")
    await SecureStore.deleteItemAsync("userId")
    setIsAuthenticated(false)
    setUserId(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
