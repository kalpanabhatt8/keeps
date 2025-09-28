import React from "react";
import Image from "next/image";

type ToolbarProps = {
  onAddText: () => void;
  onStickerSelect: (src: string) => void;
  onStickerUpload: (file: File) => void;
  onBackgroundColorChange: (color: string) => void;
  onBackgroundImageUpload: (file: File) => void;
  onExport: () => void;
  presetStickers: string[];
};

const Toolbar: React.FC<ToolbarProps> = ({
  onAddText,
  onStickerSelect,
  onStickerUpload,
  onBackgroundColorChange,
  onBackgroundImageUpload,
  onExport,
  presetStickers,
}) => {
  const handleStickerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onStickerUpload(file);
      event.target.value = "";
    }
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onBackgroundImageUpload(file);
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-white/80 px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onAddText}
          className="rounded-full border border-border-emphasis px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-ink"
        >
          Add Text
        </button>

        <label className="cursor-pointer rounded-full border border-border-subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft transition hover:border-ink hover:text-ink">
          Upload Sticker
          <input type="file" accept="image/*" className="hidden" onChange={handleStickerUpload} />
        </label>

        <div className="flex items-center gap-1">
          {presetStickers.map((sticker) => (
            <button
              key={sticker}
              type="button"
              onClick={() => onStickerSelect(sticker)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle bg-white shadow-sm transition hover:border-ink"
            >
              <Image src={sticker} alt="Sticker" width={20} height={20} unoptimized />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-full border border-border-subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft transition hover:border-ink hover:text-ink">
          Background
          <input
            type="color"
            onChange={(event) => onBackgroundColorChange(event.target.value)}
            className="h-6 w-6 cursor-pointer border-none bg-transparent p-0"
            aria-label="Background color"
          />
        </label>

        <label className="cursor-pointer rounded-full border border-border-subtle px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft transition hover:border-ink hover:text-ink">
          Upload BG
          <input type="file" accept="image/*" className="hidden" onChange={handleBackgroundUpload} />
        </label>

        <button
          type="button"
          onClick={onExport}
          className="rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
        >
          Export PNG
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
