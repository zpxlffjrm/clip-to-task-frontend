import { useCallback, useEffect, useRef, useState } from "react"

import * as SecureStore from "expo-secure-store"
import { io as lookup, Socket } from "socket.io-client"

const SOCKET_PATH = "/socket.io"
const SOCKET_TRANSPORTS = ["websocket"] as const
const SOCKET_TIMEOUT_MS = 10000
const SOCKET_USER_CHANGE_DEBOUNCE_MS = 0

function disconnectSocket(socketRef: React.RefObject<Socket | null>) {
  if (socketRef.current) {
    socketRef.current.disconnect()
    socketRef.current = null
  }
}

function useIo() {
  const socketRef = useRef<Socket | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [queryParams, setQueryParams] = useState("")

  const token = SecureStore.getItemAsync("accessToken")

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    disconnectSocket(socketRef)
    setQueryParams("")

    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null
    }, SOCKET_USER_CHANGE_DEBOUNCE_MS)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      disconnectSocket(socketRef)
    }
  }, [token])

  const socket = useCallback(
    async (namespace: string) => {
      if (!token) return null

      console.log("token", await token)

      const url = `${process.env.EXPO_PUBLIC_SOCKET_HOST}${namespace}`

      const instance = lookup(url, {
        auth: {
          token: await token,
        },

        withCredentials: true,
      })

      socketRef.current = instance

      return instance
    },
    [token],
  )

  return socket
}

export { useIo }
