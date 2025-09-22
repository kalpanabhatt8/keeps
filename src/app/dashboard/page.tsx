import React from "react";

const starterFolders = [
  {
    id: "neutral",
    title: "Neutral Haven",
    description: "Glassmorphism, muted tones, clean grids.",
    accent: "from-[#d9d7ff] to-[#f3f2ff]",
  },
  {
    id: "kawaii",
    title: "Kawaii Corner",
    description: "Pastel pops, bubbly fonts, cute sticker sets.",
    accent: "from-[#ffd6ec] to-[#ffe8f7]",
  },
  {
    id: "retro",
    title: "Retro Archive",
    description: "Warm grain, cassette details, vintage palettes.",
    accent: "from-[#ffe0c2] to-[#fff0da]",
  },
];

const Dashboard = () => {
  return (
    <main className="min-h-screen w-full pb-24">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pt-16 md:px-10 lg:pt-24">
        <header className="flex flex-col gap-3 text-black/80">
          <span className="text-xs uppercase tracking-[0.28em] text-black/40">
            Your Keeps Library
          </span>
          <h1 className="heading-font text-4xl font-black tracking-[0.06em] md:text-5xl">
            Pick a Folder to Dive In
          </h1>
          <p className="body-font max-w-xl text-sm text-black/60 md:text-base">
            Start with a mood-ready template or craft a fresh folder. Everything
            saves on this device and carries its own books and pages.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <button className="group relative flex h-48 flex-col justify-between rounded-3xl border border-dashed border-black/15 bg-white/70 px-6 py-5 text-left shadow-[0_18px_40px_-28px_rgba(39,29,64,0.45)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:rotate-[1.5deg] hover:border-black/25 hover:shadow-[0_24px_46px_-26px_rgba(39,29,64,0.55)]">
            <div className="text-lg font-semibold tracking-[0.015em] text-black/70 transition-colors group-hover:text-black">
              + Add Folder
            </div>
            <p className="body-font text-sm text-black/50">
              Start with a blank space. Customize the theme, covers, and vibes.
            </p>
          </button>

          {starterFolders.map((folder) => (
            <article
              key={folder.id}
              className="relative flex h-48 flex-col justify-between overflow-hidden rounded-3xl border border-black/5 bg-white/80 px-6 py-5 text-left shadow-[0_20px_44px_-32px_rgba(39,29,64,0.6)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:rotate-[1.5deg] hover:shadow-[0_26px_50px_-28px_rgba(39,29,64,0.65)]"
            >
              <div
                className={`pointer-events-none absolute inset-0 -z-10 opacity-80 bg-gradient-to-br ${folder.accent}`}
              />
              <div className="flex items-center justify-between">
                <h2 className="heading-font text-2xl font-semibold tracking-[0.05em]">
                  {folder.title}
                </h2>
                <span className="rounded-full border border-black/20 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-black/50">
                  Template
                </span>
              </div>
              <p className="body-font text-sm text-black/60">
                {folder.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
