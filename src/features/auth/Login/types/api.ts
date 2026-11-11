import z from "zod";

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/);

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

const LoginSchema = z.object({
  name: z.string().min(1,"닉네임을 입력해주세요."),
  password: z.string().min(8,"비밀번호는 8자 이상이어야 합니다.")
  .regex(passwordRegex,"비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다."),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;