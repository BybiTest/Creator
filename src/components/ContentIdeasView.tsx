import React, { useState } from "react";
import {
  Lightbulb,
  Sparkles,
  Bookmark,
  Check,
  Copy,
  TrendingUp,
  Target,
  Video,
  Layers,
} from "lucide-react";
import { ContentIdea, UserSettings } from "../types";
import { translations } from "../locales";

interface ContentIdeasViewProps {
  settings: UserSettings;
}

const SAVED_IDEAS_KEY = "creatorflow_saved_ideas";

export const ContentIdeasView: React.FC<ContentIdeasViewProps> = ({ settings }) => {
  const t = translations[settings.language].ideas;
  const common = translations[settings.language].common;

  const [niche, setNiche] = useState("تکنولوژی و هوش مصنوعی");
  const [topic, setTopic] = useState("بهترین ابزارهای ویدیوسازی در 2026");
  const [targetAudience, setTargetAudience] = useState("یوتیوبرها و تولیدکنندگان محتوا");
  const [format, setFormat] = useState("Both");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [ideas, setIdeas] = useState<ContentIdea[]>([
    {
      id: "idea-demo-1",
      title: "این ابزار هوش مصنوعی ادیتور شما را بازنشسته می‌کند!",
      hook: "اگه هنوز ساعت‌ها برای تدوین ویدیوهات وقت می‌ذاری، احتمالاً این آپدیت ۲۰۲۶ رو ندیدی...",
      format: "Shorts",
      targetAudience: "ادیتورها و یوتیوبرها",
      viralScore: 94,
      keyTalkingPoints: [
        "معرفی قابلیت Auto-Cuts هوشمند",
        "تولید خودکار B-roll متناسب با صدا",
        "مقایسه زمان ادیت از ۴ ساعت به ۱۵ دقیقه",
      ],
      cta: "لینک این ابزار رو برات توی کامنت اول پین کردم، حتماً سابسکرایب کن!",
    },
    {
      id: "idea-demo-2",
      title: "۵ اشتباه مرگبار در یوتیوب که مانع مانیتایز شدن کانالت میشه",
      hook: "چرا با اینکه ۱۰۰ تا ویدیو گذاشتی هنوز به ۴۰۰۰ ساعت واچ‌تایم نرسیدی؟",
      format: "Long-form",
      targetAudience: "کانال‌های زیر ۱۰۰۰ سابسکرایبر",
      viralScore: 89,
      keyTalkingPoints: [
        "ضعف ریتنشن در ۳۰ ثانیه ابتدایی ویدیو",
        "نامفهوم بودن تامبنیل در صفحه موبایل",
        "نداشتن ساختار قلاب باز برای واچ‌تایم مداوم",
      ],
      cta: "چک‌لیست کامل این ۵ مورد رو می‌تونی با دانلود راهنمای رایگان ما بررسی کنی.",
    },
  ]);

  const [savedIdeas, setSavedIdeas] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_IDEAS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          topic,
          targetAudience,
          format,
          language: settings.language,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate content ideas.");
      }

      const data = await res.json();
      if (data.ideas && Array.isArray(data.ideas) && data.ideas.length > 0) {
        setIdeas(data.ideas);
      } else {
        throw new Error("Empty response received.");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          (settings.language === "fa"
            ? "خطا در تولید ایده. لطفاً ورودی‌ها و اتصال را بررسی کنید."
            : "Failed to generate ideas. Please check connection and try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id: string) => {
    let next: string[];
    if (savedIdeas.includes(id)) {
      next = savedIdeas.filter((item) => item !== id);
    } else {
      next = [...savedIdeas, id];
    }
    setSavedIdeas(next);
    localStorage.setItem(SAVED_IDEAS_KEY, JSON.stringify(next));
  };

  const copyIdea = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>VIRAL IDEA ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Form Input Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {t.nicheLabel}
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {t.topicLabel}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {t.audienceLabel}
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {t.formatLabel}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
            >
              <option value="Both">{t.bothFormats}</option>
              <option value="Shorts">{t.shortsOnly}</option>
              <option value="Long-form">{t.longFormOnly}</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? common.loading : t.generateBtn}</span>
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400 p-3 rounded-lg bg-red-950/40 border border-red-800">
            {error}
          </p>
        )}
      </div>

      {/* Generated Ideas Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>{settings.language === "fa" ? "ایده‌های پیشنهادی" : "Generated Ideas"}</span>
          <span className="text-xs font-normal text-slate-400">({ideas.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ideas.map((item) => {
            const isSaved = savedIdeas.includes(item.id);
            const ideaSummary = `Title: ${item.title}\nHook: ${item.hook}\nFormat: ${item.format}\nPoints:\n- ${item.keyTalkingPoints.join("\n- ")}\nCTA: ${item.cta}`;

            return (
              <div
                key={item.id}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 hover:border-slate-700 shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          item.format === "Shorts"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {item.format}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <TrendingUp className="w-3 h-3" />
                        <span>Score: {item.viralScore || 90}/100</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyIdea(item.id, ideaSummary)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title={common.copy}
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleSave(item.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-400"
                        }`}
                        title={t.saveIdea}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-white text-base leading-snug mb-3">
                    {item.title}
                  </h3>

                  {/* Hook Box */}
                  <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80 mb-3">
                    <p className="text-[11px] font-bold text-amber-400 uppercase mb-1">
                      {settings.language === "fa" ? "قلاب طلایی ۳ ثانیه اول (Hook):" : "3-Second Opening Hook:"}
                    </p>
                    <p className="text-xs text-slate-200 italic">"{item.hook}"</p>
                  </div>

                  {/* Key points */}
                  <div className="space-y-1 mb-3">
                    <p className="text-[11px] font-semibold text-slate-400">
                      {t.keyPoints}:
                    </p>
                    <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                      {item.keyTalkingPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA footer */}
                <div className="pt-3 border-t border-slate-800/80 mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{t.cta}:</span>
                  <span className="text-cyan-300 font-medium truncate max-w-[70%]">
                    {item.cta}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
