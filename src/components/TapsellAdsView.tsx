import React, { useState } from "react";
import {
  Tv,
  Play,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  X,
} from "lucide-react";
import { UserSettings } from "../types";
import { TAPSELL_CONFIG } from "../data";
import { translations } from "../locales";

interface TapsellAdsViewProps {
  settings: UserSettings;
}

export const TapsellAdsView: React.FC<TapsellAdsViewProps> = ({ settings }) => {
  const t = translations[settings.language].tapsell;
  const common = translations[settings.language].common;

  const [showingVideoModal, setShowingVideoModal] = useState(false);
  const [videoTimer, setVideoTimer] = useState(5);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [freeCredits, setFreeCredits] = useState(3);

  const startRewardedVideo = () => {
    setShowingVideoModal(true);
    setVideoTimer(5);
    setRewardClaimed(false);

    const interval = setInterval(() => {
      setVideoTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRewardClaimed(true);
          setFreeCredits((c) => c + 5);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
          <Tv className="w-3.5 h-3.5 text-amber-400" />
          <span>OFFICIAL TAPSELL ADVERTISING HUB</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.subtitle}</p>
      </div>

      {/* SDK Status Badge */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <span className="text-xs text-slate-400 font-semibold">
              {t.sdkStatus}
            </span>
            <p className="text-sm font-bold text-white">{t.sdkReady}</p>
          </div>
        </div>

        <div className="text-xs px-3 py-1 rounded-lg bg-slate-850 border border-slate-700 text-slate-300 font-mono">
          SDK Version: 2.2.1-plus
        </div>
      </div>

      {/* Rewarded Video Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {t.rewardedTitle}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {t.rewardedAdId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {t.rewardedDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>اعتبار رایگان فعلی کاربر برای هوش مصنوعی:</span>
            <span className="font-bold text-amber-300">{freeCredits} اعتبار</span>
          </div>

          <button
            onClick={startRewardedVideo}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/20 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{t.watchRewardedBtn}</span>
          </button>
        </div>
      </div>

      {/* Standard Banner Ad Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {t.bannerTitle}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {t.bannerAdId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{t.bannerDesc}</p>
            </div>
          </div>
        </div>

        {/* Live Banner Mockup */}
        <div className="rounded-xl border border-dashed border-amber-500/40 bg-amber-950/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-extrabold text-sm border border-orange-500/30">
              AD
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400">
                Tapsell Banner Preview (320x50 / Responsive)
              </span>
              <p className="text-xs font-bold text-white">
                پکیج ویژه یوتیوبرها - رشد ۱۰۰٪ کانال با تحلیل اختصاصی هوش مصنوعی
              </p>
            </div>
          </div>
          <button
            onClick={() => alert("Banner click handled via Tapsell SDK event.")}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold whitespace-nowrap shadow-md"
          >
            مشاهده پیشنهاد
          </button>
        </div>
      </div>

      {/* Native Kotlin Code Snippet Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 shadow-xl">
        <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>پیاده‌سازی در کدهای اندروید (TapsellManager.kt):</span>
        </h3>
        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
{`// Tapsell Rewarded Video Request
TapsellPlus.requestRewardedVideoAd(
    activity,
    "${TAPSELL_CONFIG.rewardedAdId}",
    object : TapsellPlusListener() {
        override fun onResponse(response: TapsellPlusResponse) {
            responseZoneId = response.responseId
        }
        override fun onError(error: String) {
            Log.e("Tapsell", "Rewarded Error: $error")
        }
    }
)`}
        </pre>
      </div>

      {/* Simulated Video Ad Modal */}
      {showingVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-purple-500/40 bg-slate-900 p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase">
                  Tapsell Rewarded Ad Playing...
                </span>
              </div>
              {rewardClaimed ? (
                <button
                  onClick={() => setShowingVideoModal(false)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{videoTimer}s</span>
                </div>
              )}
            </div>

            {/* Simulated Video Screen */}
            <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/50 to-indigo-950/50" />
              <Tv className="w-12 h-12 text-purple-400 animate-pulse relative z-10" />
              <p className="text-xs text-slate-300 mt-2 relative z-10">
                تبلیغ ویدیویی جایزه‌ای تپسل در حال پخش است
              </p>
              <span className="text-[10px] text-slate-500 font-mono relative z-10 mt-1">
                Zone ID: {TAPSELL_CONFIG.rewardedAdId}
              </span>
            </div>

            {rewardClaimed ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>۵ اعتبار هوش مصنوعی با موفقیت به حساب شما اضافه شد!</span>
                </div>
                <button
                  onClick={() => setShowingVideoModal(false)}
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-slate-950 font-bold text-xs"
                >
                  بستن
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 text-center">
                لطفاً تا اتمام شمارش‌معکوس شکیبا باشید تا جایزه به حسابتان اعمال شود.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
