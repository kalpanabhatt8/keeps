"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { neutralBookTemplates } from "@/data/book-templates";
import {
  readRecentBooks,
  RECENT_BOOKS_STORAGE_KEY,
  type RecentBook,
} from "@/lib/recent-books";

const Dashboard = () => {
  const router = useRouter();
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const userToggledTemplates = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadRecents = () => {
      try {
        const parsed = readRecentBooks();
        console.debug("[Dashboard] Loaded recent books", {
          count: parsed.length,
          ids: parsed.map((book) => book.id),
        });
        setRecentBooks(parsed);
        if (!userToggledTemplates.current) {
          setShowAllTemplates(parsed.length === 0);
        }
      } catch (error) {
        console.error("Failed to read recents", error);
      }
    };

    loadRecents();
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === RECENT_BOOKS_STORAGE_KEY
      ) {
        loadRecents();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
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
    router.push(`/dashboard/books/${templateId}/canvas`);
  };

  const carouselPreviewCount = 6;

  const remainingTemplates = useMemo(
    () => neutralBookTemplates.slice(carouselPreviewCount),
    []
  );

  const hasRemainingTemplates = remainingTemplates.length > 0;

  const handleToggleTemplates = () => {
    userToggledTemplates.current = true;
    setShowAllTemplates((prev) => !prev);
  };

  return (
    <main className="min-h-screen w-full pb-24 bg-[#c2c1d3]">
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 md:px-10">
        <section className="flex flex-col gap-16">
          <div className="flex flex-col gap-4 text-ink">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] text-ink-soft">
                    Starter Library
                  </span>
                  {/* <p className="text-sm text-ink-soft">
                    Scroll through the launch set or open the full gallery to pick your vibe.
                  </p> */}
                </div>

                {hasRemainingTemplates ? (
                  <button
                    type="button"
                    onClick={handleToggleTemplates}
                    className="starter-actions__button"
                  >
                    {showAllTemplates
                      ? "Hide"
                      : `Show more`}
                      {/* : `Show ${remainingTemplates.length} more`} */}
                  </button>
                ) : null}
              </div>
            </div>

            {!showAllTemplates && (
              <div className="starter-carousel">
                <div className="starter-carousel__glow" aria-hidden />
                <div className="starter-carousel__track">
                  <button
                    type="button"
                    onClick={handleCreateNewBook}
                    className="starter-card group !p-0"
                    aria-label="Create blank notebook"
                  >
                    <div className="aspect-[128/186] w-full">
                      <div className="empty-template-card h-full w-full">
                        <div>➕</div>
                      </div>
                    </div>
                    {/* <span className="starter-card__label">Blank</span> */}
                  </button>

                  {neutralBookTemplates.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => handleTemplateSelect(book.id)}
                      className="starter-card group !p-0"
                    >
                      <div className="aspect-[128/186] w-full book-shadow-div">
                        <BookCover
                          variant={book.variant}
                          title={book.title}
                          subtitle={book.subtitle}
                          coverImageUrl={book.coverImage ?? undefined}
                          className="h-full w-full"
                        />
                        <div className="trapezoid-bar"></div>
                      </div>
                      {/* <span className="starter-card__label">{book.title}</span> */}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showAllTemplates && (
              <div className="starter-grid">
                <button
                  type="button"
                  onClick={handleCreateNewBook}
                  className="starter-grid__card group"
                >
                  <div className="aspect-[128/186] w-full">
                    <div className="empty-template-card h-full w-full">
                      <div>➕</div>
                    </div>
                  </div>
                  {/* <span className="starter-card__label">Blank</span> */}
                </button>
                {neutralBookTemplates.map((book) => (
                  <button
                    key={`${book.id}-grid`}
                    type="button"
                    onClick={() => handleTemplateSelect(book.id)}
                    className="starter-grid__card group"
                  >
                    <div className="aspect-[128/186] w-full book-shadow-div">
                      <BookCover
                        variant={book.variant}
                        title={book.title}
                        subtitle={book.subtitle}
                        coverImageUrl={book.coverImage ?? undefined}
                        className="h-full w-full"
                      />
                      <div className="trapezoid-bar"></div>
                    </div>
                    {/* <span className="starter-card__label">{book.title}</span> */}
                  </button>
                ))}
              </div>
            )}
          </div>

          {recentBooks.length > 0 && (
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-[0.7rem] uppercase tracking-[0.3em] text-ink-soft">
                  What you left open
                </h2>
                {/* <p className="body-font text-sm text-ink-muted">
                  Drafts auto-save while you work. Jump back in anytime.
                </p> */}
              </div>

              <div className="flex flex-wrap justify-center gap-10 md:justify-start">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex flex-col">
                    <div
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
                    <div className="text-xs text-ink-soft ml-2">
                      {formatRelativeTime(book.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
