"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import Toolbar from "./toolbar";
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
    <div className="flex flex-col gap-4">
      <Toolbar
        onAddText={addTextItem}
        onStickerSelect={addStickerItem}
        onStickerUpload={handleStickerUpload}
        onBackgroundColorChange={handleBackgroundColorChange}
        onBackgroundImageUpload={handleBackgroundImageUpload}
        onExport={handleExport}
        presetStickers={emojiStickers}
      />

      <div
        className="relative mx-auto h-[32rem] w-full max-w-4xl overflow-hidden rounded-[32px] border border-border-subtle bg-white shadow-xl"
        style={boardBackgroundStyle}
        ref={boardRef}
        onClick={() => setActiveItemId(null)}
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
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border-subtle bg-white/80 px-4 py-3 text-xs text-ink">
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
    </div>
  );
};

export default CanvasBoard;
