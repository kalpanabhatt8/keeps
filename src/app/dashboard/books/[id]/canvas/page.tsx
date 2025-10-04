"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTemplateById } from "@/data/book-templates";
import CanvasBoard from "@/components/canvas/canvas-board";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  Edit,
  FilePenLine,
  Sparkle,
} from "lucide-react";
import { BookCover } from "@/components/book-cover";
import Popup from "reactjs-popup";

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
      <CanvasBoard
        storageKey={boardStorageKey}
        initialBackground={draft.background}
      />

      <div className="pointer-events-none absolute left-4 top-4 z-40 flex items-center gap-3 bg-white/90 p-1 shadow-md rounded-lg">
        <div className="flex flex-row gap-2 relative items-center">
          {/* <Popup
            trigger={
              <button
                type="button"
                className="pointer-events-auto flex items-center gap-0.5 text-sm text-ink-soft transition hover:text-ink focus:text-primary focus:bg-surface-base p-2 rounded-md"
              >
                <Sparkle strokeWidth={1.5} size={20} />
                <ChevronDown strokeWidth={1} size={16} />
              </button>
            }
            position="bottom center"
            closeOnDocumentClick
            arrow={false}
            contentStyle={{
              padding: 0,
              border: "none",
              borderRadius: "0.75rem",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
              background: "white",
              minWidth: "14rem",
              zIndex: 50,
            }}
            overlayStyle={{ background: "none" }}
          >
            {((close: () => void) => (
              <div className="pointer-events-auto w-56 rounded-xl bg-white shadow-xl ring-1 ring-black/5 backdrop-blur-md p-2">
                <button
                  type="button"
                  onClick={() => {
                    router.push("/dashboard");
                    close();
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 !text-sm text-ink-soft transition hover:bg-primary hover:text-white"
                >
                  <ChevronLeft strokeWidth={1.5} size={18} />
                  Back to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log("Edit cover page clicked");
                    close();
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 !text-sm text-ink-soft transition hover:bg-primary hover:text-white"
                >
                  <FilePenLine strokeWidth={1.5} size={16} />
                  Edit Cover Page
                </button>
              </div>
            )) as unknown as React.ReactNode}
          </Popup> */}

          <Popup
            trigger={(open: boolean) => (
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                className={`pointer-events-auto flex items-center gap-0.5 text-sm transition p-2 rounded-md hover:text-ink focus:text-primary focus:bg-surface-base ${open ? "bg-surface-base text-ink" : "text-ink-soft"}`}
              >
                <Sparkle
                  strokeWidth={1.5}
                  size={18}
                  className={`${open ? "opacity-100" : "opacity-90"} transition-opacity`}
                />
                <ChevronDown
                  strokeWidth={1}
                  size={16}
                  className={`${open ? "rotate-180" : ""} transition-transform duration-200`}
                />
              </button>
            )}
            position="bottom left"
            offsetY={5}
            closeOnDocumentClick
            arrow={false}
            contentStyle={{
              padding: 0,
              border: "none",
              borderRadius: "0.75rem",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
              background: "white",
              // minWidth: "14rem",
              zIndex: 50,
            }}
            overlayStyle={{ background: "none" }}
          >
            {((close: () => void) => (
              <div className="pointer-events-auto w-56 rounded-xl bg-white shadow-xl ring-1 ring-black/5 backdrop-blur-md p-2">
                <button
                  type="button"
                  onClick={() => {
                    router.push("/dashboard");
                    close();
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition hover:bg-primary hover:text-white"
                >
                  <ChevronLeft strokeWidth={1.5} size={18} />
                  Back to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log("Edit cover page clicked");
                    close();
                  }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-ink-soft transition hover:bg-primary hover:text-white"
                >
                  <FilePenLine strokeWidth={1.5} size={16} />
                  Edit Cover Page
                </button>
              </div>
            )) as unknown as React.ReactNode}
          </Popup>

          {/* <span className="h-4 w-px bg-border-subtle" aria-hidden /> */}

          {/* <h1 className="heading-font text-md font-semibold tracking-[0.02em] text-ink-strong md:text-md">
            {draft.title || "Untitled Book"}
          </h1> */}
          {/* <span className="text-[0.68rem] text-ink-soft">
          Saved {formatRelativeTime(lastSaved)}
        </span> */}
        </div>
      </div>
    </main>
  );
};

export default CanvasPage;
