import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Filter,
} from "lucide-react";
import { PlannerItem, PlannerStage, UserSettings } from "../types";
import { INITIAL_PLANNER_ITEMS } from "../data";
import { translations } from "../locales";

interface PlannerViewProps {
  settings: UserSettings;
}

const STORAGE_KEY = "creatorflow_planner_items";

export const PlannerView: React.FC<PlannerViewProps> = ({ settings }) => {
  const t = translations[settings.language].planner;
  const common = translations[settings.language].common;

  const [items, setItems] = useState<PlannerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PLANNER_ITEMS;
  });

  const [filterPlatform, setFilterPlatform] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [newTitle, setNewTitle] = useState("");
  const [newPlatform, setNewPlatform] = useState<PlannerItem["platform"]>("YouTube Long");
  const [newStage, setNewStage] = useState<PlannerStage>("Idea");
  const [newDueDate, setNewDueDate] = useState("2026-09-30");
  const [newPriority, setNewPriority] = useState<PlannerItem["priority"]>("High");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const stages: PlannerStage[] = [
    "Idea",
    "Scripting",
    "Recording",
    "Editing",
    "Thumbnail",
    "Ready",
    "Published",
  ];

  const stageLabels: Record<PlannerStage, string> = {
    Idea: t.columns.idea,
    Scripting: t.columns.scripting,
    Recording: t.columns.recording,
    Editing: t.columns.editing,
    Thumbnail: t.columns.thumbnail,
    Ready: t.columns.ready,
    Published: t.columns.published,
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: PlannerItem = {
      id: "plan-" + Date.now(),
      title: newTitle.trim(),
      platform: newPlatform,
      stage: newStage,
      dueDate: newDueDate,
      priority: newPriority,
      notes: newNotes,
    };

    setItems((prev) => [newItem, ...prev]);
    setNewTitle("");
    setNewNotes("");
    setShowAddModal(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleMoveStage = (id: string, direction: "next" | "prev") => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const curIdx = stages.indexOf(item.stage);
        const nextIdx =
          direction === "next"
            ? Math.min(stages.length - 1, curIdx + 1)
            : Math.max(0, curIdx - 1);
        return { ...item, stage: stages[nextIdx] };
      })
    );
  };

  const filteredItems =
    filterPlatform === "All"
      ? items
      : items.filter((i) => i.platform === filterPlatform);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
            <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>CONTENT WORKFLOW PIPELINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.title}
          </h1>
          <p className="text-slate-400 text-sm">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNew}</span>
          </button>
        </div>
      </div>

      {/* Pipeline Stages Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageItems = filteredItems.filter((i) => i.stage === stage);
          return (
            <div
              key={stage}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 flex flex-col min-w-[220px]"
            >
              {/* Stage Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                <span className="text-xs font-bold text-white">
                  {stageLabels[stage]}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {stageItems.length}
                </span>
              </div>

              {/* Items in stage */}
              <div className="space-y-2.5 flex-1">
                {stageItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-slate-950 border border-slate-800/90 p-3 space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                          item.priority === "High"
                            ? "bg-red-500/20 text-red-300"
                            : item.priority === "Medium"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {item.priority}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="text-indigo-300 font-medium">
                        {item.platform}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{item.dueDate}</span>
                      </div>
                    </div>

                    {/* Move controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                      <button
                        disabled={stages.indexOf(item.stage) === 0}
                        onClick={() => handleMoveStage(item.id, "prev")}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move to previous stage"
                      >
                        <ArrowLeft className="w-3 h-3 rtl:rotate-180" />
                      </button>
                      <span className="text-[10px] text-slate-500">
                        {stages.indexOf(item.stage) + 1}/{stages.length}
                      </span>
                      <button
                        disabled={
                          stages.indexOf(item.stage) === stages.length - 1
                        }
                        onClick={() => handleMoveStage(item.id, "next")}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move to next stage"
                      >
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                ))}

                {stageItems.length === 0 && (
                  <div className="h-20 flex items-center justify-center text-[11px] text-slate-600 border border-dashed border-slate-800/80 rounded-xl">
                    آیتمی نیست
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">{t.addNew}</h3>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.titleInput}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.platformInput}
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) =>
                      setNewPlatform(e.target.value as PlannerItem["platform"])
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="YouTube Long">YouTube Long-form</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="Instagram Story">Instagram Story</option>
                    <option value="Multi-platform">Multi-platform</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    مرحله اولیه
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) =>
                      setNewStage(e.target.value as PlannerStage)
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {stageLabels[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.dateInput}
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    اولویت
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) =>
                      setNewPriority(e.target.value as PlannerItem["priority"])
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="High">بالا (High)</option>
                    <option value="Medium">متوسط (Medium)</option>
                    <option value="Low">پایین (Low)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  یادداشت
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
                >
                  {t.addCard}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
