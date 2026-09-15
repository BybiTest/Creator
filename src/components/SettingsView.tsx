import React, { useRef } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Type,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Shield,
  User,
  Info,
  Image as ImageIcon,
  Upload,
  Download,
} from "lucide-react";
import { UserSettings } from "../types";
import { DEFAULT_SETTINGS } from "../data";
import { translations } from "../locales";

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetSettings: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const t = translations[settings.language].settings;
  const common = translations[settings.language].common;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearChatHistory = () => {
    if (window.confirm(settings.language === "fa" ? "آیا از پاک کردن تمام تاریخچه چت‌های AI اطمینان دارید؟" : "Clear all AI chat history?")) {
      localStorage.removeItem("creatorflow_chat_history");
      alert(t.clearedSuccess);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onUpdateSettings({ customAppIcon: result });
    };
    reader.readAsDataURL(file);
  };

  const handleResetIcon = () => {
    onUpdateSettings({ customAppIcon: "/app-icon.png" });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
          <SettingsIcon className="w-3.5 h-3.5 text-orange-400" />
          <span>APP PREFERENCES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Official App Icon Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-orange-400" />
            <span>
              {settings.language === "fa"
                ? "آیکون و لوگوی رسمی CreatorFlow"
                : "CreatorFlow Official App Icon"}
            </span>
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono">
            1024x1024 HD
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-500/40 bg-slate-900 shrink-0 ring-4 ring-orange-500/10">
            <img
              src={settings.customAppIcon || "/app-icon.png"}
              alt="Official CreatorFlow Icon"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left rtl:sm:text-right">
            <h4 className="text-sm font-bold text-white">
              {settings.language === "fa"
                ? "آیکون اصلی اپلیکیشن اندروید و استودیو"
                : "Primary Icon for Android & Studio"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.language === "fa"
                ? "این آیکون در تمام قسمت‌های برنامه، هدر، منوی لانچر اندروید و تب مرورگر قرار گرفته است. همچنین می‌توانید تصویر دلخواه خود را مستقیماً آپلود کنید تا بلافاصله جایگزین شود."
                : "This icon is set as the primary brand asset across the studio header, Android launcher, and browser tab. You can also upload any custom image to override it."}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 justify-center sm:justify-start rtl:sm:justify-start">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {settings.language === "fa"
                    ? "آپلود تصویر جدید"
                    : "Upload Custom Icon"}
                </span>
              </button>

              <a
                href={settings.customAppIcon || "/app-icon.png"}
                download="creatorflow-app-icon.png"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {settings.language === "fa" ? "دانلود فایل آیکون" : "Download Icon"}
                </span>
              </a>

              {settings.customAppIcon && settings.customAppIcon !== "/app-icon.png" && (
                <button
                  onClick={handleResetIcon}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white text-xs border border-slate-800"
                >
                  {settings.language === "fa"
                    ? "بازنشانی به آیکون پیش‌فرض"
                    : "Reset to Default"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theme Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Moon className="w-4 h-4 text-orange-400" />
          <span>{t.appearance}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onUpdateSettings({ theme: "dark" })}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
              settings.theme === "dark"
                ? "border-orange-500 bg-slate-950 shadow-md ring-1 ring-orange-500/50"
                : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">{t.themeDark}</span>
              {settings.theme === "dark" && (
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
              )}
            </div>
            <div className="w-full h-8 rounded-lg bg-slate-900 border border-slate-800" />
          </button>

          <button
            onClick={() => onUpdateSettings({ theme: "navy" })}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
              settings.theme === "navy"
                ? "border-cyan-500 bg-slate-950 shadow-md ring-1 ring-cyan-500/50"
                : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">{t.themeNavy}</span>
              {settings.theme === "navy" && (
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <div className="w-full h-8 rounded-lg bg-[#0F1E36] border border-blue-900" />
          </button>

          <button
            onClick={() => onUpdateSettings({ theme: "light" })}
            className={`p-4 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between ${
              settings.theme === "light"
                ? "border-amber-500 bg-slate-950 shadow-md ring-1 ring-amber-500/50"
                : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">{t.themeLight}</span>
              {settings.theme === "light" && (
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <div className="w-full h-8 rounded-lg bg-slate-200 border border-slate-300" />
          </button>
        </div>
      </div>

      {/* Global Font Scaling */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-orange-400" />
          <span>{t.textSize}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["small", "medium", "large", "xlarge"] as Array<UserSettings["fontSize"]>).map(
            (size) => {
              const labelMap = {
                small: t.sizeSmall,
                medium: t.sizeMedium,
                large: t.sizeLarge,
                xlarge: t.sizeXLarge,
              };
              const isSelected = settings.fontSize === size;
              return (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-orange-500 bg-orange-500/10 text-orange-300 font-bold"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-xs">{labelMap[size]}</span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Language Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-orange-400" />
          <span>{t.language}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onUpdateSettings({ language: "fa" })}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              settings.language === "fa"
                ? "border-orange-500 bg-slate-950 text-white font-bold"
                : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
            }`}
          >
            <span>{t.langFa}</span>
            {settings.language === "fa" && (
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
            )}
          </button>

          <button
            onClick={() => onUpdateSettings({ language: "en" })}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              settings.language === "en"
                ? "border-orange-500 bg-slate-950 text-white font-bold"
                : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
            }`}
          >
            <span>{t.langEn}</span>
            {settings.language === "en" && (
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
            )}
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-orange-400" />
          <span>{t.dataManagement}</span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClearChatHistory}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearChat}</span>
          </button>

          <button
            onClick={onResetSettings}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetSettings}</span>
          </button>
        </div>
      </div>

      {/* Developer and App Information */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-orange-400" />
          <span>{t.aboutTitle}</span>
        </h3>

        <div className="space-y-3 text-xs divide-y divide-slate-800/80">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400">{t.developerLabel}</span>
            <span className="font-bold text-orange-400">{t.developerValue}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400">{t.appIdLabel}</span>
            <span className="font-mono text-cyan-300">{t.appIdValue}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400">{t.versionLabel}</span>
            <span className="font-mono text-slate-200">{t.versionValue}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-400">{t.environmentLabel}</span>
            <span className="text-slate-200">{t.environmentValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
