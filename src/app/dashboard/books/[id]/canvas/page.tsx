"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { getTemplateById } from "@/data/book-templates";
import CanvasBoard from "@/components/canvas/canvas-board";

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
      const drafts = draftsRaw ? (JSON.parse(draftsRaw) as Record<string, Draft>) : {};
      const existing = drafts[bookId];
      const nextDraft = existing ? { ...baseDraft, ...existing } : baseDraft;
      setDraft(nextDraft);

      drafts[bookId] = { ...nextDraft, updatedAt: Date.now() };
      localStorage.setItem("keeps-drafts", JSON.stringify(drafts));

      const recentsRaw = localStorage.getItem("keeps-recents");
      const recents = recentsRaw ? (JSON.parse(recentsRaw) as Draft[]) : [];
      const filtered = recents.filter((item) => item.id !== bookId);
      filtered.unshift({ ...nextDraft, updatedAt: Date.now() });
      localStorage.setItem("keeps-recents", JSON.stringify(filtered.slice(0, 25)));
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
    <main className="min-h-screen w-full pb-24">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pt-12 md:px-10 lg:pt-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft transition hover:text-ink"
          >
            ← Back to dashboard
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/books/${bookId}`)}
              className="rounded-full border border-border-emphasis px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink-soft transition hover:border-ink hover:text-ink"
            >
              Edit cover & title
            </button>
          </div>
        </div>

        <header className="flex flex-col gap-2 text-ink">
          <span className="text-xs uppercase tracking-[0.28em] text-ink-soft">
            Draft Canvas
          </span>
          <h1 className="heading-font text-3xl font-semibold tracking-[0.02em] text-ink-strong md:text-4xl">
            {draft.title || "Untitled Book"}
          </h1>
          <p className="body-font text-sm text-ink-muted md:max-w-2xl">
            This is the Keeps canvas. Drop in notes, stickers, and pages—the draft auto-saves while you work.
          </p>
          <span className="text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft">
            Saved {formatRelativeTime(lastSaved)}
          </span>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-border-subtle bg-white/80 p-6 shadow-sm">
            <BookCover
              variant={draft.variant}
              title={draft.title}
              subtitle={draft.subtitle || undefined}
              coverImageUrl={draft.coverImage ?? undefined}
              titleColor={draft.titleColor ?? undefined}
              subtitleColor={draft.subtitleColor ?? undefined}
              className="w-[180px]"
              style={{ background: draft.background }}
            />
            <div className="text-center text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft">
              Draft cover preview
            </div>
            <div className="text-center text-[0.62rem] text-ink-muted">
              Cover updates when you change it in the editor.
            </div>
          </div>

          <CanvasBoard storageKey={boardStorageKey} initialBackground={draft.background} />
        </div>
      </section>
    </main>
  );
};

export default CanvasPage;
