import React, { useState } from "react";
import {
  TrendingUp,
  Target,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Users,
  Award,
} from "lucide-react";
import { GrowthStrategyData, UserSettings } from "../types";
import { translations } from "../locales";

interface GrowthMonetizationViewProps {
  settings: UserSettings;
}

export const GrowthMonetizationView: React.FC<GrowthMonetizationViewProps> = ({
  settings,
}) => {
  const t = translations[settings.language].growth;
  const common = translations[settings.language].common;

  const [niche, setNiche] = useState("آموزش و تکنولوژی یوتیوب");
  const [currentSubs, setCurrentSubs] = useState<number>(450);
  const [currentHours, setCurrentHours] = useState<number>(1800);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  const [strategyData, setStrategyData] = useState<GrowthStrategyData>({
    monetizationStatus:
      settings.language === "fa"
        ? "کانال شما در حال حاضر در فاز رشد شتاب‌دار قرار دارد. با ۴۵۰ سابسکرایبر و ۱۸۰۰ ساعت واچ‌تایم، تخمین زده می‌شود با حفظ ریتم بارگذاری مناسب، ظرف ۲ الی ۳ ماه آینده به شرایط کامل مانیتایز یوتیوب برسید."
        : "Your channel is in high-momentum trajectory. With 450 subscribers and 1,800 watch hours, you are on track to achieve full YPP monetization eligibility within 60-90 days.",
    recommendedCadence:
      settings.language === "fa"
        ? "۲ ویدیوی بلند عمیق در هفته (روزهای یکشنبه و چهارشنبه) + ۴ شورتس مکمل جهت کشف مخاطب جدید"
        : "2 deep long-form videos per week + 4 Shorts funnels for discovery",
    phases: [
      {
        phaseName:
          settings.language === "fa"
            ? "فاز اول: تثبیت هویت و جذب ۵۰۰ سابسکرایبر اول"
            : "Phase 1: Channel Foundation & First 500 Loyal Viewers",
        target: "500 Subscribers",
        actionItems: [
          settings.language === "fa"
            ? "تولید حداقل ۱۵ ویدیوی هم‌محور در یک نیچ کاملاً مشخص بدون انحراف موضوعی"
            : "Publish 15 tightly-focused videos in a single core sub-niche",
          settings.language === "fa"
            ? "بهینه‌سازی تامبنیل‌ها برای وضوح کامل روی صفحه گوشی موبایل"
            : "Optimize mobile thumbnail readability with 3 words max",
          settings.language === "fa"
            ? "پاسخ دادن به تمام کامنت‌های مخاطبان در ۲۴ ساعت اول انتشار"
            : "Reply to 100% of comments in the first 24 hours",
        ],
      },
      {
        phaseName:
          settings.language === "fa"
            ? "فاز دوم: انفجار واچ‌تایم و عبور از ۴۰۰۰ ساعت"
            : "Phase 2: Watch Time Surge (Pass 4,000 Watch Hours)",
        target: "1,000 Subs & 4,000 Watch Hours",
        actionItems: [
          settings.language === "fa"
            ? "طراحی هوک ۳۰ ثانیه‌ای بر اساس کنجکاوی برای بالا بردن AVD به بیش از ۵۰٪"
            : "Structure opening 30 seconds to push Average View Duration above 50%",
          settings.language === "fa"
            ? "استفاده هدفمند از پلی‌لیست‌ها و انداسکرین جهت هدایت بیننده به ویدیوی بعدی"
            : "Deploy end-screen binge playlists to multiply session duration",
          settings.language === "fa"
            ? "انتشار شورتس‌های قلاب‌دار که مستقیماً به نسخه کامل لینک دارند"
            : "Publish conversion Shorts that funnel directly into long-form pillars",
        ],
      },
      {
        phaseName:
          settings.language === "fa"
            ? "فاز سوم: مانیتایز و تنوع‌بخشی به درآمد"
            : "Phase 3: YPP Monetization & Multi-Stream Revenue",
        target: "10,000+ Subs & Brand Deals",
        actionItems: [
          settings.language === "fa"
            ? "فعال‌سازی AdSense و تنظیم میدرول در ویدیوهای بالای ۸ دقیقه"
            : "Enable AdSense with strategic mid-rolls on 8+ minute content",
          settings.language === "fa"
            ? "راه‌اندازی سیستم اسپانسری، افیلیت مارکتینگ و فروش محصولات دیجیتال"
            : "Launch affiliate systems and direct brand collaborations",
        ],
      },
    ],
    retentionChecklist: [
      settings.language === "fa"
        ? "آیا در ۵ ثانیه اول دقیقاً قولی که در تامبنیل دادید را شروع کردید؟"
        : "Did you confirm the thumbnail promise in the first 5 seconds?",
      settings.language === "fa"
        ? "آیا اینترو یا لوگوموشن طولانی را به طور کامل حذف کردید؟"
        : "Are all static vanity intros completely eliminated?",
      settings.language === "fa"
        ? "آیا ریتم کات‌ها و تغییر زاویه یا B-Roll کمتر از ۶ ثانیه یکبار انجام می‌شود؟"
        : "Is there visual pacing change or B-roll every 4-6 seconds?",
      settings.language === "fa"
        ? "آیا عنوان ویدیو کمتر از ۶۰ کاراکتر است تا در موبایل بریده نشود؟"
        : "Is title under 60 characters so it fits mobile screens?",
      settings.language === "fa"
        ? "آیا یک حلقه باز (Open Loop) برای نگه داشتن مخاطب تا آخر ویدیو ایجاد شده است؟"
        : "Is there an open loop keeping viewers curious until the finale?",
    ],
    shortsStrategy:
      settings.language === "fa"
        ? "شورتس‌ها باید به عنوان قیف ورودی عمل کنند: بهترین بخش ۳۰ ثانیه‌ای ویدیوی اصلی را با ریتم تند ادیت کنید و با استفاده از قابلیت Related Video یوتیوب، بیننده را به تماشای ویدیوی اصلی دعوت نمایید."
        : "Use Shorts as high-volume discovery funnels: take the peak 30s moment, link it via YouTube's Related Video feature to long-form.",
  });

  const subsPercent = Math.min(100, Math.round((currentSubs / 1000) * 100));
  const hoursPercent = Math.min(100, Math.round((currentHours / 4000) * 100));

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/growth-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelNiche: niche,
          currentSubscribers: currentSubs,
          currentWatchHours: currentHours,
          language: settings.language,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate strategy.");
      const data = await res.json();
      if (data.strategy && data.strategy.phases) {
        setStrategyData(data.strategy);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          (settings.language === "fa"
            ? "خطا در تحلیل نقشه راه. لطفاً بررسی کنید."
            : "Failed to generate roadmap.")
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>YOUTUBE PARTNER PROGRAM (YPP) ROADMAP</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Metric Cards and Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscribers Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold">
                  {t.subsProgress}
                </span>
                <p className="text-2xl font-extrabold text-white">
                  {currentSubs.toLocaleString()} / 1,000
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-orange-400">
              {subsPercent}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${subsPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {1000 - currentSubs > 0
                ? `${(1000 - currentSubs).toLocaleString()} سابسکرایبر تا سقف مانیتایز`
                : "شرط سابسکرایبر با موفقیت کامل شد!"}
            </span>
            <span className="text-emerald-400 font-semibold">
              {subsPercent >= 100 ? "تکمیل شد" : "در حال پیشرفت"}
            </span>
          </div>
        </div>

        {/* Watch Hours Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold">
                  {t.hoursProgress}
                </span>
                <p className="text-2xl font-extrabold text-white">
                  {currentHours.toLocaleString()} / 4,000
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-cyan-400">
              {hoursPercent}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${hoursPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {4000 - currentHours > 0
                ? `${(4000 - currentHours).toLocaleString()} ساعت واچ‌تایم باقی مانده`
                : "شرط ۴۰۰۰ ساعت تکمیل شد!"}
            </span>
            <span className="text-emerald-400 font-semibold">
              {hoursPercent >= 100 ? "تکمیل شد" : "در حال پیشرفت"}
            </span>
          </div>
        </div>
      </div>

      {/* Input Adjuster Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <span>{t.calcTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              موضوع کانال
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.subsLabel}
            </label>
            <input
              type="number"
              value={currentSubs}
              onChange={(e) => setCurrentSubs(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.hoursLabel}
            </label>
            <input
              type="number"
              value={currentHours}
              onChange={(e) => setCurrentHours(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? common.loading : t.analyzeBtn}</span>
          </button>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {/* Strategic Status Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-sm text-emerald-200 leading-relaxed">
          <p className="font-bold text-emerald-400 mb-1">
            ارزیابی تخصصی الگوریتم یوتیوب:
          </p>
          {strategyData.monetizationStatus}
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-white">ریتم پیشنهادی انتشار:</span>{" "}
            {strategyData.recommendedCadence}
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <span>{t.phasesTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategyData.phases.map((phase, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {phase.target}
                </span>
                <h4 className="font-bold text-white text-base mt-2">
                  {phase.phaseName}
                </h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  {phase.actionItems.map((action, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Retention & Pre-Publish Checklist */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>{t.checklistTitle}</span>
        </h3>

        <div className="space-y-2.5">
          {strategyData.retentionChecklist.map((item, idx) => {
            const isChecked = Boolean(checkedItems[idx]);
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? "bg-slate-950 border-emerald-500/40 text-white"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    isChecked
                      ? "bg-emerald-500 border-emerald-400 text-black"
                      : "border-slate-600 bg-slate-900"
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span className="text-xs sm:text-sm">{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
