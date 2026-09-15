import React from "react";
import { Sparkles, Crown, Moon, Sun, Globe } from "lucide-react";
import { UserSettings } from "../types";
import { translations } from "../locales";

interface HeaderProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenVip: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenVip,
}) => {
  const t = translations[settings.language];

  const toggleTheme = () => {
    const themes: Array<UserSettings["theme"]> = ["dark", "navy", "light"];
    const nextIndex = (themes.indexOf(settings.theme) + 1) % themes.length;
    onUpdateSettings({ theme: themes[nextIndex] });
  };

  const toggleLanguage = () => {
    const nextLang = settings.language === "fa" ? "en" : "fa";
    onUpdateSettings({ language: nextLang });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 border-slate-700/40 bg-slate-900/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-orange-500/20 border border-slate-700 bg-slate-950">
            <img
              src={settings.customAppIcon || "/app-icon.png"}
              alt="CreatorFlow Icon"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                CreatorFlow
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                PRO STUDIO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* VIP Status Badge / Button */}
          <button
            onClick={onOpenVip}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              settings.vipStatus
                ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md shadow-amber-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 hover:border-amber-400"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{settings.vipStatus ? t.vipMember : t.upgradeToVip}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title={t.settings.language}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase">{settings.language}</span>
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={toggleTheme}
            title={t.settings.appearance}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {settings.theme === "light" ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
