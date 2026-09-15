import React from "react";
import {
  LayoutDashboard,
  Bot,
  Lightbulb,
  FileText,
  Image as ImageIcon,
  Instagram,
  TrendingUp,
  CalendarCheck,
  Crown,
  Tv,
  Settings as SettingsIcon,
  Code2,
} from "lucide-react";
import { NavigationTab } from "../types";
import { translations } from "../locales";

interface NavigationProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  language: "fa" | "en";
  vipStatus: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  language,
  vipStatus,
}) => {
  const t = translations[language].nav;

  const navItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    isVIP?: boolean;
  }> = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
    { id: "ai_assistant", label: t.aiAssistant, icon: Bot, badge: "AI" },
    { id: "content_ideas", label: t.contentIdeas, icon: Lightbulb },
    { id: "hooks_scripts", label: t.hooksScripts, icon: FileText },
    { id: "thumbnail_studio", label: t.thumbnailStudio, icon: ImageIcon },
    { id: "story_studio", label: t.storyStudio, icon: Instagram },
    { id: "growth_monetization", label: t.growthMonetization, icon: TrendingUp },
    { id: "planner", label: t.planner, icon: CalendarCheck },
    { id: "vip", label: t.vip, icon: Crown, isVIP: true },
    { id: "tapsell_ads", label: t.tapsellAds, icon: Tv },
    { id: "settings", label: t.settings, icon: SettingsIcon },
    { id: "android_project", label: t.androidProject, icon: Code2, badge: "APK" },
  ];

  return (
    <nav className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center gap-1 sm:gap-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md shadow-orange-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive
                    ? "text-white"
                    : item.isVIP
                    ? "text-amber-400"
                    : "text-slate-400"
                }`}
              />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
