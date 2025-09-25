"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { getTemplateById } from "@/data/book-templates";

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

  return (
    <main className="min-h-screen w-full pb-24">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pt-12 md:px-10 lg:pt-16">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="self-start text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft transition hover:text-ink"
        >
          ← Back to dashboard
        </button>

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

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-3">
            <BookCover
              variant={draft.variant}
              title={draft.title}
              subtitle={draft.subtitle || undefined}
              coverImageUrl={draft.coverImage ?? undefined}
              titleColor={draft.titleColor ?? undefined}
              subtitleColor={draft.subtitleColor ?? undefined}
              className="w-[150px]"
              style={{ background: draft.background }}
            />
            <div className="text-center text-[0.68rem] uppercase tracking-[0.2em] text-ink-soft">
              Draft cover preview
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-border-subtle bg-white/90 p-8 shadow-xl">
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">
                Canvas editor placeholder
              </h2>
              <p className="body-font text-sm text-ink">
                Here we’ll render the 200vh × 200vw workspace with draggable text boxes, stickers, and page navigation. Auto-save status will live here too.
              </p>
            </div>
            <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-surface-raised">
              <span className="text-xs uppercase tracking-[0.25em] text-ink-muted">
                Canvas coming soon
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CanvasPage;
