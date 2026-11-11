import { Login } from "@/features/auth/Login"

/**
 * 로그인 화면 (라우팅 컨테이너)
 * Expo Router의 파일 기반 라우팅을 위한 컨테이너
 * 실제 비즈니스 로직은 src/features/auth/Login/ui/page/LoginScreen에 있음
 */
export default function LoginRoute() {
  return <Login />
}
