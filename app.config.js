// .env 파일 로드 (dotenv가 설치되어 있으면 사용)
try {
  require("dotenv").config()
} catch (_) {
  // dotenv가 없어도 환경 변수는 터미널에서 설정 가능
}

export default {
  expo: {
    name: "cliptotask-front",
    slug: "cliptotask",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "cliptotaskfront",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/expo.icon",
      bundleIdentifier: "com.cliptotask.app",
      googleServicesFile: "./GoogleService-Info.plist",
    },
    android: {
      package: "com.cliptotask.app",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      ],
      "expo-document-picker",
      "expo-secure-store",
      "expo-notifications",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "be9ddb93-0d37-494f-ab73-21050f232f4f",
      },
    },
    owner: "zpxlffjrm",
  },
}
