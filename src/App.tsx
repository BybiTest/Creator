import React, { useState, useEffect } from "react";
import { NavigationTab, UserSettings } from "./types";
import { DEFAULT_SETTINGS } from "./data";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { DashboardView } from "./components/DashboardView";
import { AiChatView } from "./components/AiChatView";
import { ContentIdeasView } from "./components/ContentIdeasView";
import { HooksScriptsView } from "./components/HooksScriptsView";
import { ThumbnailStudioView } from "./components/ThumbnailStudioView";
import { StoryStudioView } from "./components/StoryStudioView";
import { GrowthMonetizationView } from "./components/GrowthMonetizationView";
import { PlannerView } from "./components/PlannerView";
import { VipView } from "./components/VipView";
import { TapsellAdsView } from "./components/TapsellAdsView";
import { SettingsView } from "./components/SettingsView";
import { AndroidProjectHub } from "./components/AndroidProjectHub";

const SETTINGS_STORAGE_KEY = "creatorflow_user_settings";

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>("dashboard");

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const handleUpdateSettings = (newPartial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  const handleResetSettings = () => {
    if (
      window.confirm(
        settings.language === "fa"
          ? "آیا از بازنشانی کلیه تنظیمات به حالت اولیه اطمینان دارید؟"
          : "Reset all settings to defaults?"
      )
    ) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  };

  // Font scale map
  const fontScaleMap = {
    small: "text-[14px]",
    medium: "text-[16px]",
    large: "text-[18px]",
    xlarge: "text-[20px]",
  };

  // Theme container classes
  const themeClasses = {
    dark: "bg-[#0A0F1D] text-slate-100",
    navy: "bg-[#060D1E] text-slate-100",
    light: "bg-slate-100 text-slate-900",
  };

  return (
    <div
      dir={settings.language === "fa" ? "rtl" : "ltr"}
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        themeClasses[settings.theme]
      } ${fontScaleMap[settings.fontSize]}`}
    >
      {/* Header */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenVip={() => setActiveTab("vip")}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        language={settings.language}
        vipStatus={settings.vipStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "dashboard" && (
          <DashboardView
            settings={settings}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === "ai_assistant" && <AiChatView settings={settings} />}
        {activeTab === "content_ideas" && (
          <ContentIdeasView settings={settings} />
        )}
        {activeTab === "hooks_scripts" && (
          <HooksScriptsView settings={settings} />
        )}
        {activeTab === "thumbnail_studio" && (
          <ThumbnailStudioView
            settings={settings}
            onOpenVip={() => setActiveTab("vip")}
          />
        )}
        {activeTab === "story_studio" && (
          <StoryStudioView
            settings={settings}
            onOpenVip={() => setActiveTab("vip")}
          />
        )}
        {activeTab === "growth_monetization" && (
          <GrowthMonetizationView settings={settings} />
        )}
        {activeTab === "planner" && <PlannerView settings={settings} />}
        {activeTab === "vip" && (
          <VipView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
        {activeTab === "tapsell_ads" && (
          <TapsellAdsView settings={settings} />
        )}
        {activeTab === "settings" && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetSettings={handleResetSettings}
          />
        )}
        {activeTab === "android_project" && (
          <AndroidProjectHub settings={settings} />
        )}
      </main>

      {/* App Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            CreatorFlow &copy; 2026 &bull; {settings.developer} (Seyed Hamid Mousavizadeh)
          </span>
          <span className="font-mono text-slate-600">
            Package: com.creatorflow.app &bull; v1.0.0
          </span>
        </div>
      </footer>
    </div>
  );
}
