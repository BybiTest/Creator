import React from "react";
import {
  Sparkles,
  Bot,
  Lightbulb,
  FileText,
  Image as ImageIcon,
  Instagram,
  TrendingUp,
  CalendarCheck,
  Crown,
  ArrowRight,
  Tv,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { NavigationTab, UserSettings } from "../types";
import { translations } from "../locales";
import { TAPSELL_CONFIG } from "../data";

interface DashboardViewProps {
  settings: UserSettings;
  onNavigate: (tab: NavigationTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  onNavigate,
}) => {
  const t = translations[settings.language];

  const tools = [
    {
      id: "ai_assistant" as NavigationTab,
      title: t.nav.aiAssistant,
      desc: t.aiChat.subtitle,
      icon: Bot,
      color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400",
      accent: "bg-cyan-500",
    },
    {
      id: "content_ideas" as NavigationTab,
      title: t.nav.contentIdeas,
      desc: t.ideas.subtitle,
      icon: Lightbulb,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
      accent: "bg-amber-500",
    },
    {
      id: "hooks_scripts" as NavigationTab,
      title: t.nav.hooksScripts,
      desc: t.scripts.subtitle,
      icon: FileText,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
      accent: "bg-purple-500",
    },
    {
      id: "thumbnail_studio" as NavigationTab,
      title: t.nav.thumbnailStudio,
      desc: t.thumbnail.subtitle,
      icon: ImageIcon,
      color: "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400",
      accent: "bg-red-500",
    },
    {
      id: "story_studio" as NavigationTab,
      title: t.nav.storyStudio,
      desc: t.story.subtitle,
      icon: Instagram,
      color: "from-fuchsia-500/20 to-pink-500/20 border-pink-500/30 text-pink-400",
      accent: "bg-pink-500",
    },
    {
      id: "growth_monetization" as NavigationTab,
      title: t.nav.growthMonetization,
      desc: t.growth.subtitle,
      icon: TrendingUp,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
      accent: "bg-emerald-500",
    },
    {
      id: "planner" as NavigationTab,
      title: t.nav.planner,
      desc: t.planner.subtitle,
      icon: CalendarCheck,
      color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400",
      accent: "bg-indigo-500",
    },
    {
      id: "android_project" as NavigationTab,
      title: t.nav.androidProject,
      desc: t.androidHub.subtitle,
      icon: Code2,
      color: "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400",
      accent: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-2xl">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/20 border-2 border-orange-500/40 shrink-0 bg-slate-950 ring-4 ring-orange-500/10">
              <img
                src={settings.customAppIcon || "/app-icon.png"}
                alt="CreatorFlow Icon"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>AI Creator & Growth Studio</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {t.dashboard.welcomeTitle}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {t.dashboard.welcomeSubtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate("ai_assistant")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Bot className="w-4 h-4" />
              <span>{t.dashboard.launchAi}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("vip")}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 border border-amber-500/30 text-sm font-semibold transition-all"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{settings.vipStatus ? t.vipMember : t.upgradeToVip}</span>
            </button>
          </div>
        </div>

        {/* Milestone Quick Stats Bar */}
        <div className="mt-8 pt-6 border-t border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t.dashboard.quickStats.subscribers}</p>
              <p className="text-lg font-bold text-white">1,000 / 1,000 Goal</p>
              <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full w-3/4" />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t.dashboard.quickStats.watchHours}</p>
              <p className="text-lg font-bold text-white">4,000 Hours Goal</p>
              <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full w-2/3" />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t.dashboard.quickStats.channelHealth}</p>
              <p className="text-lg font-bold text-purple-300">
                {settings.vipStatus ? "VIP Tier (Full Access)" : "Standard Creator (Free)"}
              </p>
              <p className="text-[11px] text-slate-500">
                {settings.vipStatus ? "No Tapsell Ads" : "Rewarded ads supported"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tapsell Standard Banner Ad Slot */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  TAPSELL BANNER AD
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {TAPSELL_CONFIG.bannerAdId}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {settings.language === "fa"
                  ? "جایگاه تبلیغات بنری استاندارد تپسل برای درآمدزایی و حمایت از حساب‌های کاربری رایگان"
                  : "Official Tapsell Standard Banner slot for monetization and free-tier user support"}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("tapsell_ads")}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
          >
            {settings.language === "fa" ? "مشاهده جزئیات تپسل" : "Tapsell SDK Info"}
          </button>
        </div>
      </div>

      {/* Grid of Tools */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>{t.dashboard.popularTools}</span>
          <span className="text-xs font-normal text-slate-400">
            ({tools.length} {settings.language === "fa" ? "ابزار فعال" : "active tools"})
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className="group relative cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-850 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-lg"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 bg-gradient-to-br ${tool.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors text-base mb-1">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.desc}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                  <span>{settings.language === "fa" ? "ورود به ابزار" : "Launch Studio"}</span>
                  <ArrowRight className="w-3.5 h-3.5 mx-1.5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
