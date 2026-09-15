import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Video,
  Eye,
  Mic,
  Tag,
  Share2,
} from "lucide-react";
import { ScriptPackage, UserSettings } from "../types";
import { translations } from "../locales";

interface HooksScriptsViewProps {
  settings: UserSettings;
}

const SAVED_SCRIPTS_KEY = "creatorflow_saved_scripts";

export const HooksScriptsView: React.FC<HooksScriptsViewProps> = ({ settings }) => {
  const t = translations[settings.language].scripts;
  const common = translations[settings.language].common;

  const [title, setTitle] = useState("راز ۴۰۰۰ ساعت واچ‌تایم یوتیوب در ۳۰ روز");
  const [topic, setTopic] = useState("روش‌های مهندسی ریتنشن و نگه‌داشتن بیننده تا ثانیه آخر ویدیو");
  const [videoType, setVideoType] = useState("YouTube Video (Long-form)");
  const [tone, setTone] = useState("پرانرژی، معتبر و آموزشی");
  const [duration, setDuration] = useState("۵ دقیقه");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const [scriptData, setScriptData] = useState<ScriptPackage>({
    id: "script-demo-1",
    title: "راز ۴۰۰۰ ساعت واچ‌تایم یوتیوب در ۳۰ روز",
    topic: "روش‌های مهندسی ریتنشن و نگه‌داشتن بیننده تا ثانیه آخر ویدیو",
    videoType: "YouTube Video",
    tone: "آموزشی و پرانرژی",
    duration: "5 دقیقه",
    optimizedTitles: [
      "چرا ویدیوهای شما واچ‌تایم نمی‌گیرند؟ (فرمول ۴۰۰۰ ساعت)",
      "راز ریتنشن ۷۰٪ که یوتیوبرهای بزرگ به شما نمی‌گویند",
      "از ۰ تا ۴۰۰۰ ساعت واچ‌تایم یوتیوب: استراتژی تضمینی ۲۰۲۶",
    ],
    hooks: [
      {
        type: "شکاف کنجکاوی (Curiosity Gap)",
        script: "اگه الگوریتم یوتیوب فقط بر اساس یک معیار تصمیم بگیره ویدیوت رو به ۱۰۰ هزار نفر نشون بده یا صفر نفر، اون معیار سابسکرایب نیست، واچ‌تایمه!",
      },
      {
        type: "رویکرد معکوس و شوکه‌کننده (Contrarian)",
        script: "تمام این ویدیوهایی که می‌گن تامبنیل مهم‌ترین چیزه دارن نصف واقعیت رو مخفی می‌کنن. بهترین تامبنیل بدون ریتنشن، کانالت رو نابود می‌کنه.",
      },
      {
        type: "داستانی و حل مسئله (Story/Problem)",
        script: "سه ماه پیش کانالی داشتم که بازدیدهاش روی ۲۰ تا گیر کرده بود. با اعمال این ۳ تغییر در ثانیه‌های اول، به مرز مانیتایز رسیدم.",
      },
    ],
    fullScript: {
      hook: "اگه الگوریتم یوتیوب فقط بر اساس یک معیار تصمیم بگیره ویدیوت رو وایرال کنه، اون معیار فقط واچ‌تایمه!",
      intro: "سلام به همه، توی این ویدیو می‌خوام نقشه راه واقعی رسیدن به ۴۰۰۰ ساعت واچ‌تایم رو بدون خرید ویو یا روش‌های فیک بهتون نشون بدم.",
      sections: [
        {
          heading: "بخش ۱: قانون ۳۰ ثانیه مرگبار",
          voiceover: "بیش از ۶۰ درصد مخاطبان در ۳۰ ثانیه ابتدایی ویدیو را ترک می‌کنند. برای جلوگیری از این ریزش، باید بلافاصله وعده‌ای که در تامبنیل دادید را تأیید کنید و از اینتروهای طولانی خودداری نمایید.",
          visualCue: "نمودار افت ریتنشن یوتیوب استودیو روی صفحه با افکت زوم سریع",
        },
        {
          heading: "بخش ۲: حلقه‌های باز (Open Loops)",
          voiceover: "قبل از پاسخ به سوال اول، سوال بزرگ‌تری را مطرح کنید تا مغز مخاطب مجبور شود تا پایان ویدیو همراه شما بماند.",
          visualCue: "کات به تصویر گوینده + نمایش متنی عنوان نکته کلیدی با موشن گرافیک",
        },
        {
          heading: "بخش ۳: ریتم کات‌ها و B-Roll هدفمند",
          voiceover: "هیچ پلانی نباید بیشتر از ۴ الی ۶ ثانیه ثابت بماند. تغییر زاویه دوربین یا اضافه کردن افکت صوتی باعث فعال ماندن تمرکز مغز می‌شود.",
          visualCue: "نمایش مقایسه قبل و بعد تدوین بدون B-roll و همراه با B-roll",
        },
      ],
      climax: "با ترکیب این ۳ تاکتیک، میانگین واچ‌تایم هر ویدیوی شما حداقل ۲ برابر افزایش پیدا می‌کند.",
      cta: "اگر می‌خوای کانالت امسال مانیتایز بشه، دکمه سابسکرایب رو بزن و ویدیوی بعدی من درباره سئو رو ببین.",
    },
    descriptionSEO: "در این ویدیو کامل‌ترین استراتژی رسیدن به ۴۰۰۰ ساعت واچ‌تایم یوتیوب و شرایط مانیتایز را آموزش داده‌ایم.\n\nتایم‌کدها:\n0:00 - هوک طلایی\n0:30 - اشتباهات اینترو\n1:45 - قانون ۳۰ ثانیه اول\n3:10 - تکنیک حلقه‌های باز\n4:30 - جمع‌بندی و CTA",
    tags: ["یوتیوب", "مانیتایز یوتیوب", "واچ تایم", "افزایش بازدید یوتیوب", "آموزش یوتیوب فارسی", "الگوریتم یوتیوب"],
  });

  const handleGenerateScript = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          topic,
          videoType,
          tone,
          duration,
          language: settings.language,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate script.");
      }

      const data = await res.json();
      if (data.result) {
        setScriptData({
          id: "script-" + Date.now(),
          title,
          topic,
          videoType,
          tone,
          duration,
          optimizedTitles: data.result.optimizedTitles || [],
          hooks: data.result.hooks || [],
          fullScript: data.result.fullScript || {
            hook: "",
            intro: "",
            sections: [],
            climax: "",
            cta: "",
          },
          descriptionSEO: data.result.descriptionSEO || "",
          tags: data.result.tags || [],
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          (settings.language === "fa"
            ? "خطا در تولید فیلم‌نامه. لطفاً بررسی و مجدداً تلاش کنید."
            : "Failed to generate script.")
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = (sectionKey: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSaveToLibrary = () => {
    try {
      const saved = localStorage.getItem(SAVED_SCRIPTS_KEY);
      const list = saved ? JSON.parse(saved) : [];
      list.push({ ...scriptData, savedAt: Date.now() });
      localStorage.setItem(SAVED_SCRIPTS_KEY, JSON.stringify(list));
      alert(settings.language === "fa" ? "فیلم‌نامه با موفقیت در آرشیو ذخیره شد." : "Script saved to library.");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20">
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span>HIGH-RETENTION SCRIPT ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Input Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {t.videoTitleLabel}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 md:col-span-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                قالب ویدیو
              </label>
              <select
                value={videoType}
                onChange={(e) => setVideoType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
              >
                <option value="YouTube Long-form">YouTube Long-form</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="Instagram Reel">Instagram Reel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {t.toneLabel}
              </label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {t.durationLabel}
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleGenerateScript}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all"
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

      {/* Output Results */}
      {scriptData && (
        <div className="space-y-6">
          {/* Action buttons bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {scriptData.title}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToLibrary}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
              >
                <Bookmark className="w-4 h-4 text-purple-400" />
                <span>{t.saveScript}</span>
              </button>
            </div>
          </div>

          {/* Optimized Titles */}
          {scriptData.optimizedTitles.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                گزینه‌های عنوان با نرخ کلیک (CTR) بالا:
              </h3>
              <div className="space-y-2">
                {scriptData.optimizedTitles.map((tItem, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-200"
                  >
                    <span>{tItem}</span>
                    <button
                      onClick={() => copyText(`title-${idx}`, tItem)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      {copiedSection === `title-${idx}` ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hooks Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{t.hookOptions}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scriptData.hooks.map((hook, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {hook.type}
                    </span>
                    <p className="text-xs text-slate-300 italic mt-3 leading-relaxed">
                      "{hook.script}"
                    </p>
                  </div>
                  <button
                    onClick={() => copyText(`hook-${idx}`, hook.script)}
                    className="mt-3 text-xs flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    {copiedSection === `hook-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>کپی هوک</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Full Narrative Script */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-400" />
                <span>{t.fullScriptTitle}</span>
              </h3>
              <button
                onClick={() => {
                  const fullText = `[TITLE]: ${scriptData.title}\n[HOOK]: ${scriptData.fullScript.hook}\n[INTRO]: ${scriptData.fullScript.intro}\n\n${scriptData.fullScript.sections.map((s) => `[${s.heading}]\nVoiceover: ${s.voiceover}\nVisual B-roll: ${s.visualCue}`).join("\n\n")}\n\n[CLIMAX]: ${scriptData.fullScript.climax}\n[CTA]: ${scriptData.fullScript.cta}`;
                  copyText("all-script", fullText);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
              >
                {copiedSection === "all-script" ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{t.copyScript}</span>
              </button>
            </div>

            {/* Hook & Intro */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  قلاب اجرایی (Hook):
                </span>
                <p className="text-sm text-slate-200 mt-1">
                  {scriptData.fullScript.hook}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-bold text-cyan-400 uppercase">
                  مقدمه و تعهد ویدیو (Intro):
                </span>
                <p className="text-sm text-slate-200 mt-1">
                  {scriptData.fullScript.intro}
                </p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {scriptData.fullScript.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-950/80 p-4 border border-slate-800/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {sec.heading}
                    </span>
                    <button
                      onClick={() => copyText(`sec-${idx}`, sec.voiceover)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      {copiedSection === `sec-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Mic className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-400">
                        متن گوینده (Voiceover):
                      </span>{" "}
                      {sec.voiceover}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-cyan-300/90 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-900/40">
                    <Eye className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-cyan-400">
                        راهنمای بصری و B-Roll:
                      </span>{" "}
                      {sec.visualCue}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Climax & CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-bold text-purple-400 uppercase">
                  نقطه اوج (Climax):
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  {scriptData.fullScript.climax}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase">
                  کال تو اکشن پایانی (CTA):
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  {scriptData.fullScript.cta}
                </p>
              </div>
            </div>
          </div>

          {/* Description & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase">
                  {t.seoDescription}
                </span>
                <button
                  onClick={() => copyText("desc", scriptData.descriptionSEO)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedSection === "desc" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>کپی</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={5}
                value={scriptData.descriptionSEO}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.tags}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {scriptData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
