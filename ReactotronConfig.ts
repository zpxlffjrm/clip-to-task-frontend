import ReactotronReactNative from "reactotron-react-native"
import {
  QueryClientManager,
  reactotronReactQuery,
} from "reactotron-react-query"

import queryClient from "@/services/api/queryClient"

const queryClientManager = new QueryClientManager({ queryClient })

// 기본값으로 빈 객체나 기본 인스턴스를 설정하여 에러 방지
let Reactotron = ReactotronReactNative

if (__DEV__) {
  // Native 환경 설정
  Reactotron.configure({
    name: "clip-to-task",
    host: process.env.EXPO_PUBLIC_REACTOTRON_HOST || "localhost",
  })
    .useReactNative({
      overlay: true, // 오버레이 기능 활성화
      asyncStorage: true,
      networking: true,
    })
    .use(reactotronReactQuery(queryClientManager))

    .connect()
}

export default Reactotron
