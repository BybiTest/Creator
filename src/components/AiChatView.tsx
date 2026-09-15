import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { ChatMessage, UserSettings } from "../types";
import { translations } from "../locales";

interface AiChatViewProps {
  settings: UserSettings;
}

const STORAGE_KEY = "creatorflow_chat_history";

export const AiChatView: React.FC<AiChatViewProps> = ({ settings }) => {
  const t = translations[settings.language].aiChat;
  const common = translations[settings.language].common;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "msg-welcome",
        role: "assistant",
        content:
          settings.language === "fa"
            ? "سلام! من دستیار هوشمند CreatorFlow هستم؛ متخصص رشد کانال یوتیوب، مهندسی هوک‌های ویروسی، نگارش فیلم‌نامه و مانیتایز. چه کمکی برای ویدیوی بعدی یا استراتژی کانالت می‌خواهی؟"
            : "Hello! I am your native CreatorFlow AI strategist. Trained in YouTube algorithms, retention hooks, script pacing, and monetization. How can I assist with your next viral video or channel today?",
        timestamp: Date.now(),
      },
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      // Context management: if history is long, keep recent 12 messages to keep prompt focused
      const contextToSend = newHistory.slice(-12).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: contextToSend,
          language: settings.language,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to reach AI server.");
      }

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        role: "assistant",
        content: data.reply || "No response received.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          (settings.language === "fa"
            ? "خطا در برقراری ارتباط با هوش مصنوعی. لطفاً اینترنت و کلید API را بررسی کنید."
            : "Connection error. Please check your network and Gemini API key.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(settings.language === "fa" ? "آیا مایل به پاکسازی کل تاریخچه چت هستید؟" : "Clear entire conversation history?")) {
      const resetMsg: ChatMessage[] = [
        {
          id: "msg-welcome",
          role: "assistant",
          content:
            settings.language === "fa"
              ? "تاریخچه پاک شد. موضوع جدیدی برای تولید محتوا دارید؟"
              : "Chat reset. What would you like to create or plan next?",
          timestamp: Date.now(),
        },
      ];
      setMessages(resetMsg);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRetryLast = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-sm sm:text-base">
                {t.title}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE GEMINI 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            title={t.clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.newChat}</span>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-slate-800 text-cyan-400 border border-slate-700"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`relative group max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-tr-none"
                    : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none whitespace-pre-wrap shadow-sm"
                }`}
              >
                <div>{m.content}</div>

                {/* Copy button */}
                <button
                  onClick={() => handleCopy(m.id, m.content)}
                  title={t.copy}
                  className={`absolute top-2 ${
                    isUser ? "left-2" : "right-2"
                  } opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-slate-900/60 hover:bg-slate-900 text-slate-300 transition-opacity`}
                >
                  {copiedId === m.id ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-none p-4 text-xs text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>{t.typing}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={handleRetryLast}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-900/50 hover:bg-red-800/50 text-red-200 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.retry}</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset suggestions pills */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 whitespace-nowrap">
            {t.presetsTitle}
          </span>
          {t.presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(preset)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
            <span className="hidden sm:inline">{t.send}</span>
          </button>
        </form>
        <p className="text-[11px] text-slate-500 mt-2 text-center">
          {t.contextNotice}
        </p>
      </div>
    </div>
  );
};
