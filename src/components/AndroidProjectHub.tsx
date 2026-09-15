import React, { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  FileCode,
  FolderGit2,
  Download,
  Terminal,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { UserSettings } from "../types";
import { translations } from "../locales";

interface AndroidProjectHubProps {
  settings: UserSettings;
}

export const AndroidProjectHub: React.FC<AndroidProjectHubProps> = ({
  settings,
}) => {
  const t = translations[settings.language].androidHub;
  const common = translations[settings.language].common;

  const [activeFile, setActiveFile] = useState<string>("workflow");
  const [copied, setCopied] = useState(false);

  const fileContents: Record<
    string,
    { title: string; filename: string; language: string; content: string }
  > = {
    workflow: {
      title: "GitHub Actions CI/CD Workflow",
      filename: ".github/workflows/android-build.yml",
      language: "yaml",
      content: `name: Build CreatorFlow Android APK & AAB

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant Execute Permission to Gradlew
        run: chmod +x gradlew

      - name: Assemble Debug APK
        run: ./gradlew assembleDebug --stacktrace

      - name: Assemble Release Bundle (AAB)
        run: ./gradlew bundleRelease --stacktrace

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: CreatorFlow-Debug-APK
          path: app/build/outputs/apk/debug/app-debug.apk

      - name: Upload Release Bundle Artifact
        uses: actions/upload-artifact@v4
        with:
          name: CreatorFlow-Release-Bundle
          path: app/build/outputs/bundle/release/app-release.aab`,
    },
    appGradle: {
      title: "App Build Gradle (Dependencies & SDK)",
      filename: "app/build.gradle.kts",
      language: "kotlin",
      content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.creatorflow.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.creatorflow.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX & Compose
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.navigation.compose)

    // Room Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Coroutines & Networking
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.gson)
    implementation(libs.okhttp.logging)

    // Tapsell SDK
    implementation("ir.tapsell.sdk:tapsell-plus:2.2.1-plus")

    // Cafe Bazaar In-App Billing
    implementation("com.github.cafebazaar.Poolakey:poolakey:2.1.0")
}`,
    },
    manifest: {
      title: "Android Manifest",
      filename: "app/src/main/AndroidManifest.xml",
      language: "xml",
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="com.farsitel.bazaar.permission.PAY_THROUGH_BAZAAR" />

    <application
        android:name=".CreatorFlowApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/Theme.CreatorFlow">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.CreatorFlow">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>`,
    },
    mainActivity: {
      title: "MainActivity.kt (Jetpack Compose Entry Point)",
      filename: "app/src/main/java/com/creatorflow/app/MainActivity.kt",
      language: "kotlin",
      content: `package com.creatorflow.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.creatorflow.app.ui.screens.MainAppContainer
import com.creatorflow.app.ui.theme.CreatorFlowTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CreatorFlowTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainAppContainer()
                }
            }
        }
    }
}`,
    },
    tapsell: {
      title: "TapsellManager.kt (Rewarded & Banner)",
      filename: "app/src/main/java/com/creatorflow/app/data/remote/TapsellManager.kt",
      language: "kotlin",
      content: `package com.creatorflow.app.data.remote

import android.app.Activity
import android.util.Log
import ir.tapsell.plus.TapsellPlus
import ir.tapsell.plus.TapsellPlusInitListener
import ir.tapsell.plus.TapsellPlusListener
import ir.tapsell.plus.model.TapsellPlusResponse

object TapsellManager {
    const val REWARDED_AD_ID = "6aa84a381f07c00619f451f1"
    const val BANNER_AD_ID = "6aa84a4fcd33cd4ed6e43287"

    fun initialize(activity: Activity, tapsellKey: String) {
        TapsellPlus.initialize(activity, tapsellKey, object : TapsellPlusInitListener {
            override fun onInitializeSuccess() {
                Log.d("Tapsell", "Tapsell SDK Initialized successfully")
            }
            override fun onInitializeFailed(error: String) {
                Log.e("Tapsell", "Init Failed: $error")
            }
        })
    }

    fun requestRewardedAd(activity: Activity, onReady: (String) -> Unit, onError: (String) -> Unit) {
        TapsellPlus.requestRewardedVideoAd(activity, REWARDED_AD_ID, object : TapsellPlusListener() {
            override fun onResponse(response: TapsellPlusResponse) {
                onReady(response.responseId)
            }
            override fun onError(error: String) {
                onError(error)
            }
        })
    }
}`,
    },
  };

  const currentFile = fileContents[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/20">
          <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>NATIVE ANDROID & GITHUB ACTIONS HUB</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.subtitle}</p>
      </div>

      {/* CI/CD Status Callout */}
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 shadow-lg shrink-0">
            <img
              src={settings.customAppIcon || "/app-icon.png"}
              alt="App Launcher Icon"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">
                {t.githubStatus}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                ic_launcher.png
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              مخزن پروژه شامل آیکون رسمی، کدهای بومی کاتلین و گردش‌کار خودکار GitHub Actions برای ساخت APK دیباگ و AAB ریلیز است.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800">
          Package: com.creatorflow.app
        </div>
      </div>

      {/* File Inspector Tabs and Code Viewer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          <div className="flex items-center gap-2">
            {Object.keys(fileContents).map((key) => {
              const f = fileContents[key];
              const isActive = activeFile === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFile(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-slate-800 text-white font-semibold border border-slate-700 shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{f.filename.split("/").pop()}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? common.copied : common.copy}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 bg-slate-950">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-xs text-slate-400">
            <span className="font-mono text-cyan-300">
              {currentFile.filename}
            </span>
            <span>{currentFile.title}</span>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
            {currentFile.content}
          </pre>
        </div>
      </div>

      {/* GitHub Actions Instructions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-orange-400" />
          <span>نحوه دریافت فایل خروجی APK در گیت‌هاب (GitHub Actions):</span>
        </h3>

        <ol className="space-y-3 text-xs sm:text-sm text-slate-300 list-decimal list-inside leading-relaxed">
          <li>
            این پروژه را به حساب کاربری خود در GitHub انتقال یا Push دهید.
          </li>
          <li>
            به تب <strong className="text-white">Actions</strong> در مخزن گیت‌هاب بروید.
          </li>
          <li>
            گردش‌کار{" "}
            <code className="text-cyan-300 font-mono">
              Build CreatorFlow Android APK & AAB
            </code>{" "}
            به طور خودکار پس از هر کامیت شروع به بیلد می‌کند.
          </li>
          <li>
            پس از پایان موفقیت‌آمیز، در بخش{" "}
            <strong className="text-white">Artifacts</strong> فایل‌های{" "}
            <code className="text-amber-400 font-mono">
              CreatorFlow-Debug-APK
            </code>{" "}
            و{" "}
            <code className="text-amber-400 font-mono">
              CreatorFlow-Release-Bundle
            </code>{" "}
            را مستقیماً دانلود کنید!
          </li>
        </ol>
      </div>
    </div>
  );
};
