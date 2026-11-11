import { useCallback, useEffect, useRef } from "react"

import * as SecureStore from "expo-secure-store"
import { io as lookup, Socket } from "socket.io-client"

const ACCESS_TOKEN_KEY = "accessToken"

function disconnectSocket(socketRef: React.RefObject<Socket | null>) {
  if (socketRef.current) {
    socketRef.current.disconnect()
    socketRef.current = null
  }
}

function useIo() {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    return () => {
      disconnectSocket(socketRef)
    }
  }, [])

  // Stable across renders so callers' effects don't re-run (and reconnect)
  // every time the component re-renders.
  const socket = useCallback(async (namespace: string) => {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
    if (!token) return null

    disconnectSocket(socketRef)

    const url = `${process.env.EXPO_PUBLIC_SOCKET_HOST}${namespace}`

    const instance = lookup(url, {
      // Read the token on every (re)connect so a refreshed token is used.
      auth: (cb) => {
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
          .then((latest) => cb({ token: latest ?? token }))
          .catch(() => cb({ token }))
      },
      withCredentials: true,
    })

    socketRef.current = instance

    return instance
  }, [])

  return socket
}

export { useIo }
