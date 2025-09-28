"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTemplateById } from "@/data/book-templates";
import CanvasBoard from "@/components/canvas/canvas-board";
import { ArrowLeft } from "lucide-react";

const blankDefaults = {
  id: "blank",
  variant: "solid" as const,
  title: "Untitled Book",
  subtitle: "Describe this notebook",
  background: "linear-gradient(135deg, #f8f7ff 0%, #ebe9ff 100%)",
};

type Draft = {
  id: string;
  title: string;
  subtitle?: string;
  coverImage?: string | null;
  background: string;
  variant: "solid" | "grid" | "abstract" | "strap" | "gradient";
  titleColor?: string | null;
  subtitleColor?: string | null;
  updatedAt: number;
};

const CanvasPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bookId = params?.id ?? "blank";

  const template = useMemo(() => {
    if (bookId === "blank") return null;
    return getTemplateById(bookId);
  }, [bookId]);

  const baseDraft = useMemo((): Draft => {
    return {
      id: bookId,
      title: template?.title ?? blankDefaults.title,
      subtitle: template?.subtitle ?? blankDefaults.subtitle,
      coverImage: null,
      background: blankDefaults.background,
      variant: template?.variant ?? blankDefaults.variant,
      titleColor: null,
      subtitleColor: null,
      updatedAt: Date.now(),
    };
  }, [bookId, template]);

  const [draft, setDraft] = useState<Draft>(baseDraft);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const draftsRaw = localStorage.getItem("keeps-drafts");
      const drafts = draftsRaw
        ? (JSON.parse(draftsRaw) as Record<string, Draft>)
        : {};
      const existing = drafts[bookId];
      const nextDraft = existing ? { ...baseDraft, ...existing } : baseDraft;
      setDraft(nextDraft);

      drafts[bookId] = { ...nextDraft, updatedAt: Date.now() };
      localStorage.setItem("keeps-drafts", JSON.stringify(drafts));

      const recentsRaw = localStorage.getItem("keeps-recents");
      const recents = recentsRaw ? (JSON.parse(recentsRaw) as Draft[]) : [];
      const filtered = recents.filter((item) => item.id !== bookId);
      filtered.unshift({ ...nextDraft, updatedAt: Date.now() });
      localStorage.setItem(
        "keeps-recents",
        JSON.stringify(filtered.slice(0, 25))
      );
      setLastSaved(Date.now());
    } catch (error) {
      console.error("Failed to load draft", error);
    }
  }, [baseDraft, bookId]);

  useEffect(() => {
    const interval = setInterval(() => setLastSaved(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60_000) return "Just now";
    if (diff < 3_600_000) {
      const mins = Math.round(diff / 60_000);
      return `${mins} min${mins === 1 ? "" : "s"} ago`;
    }
    const hours = Math.round(diff / 3_600_000);
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  };

  const boardStorageKey = useMemo(() => `keeps-board-${bookId}`, [bookId]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#f4f3ff]">
      <CanvasBoard storageKey={boardStorageKey} initialBackground={draft.background} />

      <div className="pointer-events-none absolute left-6 top-6 z-40 flex items-center gap-3 rounded-full border border-border-subtle bg-white/90 px-4 py-2 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="pointer-events-auto flex items-center gap-2 text-sm text-ink-soft transition hover:text-ink"
        >
          <ArrowLeft size={16} />
          Dashboard
        </button>
        <span className="h-4 w-px bg-border-subtle" aria-hidden />
        <span className="text-[0.68rem] text-ink-soft">
          Saved {formatRelativeTime(lastSaved)}
        </span>
      </div>
    </main>
  );
};

export default CanvasPage;
