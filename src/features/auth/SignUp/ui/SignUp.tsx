import { Controller, useForm } from "react-hook-form"
import { Text, TextInput, View, type TextInputProps } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button, Host } from "@expo/ui"
import { isAxiosError } from "axios"
import { Link } from "expo-router"

import { useSignUp } from "@/features/auth/SignUp/hooks"

import { SignUpSchema, SignUpSchemaType } from "@/features/auth/SignUp/types"

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message
    if (error.response?.status === 400 && message) {
      return Array.isArray(message) ? message.join("\n") : String(message)
    }
    if (!error.response) {
      return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
    }
  }
  return "회원가입에 실패했습니다. 이미 사용 중인 아이디나 이메일인지 확인해주세요."
}

type FieldProps = {
  error?: string
} & TextInputProps

const Field = ({ error, ...props }: FieldProps) => (
  <View className="w-72 gap-1">
    <TextInput
      className="rounded-md border border-gray-300 px-3 py-2"
      autoCapitalize="none"
      {...props}
    />
    {error ? <Text className="text-sm text-red-500">{error}</Text> : null}
  </View>
)

export const SignUp = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  })

  const { mutate: signUp, isPending, error } = useSignUp()

  const onSubmit = (data: SignUpSchemaType) => {
    const result = SignUpSchema.safeParse(data)

    if (!result.success) {
      const seen = new Set<keyof SignUpSchemaType>()
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignUpSchemaType
        if (!seen.has(field)) {
          seen.add(field)
          setError(field, { message: issue.message })
        }
      })
      return
    }

    const { name, email, password } = result.data
    signUp({ name, email, password })
  }

  return (
    <SafeAreaView className="flex min-h-screen flex-1 flex-col items-center justify-center">
      <View className="flex min-h-full flex-1 items-center justify-center gap-4">
        <Text className="text-xl font-bold">회원가입</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Field
              placeholder="아이디 (20자 이하)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Field
              placeholder="이메일"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Field
              placeholder="비밀번호"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="passwordConfirm"
          render={({ field: { onChange, onBlur, value } }) => (
            <Field
              placeholder="비밀번호 확인"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              error={errors.passwordConfirm?.message}
            />
          )}
        />

        {error ? (
          <Text className="w-72 text-center text-sm text-red-500">
            {getErrorMessage(error)}
          </Text>
        ) : null}

        <Host matchContents>
          <Button
            label={isPending ? "가입 중..." : "가입하기"}
            onPress={handleSubmit(onSubmit)}
          />
        </Host>

        <Link href="/login" replace>
          <Text className="text-sm text-gray-500">
            이미 계정이 있나요? <Text className="font-bold">로그인</Text>
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  )
}
