"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  FileSearch,
  History,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  BookOpen,
  Wand2,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavId =
  | "dashboard"
  | "analyze"
  | "improver"
  | "history"
  | "reports"
  | "guide"
  | "interview"
  | "settings";

const NAV_ITEMS: { id: NavId; label: string; icon: React.ElementType; href: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
  { id: "analyze", label: "Analyze Resume", icon: FileSearch, href: "#analyze" },
  { id: "improver", label: "Resume Improver", icon: Wand2, href: "#improver" },
  { id: "history", label: "History", icon: History, href: "#history" },
  { id: "reports", label: "Saved Reports", icon: FolderOpen, href: "#reports" },
  { id: "guide", label: "ATS Score Guide", icon: BookOpen, href: "#guide" },
  { id: "interview", label: "Interview Prep", icon: MessageSquare, href: "#interview" },
  { id: "settings", label: "Settings", icon: Settings, href: "#settings" },
];

interface SidebarProps {
  activeId: NavId;
  onNavigate: (id: NavId) => void;
  apiOnline: boolean | null;
  mobileOpen?: boolean;
}

export function Sidebar({ activeId, onNavigate, apiOnline, mobileOpen }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-[#060912]/95 backdrop-blur-2xl transition-transform duration-300",
        "max-lg:translate-x-0",
        !mobileOpen && "max-lg:-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-neon">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">ResumeAI</p>
          <p className="text-[10px] text-slate-500">Optimizer Pro</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all",
                active
                  ? "bg-purple-500/20 text-white shadow-[inset_0_0_20px_rgba(168,85,247,0.15)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl border border-purple-500/40"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 h-5 w-5 shrink-0",
                  active && "text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                )}
              />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-2 rounded-xl glass-panel px-3 py-2 max-lg:justify-center">
          <BarChart3 className="h-4 w-4 text-cyan-400" />
          <div>
            <p className="text-xs text-slate-400">API Status</p>
            <p
              className={cn(
                "text-xs font-medium",
                apiOnline === true && "text-emerald-400",
                apiOnline === false && "text-amber-400",
                apiOnline === null && "text-slate-500"
              )}
            >
              {apiOnline === true
                ? "Connected"
                : apiOnline === false
                  ? "Offline"
                  : "Checking…"}
            </p>
          </div>
          <span
            className={cn(
              "ml-auto h-2 w-2 rounded-full",
              apiOnline === true && "bg-emerald-400 shadow-[0_0_8px_#34d399]",
              apiOnline === false && "bg-amber-400",
              apiOnline === null && "bg-slate-600 animate-pulse"
            )}
          />
        </div>
      </div>
    </aside>
  );
}
