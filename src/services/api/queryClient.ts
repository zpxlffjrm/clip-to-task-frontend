// import NetInfo from "@react-native-community/netinfo"
import { QueryClient } from "@tanstack/react-query"

// import { ApiError } from "@/shared/api"

// import { i18n } from "@/shared/services"

// import { useAuthStore, useGlobalStore } from "@/shared/stores"

// import { API_RULES, API_RULES_MESSAGE } from "@/shared/constants/apiRules"

const isTestEnv = typeof process !== "undefined" && !!process.env.JEST_WORKER_ID

// 1. 온라인 상태 감지 로직 커스텀 설정
// onlineManager.setEventListener((setOnline) => {
//   return NetInfo.addEventListener((state) => {
//     /*
//        isConnected: 망 연결 여부 (Wi-Fi, LTE 등)
//        isInternetReachable: 실제 인터넷 통신 가능 여부 (핑 체크 결과와 유사)
//     */
//     const isNetworkActive = !!state.isConnected && !!state.isInternetReachable

//     // React Query에게 현재 상태 전달
//     setOnline(isNetworkActive)
//   })
// })

const queryClient = isTestEnv
  ? new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  : new QueryClient({
      // defaultOptions: {
      //   queries: {
      //     refetchOnWindowFocus: false,
      //     retry: false,
      //     staleTime: 5000,
      //     refetchOnMount: true,
      //     refetchOnReconnect: true,
      //   },
      //   mutations: {
      //     retry: false,
      //   },
      // },
      // 401 토큰 재발급/재시도/로그아웃은 apiClient 응답 인터셉터에서 처리
    })

export default queryClient
