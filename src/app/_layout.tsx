import { QueryClientProvider } from "@tanstack/react-query"
import { useColorScheme } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router"
import * as SplashScreen from "expo-splash-screen"

import { AnimatedSplashOverlay } from "@/components/animated-icon"
import AppInitializer, { useAuth } from "@/hooks/AppInitializer"
import queryClient from "@/services/api/queryClient"

import Reactotron from "../../ReactotronConfig"

SplashScreen.preventAutoHideAsync()

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <AnimatedSplashOverlay />
  }

  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="meetings/[id]" />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  )
}

function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <AppInitializer>
            <RootNavigator />
          </AppInitializer>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Reactotron.overlay(RootLayout)
