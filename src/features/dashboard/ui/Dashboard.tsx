import { Mic, Upload, Zap } from "lucide-react-native"
import { useState } from "react"
import {
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import * as DocumentPicker from "expo-document-picker"
import * as SecureStore from "expo-secure-store"

import { ActionItems } from "@/features/dashboard/ui/ActionItems"
import { DashboardProcessing } from "@/features/dashboard/ui/Processing"
import { RecentMeeting } from "@/features/dashboard/ui/RecentMeeting"

import { useCreateMeeting, useUploadFile } from "@/features/meeting/hooks"

import { ThemedView } from "@/components/themed-view"

type UploadPhase = "idle" | "preparing" | "uploading" | "done" | "error"

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false)
  const [uploadVisible, setUploadVisible] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFileName, setUploadFileName] = useState("")
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("idle")

  const { mutateAsync: createMeeting } = useCreateMeeting()
  const { mutateAsync: uploadFile } = useUploadFile()

  const resetUploadState = () => {
    setUploadVisible(false)
    setUploadProgress(0)
    setUploadFileName("")
    setUploadPhase("idle")
  }

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/*", "audio/*"],
        copyToCacheDirectory: true,
      })

      if (result.canceled || !result.assets?.[0]) {
        return
      }

      const asset = result.assets[0]
      const fileName = asset.name ?? "meeting-file"
      const fileType = asset.mimeType ?? "application/octet-stream"

      setUploadFileName(fileName)
      setUploadProgress(0)
      setUploadPhase("preparing")
      setUploadVisible(true)

      const userId = await SecureStore.getItemAsync("userId")
      if (!userId) {
        throw new Error("로그인 정보가 없습니다. 다시 로그인해 주세요.")
      }

      const { uploadUrl } = await createMeeting({
        userId,
        fileName,
        fileType,
      })

      setUploadPhase("uploading")

      await uploadFile({
        file: {
          uri: asset.uri,
          name: fileName,
          type: fileType,
        },
        url: uploadUrl,
        onProgress: (percent) => {
          setUploadProgress(percent)
        },
      })

      setUploadProgress(100)
      setUploadPhase("done")
    } catch (error) {
      setUploadPhase("error")
      const message =
        error instanceof Error
          ? error.message
          : "파일 업로드 중 오류가 발생했습니다."
      Alert.alert("업로드 실패", message, [
        { text: "확인", onPress: resetUploadState },
      ])
    }
  }

  const phaseLabel =
    uploadPhase === "preparing"
      ? "업로드 URL 준비 중..."
      : uploadPhase === "uploading"
        ? "R2에 업로드 중..."
        : uploadPhase === "done"
          ? "업로드 완료"
          : uploadPhase === "error"
            ? "업로드 실패"
            : ""

  return (
    <ThemedView className="bg-background flex-1 flex-row  justify-center">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {}}
              tintColor="#6366F1"
            />
          }
        >
          {/* 1. Header Area (인사말 & 크레딧 칩) */}
          <View className="mb-2 flex-row items-center justify-between py-4">
            <View>
              <Text className="text-xs font-medium text-slate-400">
                좋은 아침이에요 👋
              </Text>
              <Text className="mt-0.5 text-xl font-bold text-slate-50">
                대시보드
              </Text>
            </View>
            <Pressable className="flex-row items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 active:opacity-70">
              <Zap size={13} color="#818CF8" />
              <Text className="ml-1.5 text-xs font-semibold text-indigo-300">
                120 / 500분
              </Text>
            </Pressable>
          </View>

          <DashboardProcessing />

          {/* 3. Hero Section (Quick Upload & Recording CTA) */}
          <View className="ai-gradient-card mb-5 p-4">
            <Text className="mb-1 text-base font-bold text-slate-50">
              새 회의 분석하기
            </Text>
            <Text className="mb-4 text-xs text-slate-400">
              영상/오디오 파일을 올려 화자 분리 및 액션 아이템을 추출하세요.
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                className="flex-1 flex-row items-center justify-center rounded-lg bg-indigo-600 py-3 active:bg-indigo-700"
                onPress={handleDocumentPicker}
              >
                <Upload size={16} color="#FFF" />
                <Text className="ml-1.5 text-xs font-semibold text-white">
                  파일 업로드
                </Text>
              </Pressable>
              <Pressable className="flex-1 flex-row items-center justify-center rounded-lg border border-slate-700 bg-slate-800 py-3 active:bg-slate-700">
                <Mic size={16} color="#A5B4FC" />
                <Text className="ml-1.5 text-xs font-semibold text-indigo-200">
                  실시간 녹음
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 4. Action Items Widget (내 할 일 위젯) */}
          <ActionItems />

          {/* 5. Recent Meetings List */}
          <RecentMeeting />
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={uploadVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (uploadPhase === "done" || uploadPhase === "error") {
            resetUploadState()
          }
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          <View className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <Text className="mb-1 text-base font-bold text-slate-50">
              파일 업로드
            </Text>
            <Text className="mb-4 text-xs text-slate-400" numberOfLines={2}>
              {uploadFileName}
            </Text>

            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-xs text-slate-400">{phaseLabel}</Text>
              <Text className="font-mono text-xs font-bold text-indigo-300">
                {uploadProgress}%
              </Text>
            </View>

            <View className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <View
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </View>

            {uploadPhase === "done" && (
              <Pressable
                className="items-center rounded-lg bg-indigo-600 py-3 active:bg-indigo-700"
                onPress={resetUploadState}
              >
                <Text className="text-xs font-semibold text-white">확인</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </ThemedView>
  )
}
