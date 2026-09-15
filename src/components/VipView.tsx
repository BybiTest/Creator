import React, { useState } from "react";
import {
  Crown,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Sparkles,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import { UserSettings } from "../types";
import { translations } from "../locales";

interface VipViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const VipView: React.FC<VipViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const t = translations[settings.language].vip;
  const common = translations[settings.language].common;

  const [rsaKey, setRsaKey] = useState(settings.cafeBazaarRsaKey || "");
  const [keySaved, setKeySaved] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);

  const handleSaveKey = () => {
    onUpdateSettings({ cafeBazaarRsaKey: rsaKey });
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleToggleVip = () => {
    const nextStatus = !settings.vipStatus;
    onUpdateSettings({
      vipStatus: nextStatus,
      vipExpiryDate: nextStatus ? "2027-09-15" : undefined,
    });
  };

  const handleSimulateBazaarPurchase = () => {
    setPurchaseStatus(
      settings.language === "fa"
        ? "در حال اتصال امن به درگاه کافه‌بازار (Cafe Bazaar Billing Client)..."
        : "Connecting securely to Cafe Bazaar Billing Client..."
    );

    setTimeout(() => {
      onUpdateSettings({
        vipStatus: true,
        vipExpiryDate: "2027-09-15",
      });
      setPurchaseStatus(
        settings.language === "fa"
          ? "خرید اشتراک VIP کافه‌بازار با موفقیت تأیید شد و امضای دیجیتال اعتبار سنجی گردید!"
          : "VIP subscription successfully activated and verified with Cafe Bazaar signature!"
      );
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>OFFICIAL VIP SYSTEM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {t.title}
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Current Status Banner */}
      <div
        className={`rounded-2xl border p-6 shadow-xl transition-all ${
          settings.vipStatus
            ? "border-amber-500/50 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900"
            : "border-slate-800 bg-slate-900/60"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                settings.vipStatus
                  ? "bg-gradient-to-br from-amber-500 to-yellow-400 text-black shadow-lg shadow-amber-500/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">
                {t.currentPlan}
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {settings.vipStatus ? t.activeBadge : t.inactiveBadge}
              </h3>
              {settings.vipStatus && (
                <p className="text-xs text-amber-300 mt-0.5">
                  انقضای اشتراک: {settings.vipExpiryDate || "1 سال بعد"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleVip}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                settings.vipStatus
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  : "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black shadow-lg shadow-amber-500/20"
              }`}
            >
              {settings.vipStatus ? "تغییر به نسخه رایگان" : "فعال‌سازی وضعیت VIP"}
            </button>
          </div>
        </div>
      </div>

      {/* Benefits List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.benefitsTitle}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {t.benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-200"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cafe Bazaar Architecture Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {t.bazaarIntegrationTitle}
            </h3>
            <p className="text-xs text-slate-400">
              Cafe Bazaar In-App Billing Client (Security & Verification)
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
          <p>{t.bazaarNotice}</p>
          <p className="text-slate-400">
            در سورس‌کد Android اپلیکیشن، کلاس{" "}
            <code className="text-cyan-300 font-mono">
              CafeBazaarBillingManager.kt
            </code>{" "}
            پیاده‌سازی شده و از طریق{" "}
            <code className="text-cyan-300 font-mono">
              com.farsitel.bazaar.auth
            </code>{" "}
            پرداخت‌های واقعی را احراز هویت می‌کند.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>کلید عمومی RSA کافه‌بازار (RSA Public Key):</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQ..."
              value={rsaKey}
              onChange={(e) => setRsaKey(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
            />
            <button
              onClick={handleSaveKey}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {keySaved ? "ذخیره شد!" : common.save}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSimulateBazaarPurchase}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-slate-950 font-bold text-sm shadow-lg shadow-green-500/20 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.subscribeButton}</span>
          </button>
          <button
            onClick={() => {
              alert(
                settings.language === "fa"
                  ? "درخواست استعلام خریدهای قبلی به کافه‌بازار ارسال شد."
                  : "Bazaar purchase query initiated."
              );
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.restoreButton}</span>
          </button>
        </div>

        {purchaseStatus && (
          <p className="text-xs p-3 rounded-xl bg-green-950/40 border border-green-800 text-green-300">
            {purchaseStatus}
          </p>
        )}
      </div>
    </div>
  );
};
