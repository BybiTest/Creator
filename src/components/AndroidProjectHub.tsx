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
  Key,
  ShieldCheck,
  FileArchive,
  Layers,
  Sparkles,
  ArrowDownToLine,
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
      title: "GitHub Actions CI/CD Workflow (AAB, APK & Official Bazaar Signer .bin)",
      filename: ".github/workflows/android-build.yml",
      language: "yaml",
      content: `name: Build & Sign CreatorFlow Android APK & AAB

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    name: Build & Sign Android (APK, AAB & Bundle Signer .bin)
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

      - name: Ensure Gradle Wrapper JAR exists
        run: |
          mkdir -p gradle/wrapper
          if [ ! -f "gradle/wrapper/gradle-wrapper.jar" ] || [ ! -s "gradle/wrapper/gradle-wrapper.jar" ]; then
            curl -sSL -o gradle/wrapper/gradle-wrapper.jar https://raw.githubusercontent.com/gradle/gradle/v8.9.0/gradle/wrapper/gradle-wrapper.jar
          fi

      - name: Grant Execute Permission to Gradlew & Scripts
        run: |
          chmod +x gradlew
          chmod +x scripts/bundle-signer.sh

      - name: Validate and Ensure Proper PNG Icon Resources
        run: |
          for img in app/src/main/res/mipmap-*/*.png; do
            if [ -f "$img" ]; then
              file "$img" | grep -q "PNG image data" || (which convert && convert "$img" "PNG32:$img") || true
            fi
          done

      - name: Prepare Release Keystore
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD || 'creatorflow123' }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD || 'creatorflow123' }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS || 'creatorflow_key' }}
        run: |
          mkdir -p signing
          if [ -n "\${{ secrets.RELEASE_KEYSTORE_BASE64 }}" ]; then
            echo "\${{ secrets.RELEASE_KEYSTORE_BASE64 }}" | base64 -d > signing/release.keystore
          elif [ ! -f "signing/release.keystore" ]; then
            openssl genrsa -out signing/release_private_key.pem 2048
            openssl req -new -x509 -key signing/release_private_key.pem -out signing/release_cert.pem -days 10000 \\
              -subj "/CN=CreatorFlow/OU=Production/O=HamidMousavizadeh/C=IR"
            openssl pkcs12 -export -in signing/release_cert.pem -inkey signing/release_private_key.pem \\
              -out signing/release.keystore -name "$KEY_ALIAS" -passout "pass:$KEYSTORE_PASSWORD"
          fi
          ls -la signing/release.keystore

      - name: Build Release APK
        run: ./gradlew assembleRelease --stacktrace

      - name: Build Release Bundle (AAB)
        run: ./gradlew bundleRelease --stacktrace

      - name: Build Debug APK
        run: ./gradlew assembleDebug --stacktrace

      - name: Sign APK and AAB with Keystore
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD || 'creatorflow123' }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD || 'creatorflow123' }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS || 'creatorflow_key' }}
        run: |
          # Sign Release AAB
          if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
            cp app/build/outputs/bundle/release/app-release.aab app/build/outputs/bundle/release/CreatorFlow-release-signed.aab
            jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \\
              -keystore signing/release.keystore \\
              -storepass "$KEYSTORE_PASSWORD" \\
              -keypass "$KEY_PASSWORD" \\
              app/build/outputs/bundle/release/CreatorFlow-release-signed.aab "$KEY_ALIAS"
          fi

          # Sign Release APK (Universal APK for Cafe Bazaar)
          APK_FILE=$(find app/build/outputs/apk/release -name "*.apk" | head -n 1)
          if [ -n "$APK_FILE" ]; then
            cp "$APK_FILE" app/build/outputs/apk/release/CreatorFlow-release-signed.apk
            jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \\
              -keystore signing/release.keystore \\
              -storepass "$KEYSTORE_PASSWORD" \\
              -keypass "$KEY_PASSWORD" \\
              app/build/outputs/apk/release/CreatorFlow-release-signed.apk "$KEY_ALIAS"
          fi

      - name: Generate Cafe Bazaar Official Bundle Signer (.bin)
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD || 'creatorflow123' }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD || 'creatorflow123' }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS || 'creatorflow_key' }}
        run: |
          curl -sSL -o /tmp/bundlesigner-0.1.13.jar https://github.com/cafebazaar/bundle-signer/releases/download/v0.1.13/bundlesigner-0.1.13.jar
          java -jar /tmp/bundlesigner-0.1.13.jar genbin \\
            --bundle app/build/outputs/bundle/release/CreatorFlow-release-signed.aab \\
            --bin signing/ \\
            --v2-signing-enabled true \\
            --v3-signing-enabled false \\
            --ks signing/release.keystore \\
            --ks-pass "pass:$KEYSTORE_PASSWORD" \\
            --key-pass "pass:$KEY_PASSWORD" \\
            --ks-key-alias "$KEY_ALIAS" \\
            -v
          BAZAAR_BIN=$(find signing/ -maxdepth 1 -name "*.bin" | head -n 1)
          if [ -n "$BAZAAR_BIN" ]; then
            cp "$BAZAAR_BIN" signing/bazaar_bundle_signer.bin
          fi

      - name: Upload Universal Signed Release APK (Cafe Bazaar Direct Upload)
        uses: actions/upload-artifact@v4
        with:
          name: CreatorFlow-Universal-Signed-APK
          path: app/build/outputs/apk/release/CreatorFlow-release-signed.apk

      - name: Upload Signed Release Bundle (AAB)
        uses: actions/upload-artifact@v4
        with:
          name: CreatorFlow-Signed-Release-AAB
          path: app/build/outputs/bundle/release/CreatorFlow-release-signed.aab

      - name: Upload Cafe Bazaar Bundle Signer (.bin) Digest
        uses: actions/upload-artifact@v4
        with:
          name: CreatorFlow-CafeBazaar-BundleSigner-BIN
          path: signing/bazaar_bundle_signer.bin

      - name: Upload Release Keystore Backup
        uses: actions/upload-artifact@v4
        with:
          name: CreatorFlow-Release-Keystore
          path: signing/release.keystore

      - name: Upload Debug APK
        uses: actions/upload-artifact@v4
        with:
          name: CreatorFlow-Debug-APK
          path: app/build/outputs/apk/debug/app-debug.apk`,
    },
    bundleSignerScript: {
      title: "Official Cafe Bazaar Bundle Signer & Packaging Script",
      filename: "scripts/bundle-signer.sh",
      language: "bash",
      content: `#!/usr/bin/env bash
set -e

KEYSTORE_PATH=\${KEYSTORE_PATH:-"signing/release.keystore"}
KEY_ALIAS=\${KEY_ALIAS:-"creatorflow_key"}
KEY_PASSWORD=\${KEY_PASSWORD:-"creatorflow123"}
KEYSTORE_PASSWORD=\${KEYSTORE_PASSWORD:-"creatorflow123"}
SIGNING_DIR=\${SIGNING_DIR:-"signing"}

echo "🚀 [CreatorFlow Packager] Starting Android signing process..."
mkdir -p "$SIGNING_DIR"

if [ ! -f "$KEYSTORE_PATH" ]; then
    openssl genrsa -out "$SIGNING_DIR/release_private_key.pem" 2048
    openssl req -new -x509 -key "$SIGNING_DIR/release_private_key.pem" -out "$SIGNING_DIR/release_cert.pem" -days 10000 \\
        -subj "/CN=CreatorFlow/OU=Production/O=HamidMousavizadeh/C=IR"
    openssl pkcs12 -export -in "$SIGNING_DIR/release_cert.pem" -inkey "$SIGNING_DIR/release_private_key.pem" \\
        -out "$KEYSTORE_PATH" -name "$KEY_ALIAS" -passout "pass:$KEYSTORE_PASSWORD"
fi

AAB_INPUT=$(find app/build/outputs/bundle/release -name "*.aab" 2>/dev/null | head -n 1 || true)
if [ -n "$AAB_INPUT" ]; then
    SIGNED_AAB="$SIGNING_DIR/CreatorFlow-release-signed.aab"
    cp "$AAB_INPUT" "$SIGNED_AAB"
    jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \\
        -keystore "$KEYSTORE_PATH" -storepass "$KEYSTORE_PASSWORD" -keypass "$KEY_PASSWORD" \\
        "$SIGNED_AAB" "$KEY_ALIAS"
        
    BUNDLE_SIGNER_JAR="/tmp/bundlesigner-0.1.13.jar"
    if [ ! -f "$BUNDLE_SIGNER_JAR" ]; then
        curl -sSL -o "$BUNDLE_SIGNER_JAR" https://github.com/cafebazaar/bundle-signer/releases/download/v0.1.13/bundlesigner-0.1.13.jar
    fi
    java -jar "$BUNDLE_SIGNER_JAR" genbin \\
        --bundle "$SIGNED_AAB" --bin "$SIGNING_DIR/" \\
        --v2-signing-enabled true --v3-signing-enabled false \\
        --ks "$KEYSTORE_PATH" --ks-pass "pass:$KEYSTORE_PASSWORD" \\
        --key-pass "pass:$KEY_PASSWORD" --ks-key-alias "$KEY_ALIAS" -v
fi`,
    },
    appGradle: {
      title: "App Build Gradle (SigningConfigs & Dependencies)",
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
    }

    signingConfigs {
        create("release") {
            val keystoreFile = file("../signing/release.keystore")
            if (keystoreFile.exists()) {
                storeFile = keystoreFile
                storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "creatorflow123"
                keyAlias = System.getenv("KEY_ALIAS") ?: "creatorflow_key"
                keyPassword = System.getenv("KEY_PASSWORD") ?: "creatorflow123"
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            val releaseSigning = signingConfigs.findByName("release")
            if (releaseSigning?.storeFile != null && releaseSigning.storeFile!!.exists()) {
                signingConfig = releaseSigning
            }
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }
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
}`,
    },
  };

  const currentFile = fileContents[activeFile] || fileContents["workflow"];

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

      {/* Bundle Signer & Key Export Dedicated Card */}
      <div className="rounded-2xl border-2 border-orange-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/20 p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 shadow-lg shadow-orange-500/10">
              <Key className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  ابزار Bundle Signer و خروجی فایل‌های AAB ، APK و فرمت bin.
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Ready for GitHub & Bazaar
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                تولید مستقیم فایل فرمت <code className="text-orange-400 font-mono font-bold">.bin</code> جهت بارگذاری کلید برای اپ باندل (AAB) در کافه بازار و گوگل پلی و بیلد اتوماتیک در گیت‌هاب.
              </p>
            </div>
          </div>

          {/* Quick Download Action Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/bundle_signer_key.bin"
              download="bundle_signer_key.bin"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>دانلود فایل کلید (bin.)</span>
            </a>

            <a
              href="/creatorflow-release.keystore"
              download="creatorflow-release.keystore"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>دانلود Keystore</span>
            </a>

            <a
              href="/gradle-wrapper.jar"
              download="gradle-wrapper.jar"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
            >
              <FileArchive className="w-3.5 h-3.5 text-emerald-400" />
              <span>دانلود gradle-wrapper.jar</span>
            </a>

            <a
              href="/bundle-signer.sh"
              download="bundle-signer.sh"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>اسکریپت Signer</span>
            </a>
          </div>
        </div>

        {/* 3 Steps Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center font-mono">1</span>
              <span>روش اول (پیشنهادی): فایل APK امضا شده مستقیم</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              فایل <code className="text-emerald-300 font-mono">CreatorFlow-Universal-Signed-APK</code> بدون نیاز به هیچ فایل یا تنظیمات اضافی مستقیماً در پنل بازار بارگذاری شده و تایید می‌شود.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center font-mono">2</span>
              <span>روش دوم: فایل App Bundle (AAB)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              فایل <code className="text-amber-300 font-mono">CreatorFlow-Signed-Release-AAB</code> فرمت بهینه گوگل‌پلی و کافه بازار است که با حجم کمتر برای کاربران منتشر می‌شود.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center font-mono">3</span>
              <span>فایل رسمی بازار: Cafe Bazaar .bin Digest</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              فایل <code className="text-orange-300 font-mono">CreatorFlow-CafeBazaar-BundleSigner-BIN</code> دقیقاً با ابزار رسمی <code className="text-orange-400 font-mono">bundlesigner genbin</code> از روی AAB تولید شده و برای امضای AAB در پنل بازار معتبر است.
            </p>
          </div>
        </div>

        {/* Credentials Box */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <span><strong className="text-orange-400">Alias:</strong> creatorflow_key</span>
            <span><strong className="text-orange-400">Password:</strong> creatorflow123</span>
            <span><strong className="text-orange-400">Format:</strong> PKCS12 / DER .bin</span>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-sans">
            <CheckCircle2 className="w-3.5 h-3.5" />
            کلیدها در ریپازیتوری و GitHub Actions آماده و تست شده‌اند
          </span>
        </div>
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
              مخزن پروژه شامل آیکون رسمی، کدهای بومی کاتلین، اسکریپت Bundle Signer و گردش‌کار خودکار GitHub Actions برای ساخت APK دیباگ و AAB ریلیز است.
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
          <span>مراحل خروجی گرفتن در گیت‌هاب (GitHub Actions) و بارگذاری در مارکت‌ها:</span>
        </h3>

        <ol className="space-y-3 text-xs sm:text-sm text-slate-300 list-decimal list-inside leading-relaxed">
          <li>
            پروژه را به ریپازیتوری خود در GitHub پوش (Push) کنید.
          </li>
          <li>
            به تب <strong className="text-white">Actions</strong> در مخزن گیت‌هاب بروید.
          </li>
          <li>
            گردش‌کار{" "}
            <code className="text-cyan-300 font-mono">
              Build & Sign CreatorFlow Android APK & AAB
            </code>{" "}
            به طور خودکار اجرا می‌شود و مراحل کامپایل، ساین با Bundle Signer و اکسپورت کلید را انجام می‌دهد.
          </li>
          <li>
            پس از پایان موفق بیلد، در بخش <strong className="text-white">Artifacts</strong> فایل‌های خروجی رسمی در دسترس خواهد بود:
            <ul className="mt-2 mr-6 space-y-1.5 list-disc list-inside text-xs text-slate-400">
              <li><strong className="text-emerald-300 font-mono">CreatorFlow-Universal-Signed-APK</strong>: فایل APK ریلیز امضا شده (بهترین و سریع‌ترین گزینه برای آپلود مستقیم در کافه بازار بدون هیچ پیش‌نیاز یا فایل دیگر).</li>
              <li><strong className="text-amber-300 font-mono">CreatorFlow-Signed-Release-AAB</strong>: فایل App Bundle رسمی و امضا شده برای انتشار بهینه در کافه بازار و گوگل پلی.</li>
              <li><strong className="text-orange-300 font-mono">CreatorFlow-CafeBazaar-BundleSigner-BIN</strong>: فایل تاییدشده <code className="text-orange-400 font-mono font-bold">.bin</code> تولید شده توسط ابزار رسمی <code className="text-orange-400 font-mono">bundlesigner genbin</code> کافه بازار برای آپلود در صورت انتخاب متد AAB.</li>
              <li><strong className="text-cyan-300 font-mono">CreatorFlow-Release-Keystore</strong>: فایل بک‌آپ کلید Keystore رسمی.</li>
              <li><strong className="text-slate-300 font-mono">CreatorFlow-Debug-APK</strong>: نسخه دیباگ جهت خطایابی سریع.</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};
