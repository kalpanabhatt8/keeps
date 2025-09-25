"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import type { BookCoverVariant } from "@/components/book-cover";
import { getTemplateById } from "@/data/book-templates";

const blankDefaults = {
  id: "blank",
  variant: "solid" as const,
  title: "Untitled Book",
  subtitle: "Describe this notebook",
  background: "linear-gradient(135deg, #f8f7ff 0%, #ebe9ff 100%)",
};

const backgroundOptions = [
  { id: "mist", label: "Neutral Mist", value: "linear-gradient(135deg, #f8f7ff 0%, #ebe9ff 100%)" },
  { id: "linen", label: "Soft Linen", value: "linear-gradient(135deg, #f6f5f0 0%, #ebe7dd 100%)" },
  { id: "dawn", label: "Dawn", value: "linear-gradient(135deg, #fef3e7 0%, #ffe8f2 100%)" },
];

const galleryOptions = [
  {
    id: "cover-clouds",
    label: "Clouds",
    preview:
      "linear-gradient(180deg, rgba(246,248,255,0.95) 0%, rgba(214,222,255,0.85) 60%, rgba(186,210,255,0.75) 100%)",
  },
  {
    id: "cover-grid",
    label: "Champagne Grid",
    preview:
      "linear-gradient(180deg, #fef9f0 0%, #f7f0de 100%), repeating-linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 1px, transparent 1px, transparent 18px), repeating-linear-gradient(0deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 1px, transparent 1px, transparent 18px)",
  },
  {
    id: "cover-sunset",
    label: "Sunset",
    preview:
      "linear-gradient(135deg, rgba(255,236,221,0.9) 0%, rgba(255,211,226,0.85) 45%, rgba(215,203,255,0.8) 100%)",
  },
];

const BookBuilderPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const templateId = params?.id ?? "blank";

  const template = useMemo(() => {
    if (templateId === "blank") return null;
    return getTemplateById(templateId);
  }, [templateId]);

  const base = template ?? blankDefaults;

  const [title, setTitle] = useState(base.title);
  const [subtitle, setSubtitle] = useState(base.subtitle ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [background, setBackground] = useState<string>(backgroundOptions[0].value);
  const [customBackground, setCustomBackground] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setCoverImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearCoverImage = () => setCoverImage(null);

  const activeBackground = customBackground.trim() ? customBackground : background;

  const handleNext = () => {
    try {
      type DraftPayload = {
        id: string;
        title: string;
        subtitle?: string;
        coverImage: string | null;
        background: string;
        variant: BookCoverVariant;
        updatedAt: number;
      };

      const draftsRaw = localStorage.getItem("keeps-drafts");
      const drafts = draftsRaw ? (JSON.parse(draftsRaw) as Record<string, DraftPayload>) : {};
      drafts[templateId] = {
        id: templateId,
        title,
        subtitle,
        coverImage: coverImage ?? null,
        background: activeBackground,
        variant: template?.variant ?? "solid",
        updatedAt: Date.now(),
      };
      localStorage.setItem("keeps-drafts", JSON.stringify(drafts));
    } catch (error) {
      console.error("Failed to persist draft", error);
    }

    router.push(`/dashboard/books/${templateId}/canvas`);
  };

  return (
    <main className="min-h-screen w-full pb-24">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pt-12 md:px-10 lg:pt-16">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="self-start text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft transition hover:text-ink"
        >
          ← Back to dashboard
        </button>

        <header className="flex flex-col gap-2 text-ink">
          <span className="text-xs uppercase tracking-[0.28em] text-ink-soft">
            Customize Cover
          </span>
          <h1 className="heading-font text-3xl font-semibold tracking-[0.02em] text-ink-strong md:text-4xl">
            {template ? template.title : "Blank Notebook"}
          </h1>
          <p className="body-font text-sm text-ink-muted md:max-w-2xl">
            Upload a cover photo, tweak the colors, and shape the title or description. Nothing is required—keep it minimal or go full aesthetic.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-3">
            <BookCover
              variant={template?.variant ?? "solid"}
              title={title}
              subtitle={subtitle || undefined}
              coverImageUrl={coverImage}
              className="w-[150px]"
              style={{ background: activeBackground }}
            />
            <div className="flex flex-wrap items-center justify-center gap-3 text-[0.68rem] uppercase tracking-[0.2em] text-ink-muted">
              <span>128×186px</span>
              <span aria-hidden>•</span>
              <span>Photo optional</span>
              <span aria-hidden>•</span>
              <span>Editable anytime</span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <section className="rounded-2xl border border-border-subtle bg-white/80 p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                Cover Photo
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex flex-1 min-w-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-subtle bg-surface-raised px-4 py-4 text-xs uppercase tracking-[0.18em] text-ink transition hover:border-border-emphasis">
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  Upload image
                  <span className="text-[0.65rem] normal-case text-ink-muted">PNG or JPG • portrait looks best</span>
                </label>
              {coverImage ? (
                <button
                  type="button"
                  onClick={clearCoverImage}
                  className="rounded-full border border-border-subtle px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft transition hover:border-border-emphasis hover:text-ink"
                >
                  Remove
                </button>
              ) : null}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <span className="text-[0.65rem] uppercase tracking-[0.18em] text-ink-soft">
                  Quick gallery
                </span>
                <div className="flex flex-wrap gap-3">
                  {galleryOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setCoverImage(option.preview)}
                      className="h-12 w-20 rounded-xl border border-border-subtle transition hover:border-border-emphasis"
                      style={{ background: option.preview }}
                      aria-label={`Use ${option.label} cover`}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border-subtle bg-white/80 p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                Background
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {backgroundOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setBackground(option.value)}
                    className={clsx(
                      "h-10 w-20 rounded-xl border transition",
                      background === option.value
                        ? "border-border-emphasis"
                        : "border-border-subtle hover:border-border-emphasis"
                    )}
                    style={{ background: option.value }}
                    aria-label={`Use ${option.label} background`}
                  />
                ))}
                <input
                  type="text"
                  value={customBackground}
                  onChange={(event) => setCustomBackground(event.target.value)}
                  placeholder="Custom CSS background"
                  className="w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-xs text-ink focus:border-border-emphasis focus:outline-none"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-border-subtle bg-white/80 p-5 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                Details
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-[0.65rem] uppercase tracking-[0.18em] text-ink-soft">
                  Title
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm text-ink focus:border-border-emphasis focus:outline-none"
                    placeholder="Name this notebook"
                  />
                </label>
                <label className="flex flex-col gap-1 text-[0.65rem] uppercase tracking-[0.18em] text-ink-soft">
                  Subtitle
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(event) => setSubtitle(event.target.value)}
                    className="rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm text-ink focus:border-border-emphasis focus:outline-none"
                    placeholder="Small description (optional)"
                  />
                </label>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full border border-border-emphasis bg-ink text-white px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:opacity-90"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookBuilderPage;
