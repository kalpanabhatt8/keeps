"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { neutralBookTemplates } from "@/data/book-templates";

type RecentBook = {
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

const Dashboard = () => {
  const router = useRouter();
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadRecents = () => {
      try {
        const raw = localStorage.getItem("keeps-recents");
        const parsed = raw ? (JSON.parse(raw) as RecentBook[]) : [];
        setRecentBooks(parsed);
      } catch (error) {
        console.error("Failed to read recents", error);
      }
    };

    loadRecents();
    window.addEventListener("storage", loadRecents);
    return () => window.removeEventListener("storage", loadRecents);
  }, []);

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minute = 60_000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) return "Just now";
    if (diff < hour) {
      const mins = Math.round(diff / minute);
      return `${mins} min${mins === 1 ? "" : "s"} ago`;
    }
    if (diff < day) {
      const hours = Math.round(diff / hour);
      return `${hours} hr${hours === 1 ? "" : "s"} ago`;
    }
    const days = Math.round(diff / day);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  };

  const handleCreateNewBook = () => {
    router.push("/dashboard/books/blank");
  };

  const handleTemplateSelect = (templateId: string) => {
    router.push(`/dashboard/books/${templateId}`);
  };

  return (
    <main className="min-h-screen w-full pb-24 dashboard-bg">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pt-16 md:px-10">
        <section className="flex flex-col gap-6">
          {/* <div className="flex flex-col gap-1">
            <h2 className="heading-font text-xl font-semibold tracking-[0.04em] text-ink-strong">
              Neutral Starter Covers
            </h2>
            <p className="body-font text-sm text-ink-muted">
              Begin with the blank notebook or pick a template. You can personalize everything on the next screen.
            </p>
          </div> */}
          <div className="flex flex-col gap-2 text-ink">
            {/* <span className="text-xs uppercase tracking-[0.28em] text-ink-soft">
              Your Keeps Library
            </span> */}
            <h1 className="heading-font text-xl font-semibold text-ink-strong ">
              Start with a new book
            </h1>
          </div>
          <div className="flex flex-wrap justify-center gap-10 md:justify-start">
            <button
              type="button"
              onClick={handleCreateNewBook}
              className="group flex w-full max-w-[120px] flex-col items-center gap-0 "
            >
              <div className="aspect-[128/186] w-full">
                <div className="empty-template-card h-full w-full"><div>➕</div></div>
              </div>
            </button>

            {neutralBookTemplates.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => handleTemplateSelect(book.id)}
                className="group flex w-full max-w-[120px] flex-col items-center gap-0"
              >
                <div className="aspect-[128/186] w-full book-shadow-div">
                  <BookCover variant={book.variant} title={book.title} className="h-full w-full" />
                  <div className="trapezoid-bar"></div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {recentBooks.length > 0 && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="heading-font text-xl font-semibold text-ink-strong">
                Recent Drafts
              </h2>
              <p className="body-font text-sm text-ink-muted">
                Drafts auto-save while you work. Jump back in anytime.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-10 md:justify-start">
              {recentBooks.map((book) => (
                <div className="flex flex-col">
                  <div
                    key={book.id}
                    onClick={() =>
                      router.push(`/dashboard/books/${book.id}/canvas`)
                    }
                    className="group flex w-full max-w-[120px] flex-col items-center gap-8 mb-3"
                  >
                    <div className="aspect-[128/186] w-full book-shadow-div">
                      <BookCover
                        variant={book.variant}
                        title={book.title}
                        subtitle={book.subtitle || undefined}
                        coverImageUrl={book.coverImage ?? undefined}
                        titleColor={book.titleColor ?? undefined}
                        subtitleColor={book.subtitleColor ?? undefined}
                        className="h-full w-full"
                        style={{ background: book.background }}
                      />
                    <div className="trapezoid-bar"></div>
                    </div>
                  </div>
                  <div className="text-xs text-ink-muted ml-2">
                    {formatRelativeTime(book.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
