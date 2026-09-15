import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Download,
  Crown,
  Type,
  Palette,
  Sparkles,
  Layers,
  Check,
} from "lucide-react";
import { ThumbnailTemplate, UserSettings } from "../types";
import { INITIAL_THUMBNAILS } from "../data";
import { translations } from "../locales";

interface ThumbnailStudioViewProps {
  settings: UserSettings;
  onOpenVip: () => void;
}

export const ThumbnailStudioView: React.FC<ThumbnailStudioViewProps> = ({
  settings,
  onOpenVip,
}) => {
  const t = translations[settings.language].thumbnail;
  const common = translations[settings.language].common;

  const [templates] = useState<ThumbnailTemplate[]>(INITIAL_THUMBNAILS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [currentTemplate, setCurrentTemplate] = useState<ThumbnailTemplate>(
    INITIAL_THUMBNAILS[0]
  );
  const [headline, setHeadline] = useState(currentTemplate.headline);
  const [subheadline, setSubheadline] = useState(currentTemplate.subheadline);
  const [badge, setBadge] = useState(currentTemplate.badge);
  const [fontColor, setFontColor] = useState("#FACC15");
  const [accentColor, setAccentColor] = useState("#38BDF8");
  const [bgScheme, setBgScheme] = useState("dark-blue");
  const [fontSize, setFontSize] = useState<number>(56);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const categories = [
    "All",
    "Tech",
    "Gaming",
    "Finance",
    "Education",
    "Podcast",
    "Review",
  ];

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((tpl) => tpl.category === selectedCategory);

  // Render on canvas whenever properties change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions: 1280 x 720 (16:9 YouTube Standard)
    canvas.width = 1280;
    canvas.height = 720;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
    if (bgScheme === "dark-blue") {
      gradient.addColorStop(0, "#0F172A");
      gradient.addColorStop(0.5, "#1E1B4B");
      gradient.addColorStop(1, "#1E3A8A");
    } else if (bgScheme === "purple-neon") {
      gradient.addColorStop(0, "#180D2B");
      gradient.addColorStop(0.5, "#4A044E");
      gradient.addColorStop(1, "#09090B");
    } else if (bgScheme === "emerald-gold") {
      gradient.addColorStop(0, "#022C22");
      gradient.addColorStop(0.5, "#064E3B");
      gradient.addColorStop(1, "#0F172A");
    } else {
      gradient.addColorStop(0, "#18181B");
      gradient.addColorStop(0.5, "#450A0A");
      gradient.addColorStop(1, "#09090B");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 720);

    // Subtle background mesh glow circles
    ctx.save();
    ctx.filter = "blur(60px)";
    ctx.fillStyle = accentColor + "33"; // 20% opacity
    ctx.beginPath();
    ctx.arc(200, 200, 250, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = fontColor + "22";
    ctx.beginPath();
    ctx.arc(1000, 500, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Geometric border accent
    ctx.strokeStyle = accentColor + "66";
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, 1280 - 48, 720 - 48);

    // Draw Badge Box if present
    if (badge) {
      ctx.save();
      const badgeText = badge.toUpperCase();
      ctx.font = "bold 32px 'Plus Jakarta Sans', 'Vazirmatn', sans-serif";
      const badgeWidth = ctx.measureText(badgeText).width + 48;
      const badgeHeight = 56;
      const badgeX = 64;
      const badgeY = 64;

      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 12);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(badgeText, badgeX + 24, badgeY + badgeHeight / 2 + 2);
      ctx.restore();
    }

    // Draw Main Headline with Drop Shadow and Stroke
    ctx.save();
    ctx.font = `900 ${fontSize}px 'Plus Jakarta Sans', 'Vazirmatn', sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    // Text Shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;

    // Stroke for high contrast readability
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 10;
    ctx.strokeText(headline, 64, 180);

    // Fill
    ctx.fillStyle = fontColor;
    ctx.fillText(headline, 64, 180);
    ctx.restore();

    // Draw Subheadline
    if (subheadline) {
      ctx.save();
      ctx.font = "700 38px 'Plus Jakarta Sans', 'Vazirmatn', sans-serif";
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(subheadline, 64, 300);
      ctx.restore();
    }

    // YouTube Play Watermark / Logo simulation
    // Brand App Icon Badge
    const iconImg = new Image();
    iconImg.src = settings.customAppIcon || "/app-icon.png";
    iconImg.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(1100, 60, 90, 90, 20);
      ctx.clip();
      ctx.drawImage(iconImg, 1100, 60, 90, 90);
      ctx.restore();
    };

    // High CTR "100%" or "4K" stamp in corner
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(1020, 600, 180, 56, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("4K ULTRA", 1110, 638);
    ctx.restore();
  }, [headline, subheadline, badge, fontColor, accentColor, bgScheme, fontSize]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `creatorflow-thumbnail-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleSelectTemplate = (tpl: ThumbnailTemplate) => {
    if (tpl.isVIP && !settings.vipStatus) {
      onOpenVip();
      return;
    }
    setCurrentTemplate(tpl);
    setHeadline(tpl.headline);
    setSubheadline(tpl.subheadline);
    setBadge(tpl.badge);
    setAccentColor(tpl.accentColor);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-300 text-xs font-semibold border border-red-500/20">
          <ImageIcon className="w-3.5 h-3.5 text-red-400" />
          <span>YOUTUBE 16:9 THUMBNAIL STUDIO</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.title}
        </h1>
        <p className="text-slate-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              selectedCategory === cat
                ? "bg-red-500 text-white shadow-md shadow-red-500/20 font-bold"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Canvas View (Left/Top) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-2 sm:p-4 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full rounded-xl object-contain shadow-lg"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>{t.previewSize}</span>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadPng}</span>
            </button>
          </div>
        </div>

        {/* Customization Controls (Right/Bottom) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-5 shadow-xl">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Palette className="w-4 h-4 text-red-400" />
            <span>{t.editorHeading}</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.changeText}
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.changeSubtext}
              </label>
              <input
                type="text"
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.changeBadge}
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t.textColor}
                </label>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-full h-9 rounded-lg bg-slate-950 border border-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {t.accentColor}
                </label>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full h-9 rounded-lg bg-slate-950 border border-slate-700 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                طرح پس‌زمینه (Background)
              </label>
              <select
                value={bgScheme}
                onChange={(e) => setBgScheme(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
              >
                <option value="dark-blue">Midnight Deep Blue</option>
                <option value="purple-neon">Cyberpunk Purple Neon</option>
                <option value="emerald-gold">Emerald Business & Finance</option>
                <option value="dramatic-red">High-Stakes Dramatic Red</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>اندازه فونت عنوان</span>
                <span>{fontSize}px</span>
              </div>
              <input
                type="range"
                min={36}
                max={72}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preset Templates Carousel */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-red-400" />
          <span>قالب‌های آماده با نرخ کلیک بالا (High-CTR Templates)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                currentTemplate.id === tpl.id
                  ? "border-red-500 bg-slate-850 shadow-md"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              {tpl.isVIP && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>VIP</span>
                </div>
              )}
              <span className="text-xs text-slate-400 font-semibold">
                {tpl.category}
              </span>
              <h4 className="font-bold text-white text-sm mt-1">{tpl.title}</h4>
              <p className="text-xs text-slate-400 mt-2 line-clamp-1">
                "{tpl.headline}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
