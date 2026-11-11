import z from "zod"

// 백엔드 CreateUserDto와 같은 규칙
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

export type SignUpRequest = {
  name: string
  email: string
  password: string
}

export type SignUpResponse = {
  accessToken: string
  refreshToken: string
  shouldChangePassword: boolean
}

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "아이디를 입력해주세요.")
      .max(20, "아이디는 20자 이하여야 합니다."),
    email: z.email("올바른 이메일 주소를 입력해주세요."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        passwordRegex,
        "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.",
      ),
    passwordConfirm: z.string().min(1, "비밀번호를 한 번 더 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  })

export type SignUpSchemaType = z.infer<typeof SignUpSchema>
