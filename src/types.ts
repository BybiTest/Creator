export type NavigationTab =
  | "dashboard"
  | "ai_assistant"
  | "content_ideas"
  | "hooks_scripts"
  | "thumbnail_studio"
  | "story_studio"
  | "growth_monetization"
  | "planner"
  | "vip"
  | "tapsell_ads"
  | "settings"
  | "android_project";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

export interface ContentIdea {
  id: string;
  title: string;
  hook: string;
  format: "Shorts" | "Long-form";
  targetAudience: string;
  viralScore: number;
  keyTalkingPoints: string[];
  cta: string;
  isSaved?: boolean;
}

export interface ScriptSection {
  heading: string;
  voiceover: string;
  visualCue: string;
}

export interface ScriptPackage {
  id: string;
  title: string;
  topic: string;
  videoType: string;
  tone: string;
  duration: string;
  optimizedTitles: string[];
  hooks: { type: string; script: string }[];
  fullScript: {
    hook: string;
    intro: string;
    sections: ScriptSection[];
    climax: string;
    cta: string;
  };
  descriptionSEO: string;
  tags: string[];
  savedAt?: number;
}

export interface ThumbnailTemplate {
  id: string;
  title: string;
  category: "Tech" | "Gaming" | "Finance" | "Education" | "Vlog" | "Podcast" | "Review";
  bgGradient: string;
  headline: string;
  subheadline: string;
  badge: string;
  badgeColor: string;
  textColor: string;
  accentColor: string;
  isVIP: boolean;
}

export interface StoryTemplate {
  id: string;
  title: string;
  category: "New Video" | "Behind The Scenes" | "Q&A Teaser" | "Announcement" | "Quote";
  bgGradient: string;
  headline: string;
  bodyText: string;
  stickerText: string;
  buttonText: string;
  isVIP: boolean;
}

export type PlannerStage =
  | "Idea"
  | "Scripting"
  | "Recording"
  | "Editing"
  | "Thumbnail"
  | "Ready"
  | "Published";

export interface PlannerItem {
  id: string;
  title: string;
  platform: "YouTube Long" | "YouTube Shorts" | "Instagram Story" | "Multi-platform";
  stage: PlannerStage;
  dueDate: string;
  notes: string;
  priority: "High" | "Medium" | "Low";
}

export interface UserSettings {
  theme: "dark" | "light" | "navy";
  fontSize: "small" | "medium" | "large" | "xlarge";
  language: "fa" | "en";
  vipStatus: boolean;
  vipExpiryDate?: string;
  tapsellKey: string;
  cafeBazaarRsaKey: string;
  developer: string;
  appName: string;
  customAppIcon?: string;
  version: string;
  versionCode: number;
}

export interface GrowthPhase {
  phaseName: string;
  target: string;
  actionItems: string[];
}

export interface GrowthStrategyData {
  monetizationStatus: string;
  recommendedCadence: string;
  phases: GrowthPhase[];
  retentionChecklist: string[];
  shortsStrategy: string;
}
