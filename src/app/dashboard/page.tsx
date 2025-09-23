import React from "react";
import { FolderIllustration, type FolderVariant } from "@/components/folder-illustration";

const starterFolders = [
  {
    id: "neutral",
    title: "Neutral Haven",
    description: "Glassmorphism, muted tones, clean grids.",
    variant: "neutral" as FolderVariant,
  },
  {
    id: "kawaii",
    title: "Kawaii Corner",
    description: "Pastel pops, bubbly fonts, cute sticker sets.",
    variant: "kawaii" as FolderVariant,
  },
  {
    id: "retro",
    title: "Retro Archive",
    description: "Warm grain, cassette details, vintage palettes.",
    variant: "retro" as FolderVariant,
  },
];

const Dashboard = () => {
  return (
    <main className="min-h-screen w-full pb-24">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pt-16 md:px-10 lg:pt-24">
        <header className="flex flex-col gap-3 text-ink">
          <span className="text-xs uppercase tracking-[0.28em] text-ink-soft">
            Your Keeps Library
          </span>
          <h1 className="heading-font text-4xl font-black tracking-[0.06em] text-ink-strong md:text-5xl">
            Pick a Folder to Dive In
          </h1>
          <p className="body-font max-w-xl text-sm text-ink md:text-base">
            Start with a mood-ready template or craft a fresh folder. Everything
            saves on this device and carries its own books and pages.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <button className="group relative flex h-72 flex-col items-center justify-between gap-4 overflow-hidden rounded-3xl border border-dashed border-border-subtle bg-surface-raised px-6 py-6 text-left shadow-[0_18px_40px_-28px_rgba(39,29,64,0.45)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:rotate-[1.5deg] hover:border-border-emphasis hover:shadow-[0_24px_46px_-26px_rgba(39,29,64,0.55)]">
            <div className="w-full max-w-[220px]">
              <FolderIllustration
                variant="neutral"
                showInsert={false}
                showPlus
                label=""
                className="w-full"
              />
            </div>
            <div className="flex w-full flex-col gap-1">
              <div className="text-lg font-semibold tracking-[0.015em] text-ink transition-colors group-hover:text-ink-strong">
                Add New Folder
              </div>
              <p className="body-font text-sm text-ink-muted">
                Start with a blank space. Customize the theme, covers, and vibes.
              </p>
            </div>
          </button>

          {starterFolders.map((folder) => (
            <article
              key={folder.id}
              className="group relative flex h-72 flex-col items-center justify-between gap-4 overflow-hidden rounded-3xl border border-border-subtle bg-white/80 px-6 py-6 text-left shadow-[0_20px_44px_-32px_rgba(39,29,64,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:rotate-[1.5deg] hover:shadow-[0_26px_50px_-28px_rgba(39,29,64,0.65)]"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 bg-gradient-to-br from-white/0 via-white/20 to-white/40" />

              <div className="w-full max-w-[220px]">
                <FolderIllustration variant={folder.variant} />
              </div>
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h2 className="heading-font text-2xl font-semibold tracking-[0.05em] text-ink-strong">
                    {folder.title}
                  </h2>
                  <span className="rounded-full border border-border-subtle bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-ink-muted">
                    Template
                  </span>
                </div>
                <p className="body-font text-sm text-ink">
                  {folder.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
