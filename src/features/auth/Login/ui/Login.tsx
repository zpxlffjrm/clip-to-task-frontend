import { Controller, useForm } from "react-hook-form"
import { Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button, Host } from "@expo/ui"
import { Link } from "expo-router"

import { useLogin } from "@/features/auth/Login/hooks"

import { LoginSchemaType } from "@/features/auth/Login/types"

export const Login = () => {
  const { control, handleSubmit } = useForm<LoginSchemaType>({
    defaultValues: {
      name: "",
      password: "",
    },
  })

  const { mutate: login } = useLogin()

  const onSubmit = (data: LoginSchemaType) => {
    login(data)
  }

  return (
    <SafeAreaView className="flex min-h-screen flex-1 flex-col items-center justify-center">
      <View className="flex min-h-full flex-1 items-center justify-center gap-4">
        <Text>Login</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="닉네임"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="비밀번호"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />

        <Host matchContents>
          <Button label="로그인" onPress={handleSubmit(onSubmit)} />
        </Host>

        <Link href="/signup" push>
          <Text className="text-sm text-gray-500">
            계정이 없나요? <Text className="font-bold">회원가입</Text>
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  )
}
