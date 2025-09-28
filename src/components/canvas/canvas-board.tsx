"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import html2canvas from "html2canvas";
import CanvasItem from "./canvas-item";
import { BackgroundState, CanvasElement } from "./types";

const emojiStickers = ["⭐️", "🌙", "✨", "🌸", "🍀", "☕️"].map((emoji) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='72'>${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
});

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const defaultBackground: BackgroundState = {
  type: "color",
  value: "#f6f5ff",
};

type CanvasBoardProps = {
  storageKey: string;
  initialBackground?: string;
};

const CanvasBoard: React.FC<CanvasBoardProps> = ({ storageKey, initialBackground }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const zIndexRef = useRef<number>(1);

  const [background, setBackground] = useState<BackgroundState>({
    type: "color",
    value: initialBackground ?? defaultBackground.value,
  });
  const [items, setItems] = useState<CanvasElement[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [showStickerTray, setShowStickerTray] = useState(false);

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeItemId) ?? null,
    [items, activeItemId]
  );

  const bringToFront = useCallback(
    (id: string) => {
      zIndexRef.current += 1;
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                zIndex: zIndexRef.current,
              }
            : item
        )
      );
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          background: BackgroundState;
          items: CanvasElement[];
        };
        setBackground(parsed.background ?? defaultBackground);
        setItems(parsed.items ?? []);
      } else if (initialBackground) {
        setBackground({ type: "color", value: initialBackground });
      }
    } catch (error) {
      console.error("Failed to load board", error);
    }
  }, [storageKey, initialBackground]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({ background, items });
    localStorage.setItem(storageKey, payload);
  }, [background, items, storageKey]);

  const addTextItem = () => {
    const id = generateId();
    const newItem: CanvasElement = {
      id,
      type: "text",
      x: 120,
      y: 120,
      width: 200,
      height: 90,
      rotation: 0,
      zIndex: zIndexRef.current + 1,
      text: "Double-click to edit",
      fontSize: 22,
      color: "#2E2A3F",
    };
    zIndexRef.current += 1;
    setItems((prev) => [...prev, newItem]);
    setActiveItemId(id);
  };

  const addStickerItem = (src: string) => {
    const id = generateId();
    const newItem: CanvasElement = {
      id,
      type: "sticker",
      x: 160,
      y: 160,
      width: 140,
      height: 140,
      rotation: 0,
      zIndex: zIndexRef.current + 1,
      src,
    };
    zIndexRef.current += 1;
    setItems((prev) => [...prev, newItem]);
    setActiveItemId(id);
  };

  const handleStickerUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        addStickerItem(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBackground({ type: "image", value: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackground({ type: "color", value: color });
  };

  const handleExport = async () => {
    if (!boardRef.current) return;
    const canvas = await html2canvas(boardRef.current, {
      backgroundColor: null,
      useCORS: true,
    });
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "keeps-board.png";
    link.click();
  };

  const updateItem = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const handleSelectItem = useCallback(
    (id: string) => {
      setActiveItemId(id);
      bringToFront(id);
    },
    [bringToFront]
  );

  const handleDeleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setActiveItemId((current) => (current === id ? null : current));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Delete" || event.key === "Backspace") && activeItemId) {
        handleDeleteItem(activeItemId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItemId, handleDeleteItem]);

  const boardBackgroundStyle: React.CSSProperties =
    background.type === "image"
      ? {
          backgroundImage: `url(${background.value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {
          background: background.value,
        };

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0 overflow-hidden bg-white"
        style={boardBackgroundStyle}
        ref={boardRef}
        onClick={() => {
          setActiveItemId(null);
          setShowStickerTray(false);
        }}
      >
        {items.map((item) => (
          <CanvasItem
            key={item.id}
            item={item}
            selected={item.id === activeItemId}
            onSelect={handleSelectItem}
            onChange={updateItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>

      {activeItem ? (
        <div className="absolute top-6 right-6 z-30 flex w-[min(90%,420px)] flex-wrap items-center gap-3 rounded-2xl border border-border-subtle bg-white/95 px-4 py-3 text-xs text-ink shadow-lg">
          <span className="font-semibold uppercase tracking-[0.22em] text-ink-soft">
            Item settings
          </span>
          <label className="flex items-center gap-2">
            <span className="uppercase tracking-[0.18em] text-ink-soft">Rotate</span>
            <input
              type="range"
              min="-180"
              max="180"
              value={activeItem.rotation}
              onChange={(event) =>
                updateItem(activeItem.id, { rotation: Number(event.target.value) })
              }
            />
          </label>

          {activeItem.type === "text" ? (
            <>
              <label className="flex items-center gap-2">
                <span className="uppercase tracking-[0.18em] text-ink-soft">Font</span>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={activeItem.fontSize ?? 22}
                  onChange={(event) =>
                    updateItem(activeItem.id, { fontSize: Number(event.target.value) })
                  }
                />
              </label>
              <label className="flex items-center gap-2">
                <span className="uppercase tracking-[0.18em] text-ink-soft">Color</span>
                <input
                  type="color"
                  value={activeItem.color ?? "#2E2A3F"}
                  onChange={(event) => updateItem(activeItem.id, { color: event.target.value })}
                  className="h-6 w-6 cursor-pointer border-none bg-transparent"
                />
              </label>
            </>
          ) : null}

          <button
            type="button"
            onClick={() => handleDeleteItem(activeItem.id)}
            className="ml-auto rounded-full border border-border-emphasis px-3 py-1 font-semibold uppercase tracking-[0.2em] text-ink-soft transition hover:border-ink hover:text-ink"
          >
            Delete
          </button>
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border-subtle bg-white/95 px-5 py-2 shadow-lg">
        <button
          type="button"
          onClick={addTextItem}
          className="pointer-events-auto h-10 w-10 rounded-full bg-ink text-sm font-semibold text-white transition hover:opacity-90"
          aria-label="Add text"
        >
          T
        </button>

        <div className="pointer-events-auto relative">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setShowStickerTray((prev) => !prev);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-white text-lg transition hover:border-ink"
            aria-label="Sticker tray"
          >
            ⭐️
          </button>
          {showStickerTray ? (
            <div className="absolute bottom-12 left-1/2 z-30 flex -translate-x-1/2 gap-2 rounded-2xl border border-border-subtle bg-white px-3 py-2 shadow-lg">
              {emojiStickers.map((sticker) => (
                <button
                  key={sticker}
                  type="button"
                  onClick={() => {
                    addStickerItem(sticker);
                    setShowStickerTray(false);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-white text-lg transition hover:border-ink"
                >
                  <Image src={sticker} alt="Sticker" width={24} height={24} unoptimized />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <label className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-white text-sm transition hover:border-ink" aria-label="Upload sticker">
          ⬆️
          <input type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && handleStickerUpload(event.target.files[0])} />
        </label>

        <label className="pointer-events-auto relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-white text-sm transition hover:border-ink" aria-label="Background color">
          🎨
          <input
            type="color"
            className="absolute h-10 w-10 cursor-pointer opacity-0"
            onChange={(event) => handleBackgroundColorChange(event.target.value)}
          />
        </label>

        <label className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-white text-sm transition hover:border-ink" aria-label="Background image">
          🖼️
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => event.target.files?.[0] && handleBackgroundImageUpload(event.target.files[0])}
          />
        </label>

        <button
          type="button"
          onClick={handleExport}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white transition hover:opacity-90"
          aria-label="Export board"
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default CanvasBoard;
