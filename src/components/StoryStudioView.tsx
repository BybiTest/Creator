import React, { useState, useRef, useEffect } from "react";
import {
  Instagram,
  Download,
  Crown,
  Type,
  Palette,
  Sparkles,
  Layers,
} from "lucide-react";
import { StoryTemplate, UserSettings } from "../types";
import { INITIAL_STORIES } from "../data";
import { translations } from "../locales";

interface StoryStudioViewProps {
  settings: UserSettings;
  onOpenVip: () => void;
}

export const StoryStudioView: React.FC<StoryStudioViewProps> = ({
  settings,
  onOpenVip,
}) => {
  const t = translations[settings.language].story;
  const common = translations[settings.language].common;

  const [templates] = useState<StoryTemplate[]>(INITIAL_STORIES);
  const [currentTemplate, setCurrentTemplate] = useState<StoryTemplate>(
    INITIAL_STORIES[0]
  );

  const [headline, setHeadline] = useState(currentTemplate.headline);
  const [bodyText, setBodyText] = useState(currentTemplate.bodyText);
  const [stickerText, setStickerText] = useState(currentTemplate.stickerText);
  const [buttonText, setButtonText] = useState(currentTemplate.buttonText);
  const [bgStyle, setBgStyle] = useState("gradient-neon");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 9:16 Standard Instagram Story Resolution: 1080 x 1920
    canvas.width = 1080;
    canvas.height = 1920;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    if (bgStyle === "gradient-neon") {
      gradient.addColorStop(0, "#4C0519");
      gradient.addColorStop(0.5, "#831843");
      gradient.addColorStop(1, "#0F172A");
    } else if (bgStyle === "midnight-cyan") {
      gradient.addColorStop(0, "#082F49");
      gradient.addColorStop(0.5, "#0E7490");
      gradient.addColorStop(1, "#0F172A");
    } else {
      gradient.addColorStop(0, "#451A03");
      gradient.addColorStop(0.5, "#9A3412");
      gradient.addColorStop(1, "#18181B");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Instagram top profile bar mockup
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(40, 40, 1000, 8); // story progress line

    // Profile avatar with official app icon
    const storyAvatar = new Image();
    storyAvatar.src = settings.customAppIcon || "/app-icon.png";
    storyAvatar.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(80, 100, 36, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(storyAvatar, 44, 64, 72, 72);
      ctx.restore();
    };

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("CreatorFlow Official", 136, 112);
    ctx.restore();

    // Central Floating Sticker
    if (stickerText) {
      ctx.save();
      ctx.fillStyle = "#E11D48";
      ctx.shadowColor = "rgba(225, 29, 72, 0.6)";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.roundRect(140, 360, 800, 120, 30);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 44px 'Plus Jakarta Sans', 'Vazirmatn', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(stickerText, 540, 436);
      ctx.restore();
    }

    // Main Headline
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 72px 'Plus Jakarta Sans', 'Vazirmatn', sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 25;

    // Wrap headline
    const words = headline.split(" ");
    let line = "";
    let y = 640;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      if (ctx.measureText(testLine).width > 880 && i > 0) {
        ctx.fillText(line, 540, y);
        line = words[i] + " ";
        y += 96;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 540, y);
    ctx.restore();

    // Body Text Card
    if (bodyText) {
      ctx.save();
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(100, 1020, 880, 360, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#E2E8F0";
      ctx.font = "500 40px 'Plus Jakarta Sans', 'Vazirmatn', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(bodyText, 540, 1210);
      ctx.restore();
    }

    // Swipe Up / Clickable CTA Button
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(200, 1540, 680, 130, 65);
    ctx.fill();

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 44px 'Plus Jakarta Sans', 'Vazirmatn', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(buttonText, 540, 1622);
    ctx.restore();
  }, [headline, bodyText, stickerText, buttonText, bgStyle]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `creatorflow-story-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleSelectTemplate = (tpl: StoryTemplate) => {
    if (tpl.isVIP && !settings.vipStatus) {
      onOpenVip();
      return;
    }
    setCurrentTemplate(tpl);
    setHeadline(tpl.headline);
    setBodyText(tpl.bodyText);
    setStickerText(tpl.stickerText);
    setButtonText(tpl.buttonText);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 text-xs font-semibold border border-pink-500/20">
          <Instagram className="w-3.5 h-3.5 text-pink-400" />
          <span>INSTAGRAM STORY STUDIO (9:16)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Story Canvas Preview (Left) */}
        <div className="lg:col-span-6 flex flex-col items-center space-y-4">
          <div className="w-full max-w-[340px] aspect-[9/16] rounded-3xl border-4 border-slate-700 bg-slate-950 p-2 shadow-2xl overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full rounded-2xl object-contain shadow-md"
            />
          </div>

          <div className="flex items-center justify-between w-full max-w-[340px] text-xs text-slate-400">
            <span>{t.previewSize}</span>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadPng}</span>
            </button>
          </div>
        </div>

        {/* Controls (Right) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-5 shadow-xl">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Palette className="w-4 h-4 text-pink-400" />
            <span>{t.editorHeading}</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.headline}
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.bodyText}
              </label>
              <textarea
                rows={3}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.stickerText}
                </label>
                <input
                  type="text"
                  value={stickerText}
                  onChange={(e) => setStickerText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.buttonText}
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                رنگ‌بندی پس‌زمینه
              </label>
              <select
                value={bgStyle}
                onChange={(e) => setBgStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-pink-500 focus:outline-none"
              >
                <option value="gradient-neon">Hot Neon & Berry</option>
                <option value="midnight-cyan">Midnight Electric Cyan</option>
                <option value="warm-amber">Warm Amber & Gold</option>
              </select>
            </div>
          </div>

          {/* Quick template selection */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400">
              تمپلیت‌های آماده استوری:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-2.5 rounded-xl border text-left rtl:text-right transition-all ${
                    currentTemplate.id === tpl.id
                      ? "border-pink-500 bg-slate-850"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                  }`}
                >
                  <p className="text-xs font-bold text-white truncate">
                    {tpl.title}
                  </p>
                  <p className="text-[10px] text-slate-400">{tpl.category}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
