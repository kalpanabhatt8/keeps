"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Type, Image as ImageIcon, Palette } from "lucide-react";
import CanvasItem from "./canvas-item";
import {
  BackgroundMode,
  BoardElement,
  BoardState,
  ImageElement,
  TextElement,
} from "./types";
import { getPatternImage } from "./patterns";

const DEFAULT_BACKGROUND: BackgroundMode = {
  type: "solid",
  bgColor: "#f7f7f7",
};

const SAVE_DELAY = 300;
const INITIAL_PATTERN: BackgroundMode = {
  type: "pattern",
  pattern: "dots",
  bgColor: "#f7f7f7",
  patternColor: "#cbd5ff",
  size: 24,
};

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const normalizeBackground = (
  raw: unknown,
  fallback: BackgroundMode
): BackgroundMode => {
  if (!raw || typeof raw !== "object") return fallback;

  const updates = raw as Partial<BackgroundMode>;

  if (updates.type === "solid") {
    return {
      type: "solid",
      bgColor: typeof updates.bgColor === "string" ? updates.bgColor : fallback.bgColor,
    };
  }

  if (updates.type === "pattern") {
    const pattern =
      updates.pattern === "sparkle" || updates.pattern === "grid" ? updates.pattern : "dots";
    const size = Number(updates.size);
    return {
      type: "pattern",
      pattern,
      bgColor:
        typeof updates.bgColor === "string" ? updates.bgColor : fallback.bgColor,
      patternColor:
        typeof updates.patternColor === "string" ? updates.patternColor : "#cbd5ff",
      size: Number.isFinite(size) ? Math.min(Math.max(size, 4), 128) : 24,
    };
  }

  return fallback;
};

const normalizeElement = (raw: any, fallbackZ: number): BoardElement | null => {
  if (!raw || typeof raw !== "object") return null;
  const base = {
    id: typeof raw.id === "string" ? raw.id : generateId(),
    x: Number.isFinite(raw.x) ? raw.x : 60,
    y: Number.isFinite(raw.y) ? raw.y : 60,
    w: Number.isFinite(raw.w) ? raw.w : Number.isFinite(raw.width) ? raw.width : 200,
    h: Number.isFinite(raw.h) ? raw.h : Number.isFinite(raw.height) ? raw.height : 140,
    rotation: Number.isFinite(raw.rotation) ? raw.rotation : 0,
    z: Number.isFinite(raw.z) ? raw.z : fallbackZ,
  };

  if (raw.kind === "text" || raw.type === "text") {
    return {
      ...base,
      kind: "text",
      text: typeof raw.text === "string" ? raw.text : "Double-click to edit",
      fontSize: Number.isFinite(raw.fontSize) ? raw.fontSize : 20,
      color: typeof raw.color === "string" ? raw.color : "#1f2937",
      align:
        raw.align === "center" || raw.align === "right" ? raw.align : "left",
      fontFamily: typeof raw.fontFamily === "string" ? raw.fontFamily : undefined,
      weight: Number.isFinite(raw.weight) ? raw.weight : undefined,
    } as TextElement;
  }

  if ((raw.kind === "image" || raw.type === "image") && typeof raw.src === "string") {
    return {
      ...base,
      kind: "image",
      src: raw.src,
      naturalW: Number.isFinite(raw.naturalW) ? raw.naturalW : undefined,
      naturalH: Number.isFinite(raw.naturalH) ? raw.naturalH : undefined,
    } as ImageElement;
  }

  return null;
};

const loadInitialState = (
  storageKey: string,
  initialBackground?: string
): BoardState => {
  const fallback: BackgroundMode = initialBackground
    ? { type: "solid", bgColor: initialBackground }
    : DEFAULT_BACKGROUND;

  if (typeof window === "undefined") {
    return { background: fallback, elements: [], selectedId: null };
  }

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return { background: fallback, elements: [], selectedId: null };
    }

    const parsed = JSON.parse(raw);
    const background = normalizeBackground(parsed.background, fallback);

    const elements: BoardElement[] = Array.isArray(parsed.elements)
      ? parsed.elements
          .map((item: any, index: number) => normalizeElement(item, index + 1))
          .filter((item: BoardElement | null): item is BoardElement => Boolean(item))
      : [];

    const selectedId =
      typeof parsed.selectedId === "string" ? parsed.selectedId : null;

    return { background, elements, selectedId };
  } catch {
    return { background: fallback, elements: [], selectedId: null };
  }
};

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    target.isContentEditable ||
    target.closest("[data-canvas-ignore-keys]")
  );
};

type CanvasBoardProps = {
  storageKey: string;
  initialBackground?: string;
};

const CanvasBoard: React.FC<CanvasBoardProps> = ({
  storageKey,
  initialBackground,
}) => {
  const [boardState, setBoardState] = useState<BoardState>(() =>
    loadInitialState(storageKey, initialBackground)
  );
  const [activeTool, setActiveTool] = useState<"background" | null>(null);
  const [shiftPressed, setShiftPressed] = useState(false);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlsRef = useRef<Record<string, string>>({});
  const saveTimerRef = useRef<number | null>(null);
  const selectedIdRef = useRef<string | null>(boardState.selectedId ?? null);

  useEffect(() => {
    selectedIdRef.current = boardState.selectedId ?? null;
  }, [boardState.selectedId]);

  useEffect(
    () => () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
      Object.values(objectUrlsRef.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    },
    []
  );

  const schedulePersist = useCallback(
    (state: BoardState) => {
      if (typeof window === "undefined") return;
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = window.setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(state));
        } catch {
          /* ignore quota errors */
        }
      }, SAVE_DELAY);
    },
    [storageKey]
  );

  const updateBoardState = useCallback(
    (updater: (prev: BoardState) => BoardState) => {
      setBoardState((prev) => {
        const next = updater(prev);
        schedulePersist(next);
        return next;
      });
    },
    [schedulePersist]
  );

  const deselect = useCallback(() => {
    updateBoardState((prev) => ({ ...prev, selectedId: null }));
  }, [updateBoardState]);

  const bringToFront = useCallback(
    (id: string) => {
      updateBoardState((prev) => {
        const maxZ = prev.elements.reduce(
          (acc, item) => Math.max(acc, item.z),
          0
        );
        return {
          ...prev,
          elements: prev.elements.map((item) =>
            item.id === id ? { ...item, z: maxZ + 1 } : item
          ),
          selectedId: id,
        };
      });
    },
    [updateBoardState]
  );

  const selectElement = useCallback(
    (id: string) => {
      bringToFront(id);
    },
    [bringToFront]
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<BoardElement>) => {
      updateBoardState((prev) => ({
        ...prev,
        elements: prev.elements.map((item) =>
          item.id === id ? ({ ...item, ...updates } as BoardElement) : item
        ),
      }));
    },
    [updateBoardState]
  );

  const removeElement = useCallback(
    (id: string) => {
      updateBoardState((prev) => {
        const target = prev.elements.find((item) => item.id === id);
        if (target?.kind === "image") {
          const url = objectUrlsRef.current[target.id];
          if (url) {
            URL.revokeObjectURL(url);
            delete objectUrlsRef.current[target.id];
          }
        }
        return {
          ...prev,
          elements: prev.elements.filter((item) => item.id !== id),
          selectedId: prev.selectedId === id ? null : prev.selectedId,
        };
      });
    },
    [updateBoardState]
  );

  const getSpawnPosition = useCallback(
    (width: number, height: number) => {
      const board = boardRef.current;
      if (!board) {
        return {
          x: Math.max(16, (window.innerWidth || 0) / 2 - width / 2),
          y: Math.max(16, (window.innerHeight || 0) / 2 - height / 2),
        };
      }
      return {
        x: board.clientWidth / 2 - width / 2,
        y: board.clientHeight / 2 - height / 2,
      };
    },
    []
  );

  const addTextElement = useCallback(() => {
    updateBoardState((prev) => {
      const maxZ = prev.elements.reduce(
        (acc, item) => Math.max(acc, item.z),
        0
      );
      const size = { w: 260, h: 140 };
      const spawn = getSpawnPosition(size.w, size.h);
      const element: TextElement = {
        id: generateId(),
        kind: "text",
        x: spawn.x,
        y: spawn.y,
        w: size.w,
        h: size.h,
        rotation: 0,
        z: maxZ + 1,
        text: "Double-click to edit",
        fontSize: 20,
        color: "#1f2937",
        align: "left",
      };
      return {
        ...prev,
        elements: [...prev.elements, element as BoardElement],
        selectedId: element.id,
      };
    });
    setActiveTool(null);
  }, [getSpawnPosition, updateBoardState]);

  const addImageFromFile = useCallback(
    (file: File, replaceId?: string) => {
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        const maxEdge = 480;
        const ratio = img.height ? img.width / img.height : 1;
        let width = img.width;
        let height = img.height;

        if (width > maxEdge) {
          width = maxEdge;
          height = width / ratio;
        }
        if (height > maxEdge) {
          height = maxEdge;
          width = height * ratio;
        }

        if (replaceId) {
          updateBoardState((prev) => {
            const elements = prev.elements.map((item) => {
              if (item.id !== replaceId || item.kind !== "image") return item;
              return {
                ...item,
                src: url,
                naturalW: img.width,
                naturalH: img.height,
                h: item.w / ratio,
              } as ImageElement;
            });
            objectUrlsRef.current[replaceId] = url;
            return { ...prev, elements };
          });
        } else {
          updateBoardState((prev) => {
            const maxZ = prev.elements.reduce(
              (acc, item) => Math.max(acc, item.z),
              0
            );
            const spawn = getSpawnPosition(width, height);
            const element: ImageElement = {
              id: generateId(),
              kind: "image",
              x: spawn.x,
              y: spawn.y,
              w: width,
              h: height,
              rotation: 0,
              z: maxZ + 1,
              src: url,
              naturalW: img.width,
              naturalH: img.height,
            };
            objectUrlsRef.current[element.id] = url;
            return {
              ...prev,
              elements: [...prev.elements, element],
              selectedId: element.id,
            };
          });
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [getSpawnPosition, updateBoardState]
  );

  const handleReplaceImage = useCallback(
    (id: string, file: File) => {
      const existing = objectUrlsRef.current[id];
      if (existing) {
        URL.revokeObjectURL(existing);
        delete objectUrlsRef.current[id];
      }
      addImageFromFile(file, id);
    },
    [addImageFromFile]
  );

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        addImageFromFile(file);
      }
      event.target.value = "";
      setActiveTool(null);
    },
    [addImageFromFile]
  );

  const openImagePicker = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const applyBackground = useCallback(
    (updates: BackgroundMode | Partial<BackgroundMode>) => {
      updateBoardState((prev) => {
        let nextBackground: BackgroundMode;
        if ("type" in updates && updates.type) {
          nextBackground = updates as BackgroundMode;
        } else if (prev.background.type === "pattern" && "pattern" in updates) {
          nextBackground = { ...prev.background, ...(updates as Partial<BackgroundMode>) } as BackgroundMode;
        } else {
          nextBackground = { ...prev.background, ...(updates as Partial<BackgroundMode>) } as BackgroundMode;
        }
        return { ...prev, background: nextBackground };
      });
    },
    [updateBoardState]
  );

  const boardSurfaceStyle = useMemo<React.CSSProperties>(() => {
    if (boardState.background.type === "pattern") {
      const pattern = boardState.background;
      return {
        backgroundColor: pattern.bgColor,
        backgroundImage: getPatternImage({
          type: pattern.pattern,
          patternColor: pattern.patternColor,
          size: Number(pattern.size),
        }),
        backgroundSize: `${Number(pattern.size)}px ${Number(pattern.size)}px`,
        backgroundRepeat: "repeat",
      };
    }
    return { backgroundColor: boardState.background.bgColor };
  }, [boardState.background]);

  const backgroundTab =
    boardState.background.type === "pattern" ? "pattern" : "solid";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setShiftPressed(true);
      }

      if (isEditableTarget(event.target)) return;

      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selectedIdRef.current
      ) {
        event.preventDefault();
        removeElement(selectedIdRef.current);
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setActiveTool(null);
        deselect();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [deselect, removeElement]);

  return (
    <div
      ref={boardRef}
      className="relative h-screen w-screen overflow-hidden"
      style={boardSurfaceStyle}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest(".canvas-item")) {
          deselect();
        }
      }}
    >
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleImageUpload}
      />

      {boardState.elements.map((element) => (
        <CanvasItem
          key={element.id}
          element={element}
          selected={boardState.selectedId === element.id}
          shiftPressed={shiftPressed}
          onSelect={selectElement}
          onBringToFront={bringToFront}
          onChange={updateElement}
          onDelete={removeElement}
          onReplaceImage={handleReplaceImage}
        />
      ))}

      {activeTool === "background" && (
        <div
          data-canvas-ignore-keys
          className="pointer-events-auto absolute bottom-24 left-1/2 z-40 w-[min(360px,calc(100vw-32px))] -translate-x-1/2 rounded-2xl border border-border-subtle bg-white/95 p-4 shadow-xl"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-ink-soft">
            Background
          </div>

          <div className="mb-4 flex gap-2">
            <button
              type="button"
              className={clsx(
                "flex-1 rounded-full border px-3 py-2 text-sm font-medium transition",
                backgroundTab === "solid"
                  ? "border-indigo-400 bg-indigo-50 text-indigo-500"
                  : "border-border-subtle bg-white text-ink-soft hover:text-ink"
              )}
              onClick={() => applyBackground({ type: "solid" })}
            >
              Solid
            </button>
            <button
              type="button"
              className={clsx(
                "flex-1 rounded-full border px-3 py-2 text-sm font-medium transition",
                backgroundTab === "pattern"
                  ? "border-indigo-400 bg-indigo-50 text-indigo-500"
                  : "border-border-subtle bg-white text-ink-soft hover:text-ink"
              )}
              onClick={() =>
                applyBackground({
                  type: "pattern",
                  pattern: "dots",
                  bgColor:
                    boardState.background.type === "pattern"
                      ? boardState.background.bgColor
                      : boardState.background.bgColor,
                  patternColor:
                    boardState.background.type === "pattern"
                      ? boardState.background.patternColor
                      : (INITIAL_PATTERN as any).patternColor,
                  size:
                    boardState.background.type === "pattern"
                      ? boardState.background.size
                      : (INITIAL_PATTERN as any).size,
                })
              }
            >
              Pattern
            </button>
          </div>

          {boardState.background.type === "solid" && (
            <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-ink-soft">
              Color
              <input
                type="color"
                value={boardState.background.bgColor}
                onChange={(event) =>
                  applyBackground({
                    type: "solid",
                    bgColor: event.target.value,
                  })
                }
                className="h-9 w-16 cursor-pointer rounded border border-border-subtle bg-transparent p-1"
              />
            </label>
          )}

          {boardState.background.type === "pattern" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-soft">
                  Pattern
                </span>
                <select
                  value={boardState.background.pattern}
                  onChange={(event) =>
                    applyBackground({
                      type: "pattern",
                      pattern: event.target.value as "dots" | "sparkle" | "grid",
                    })
                  }
                  className="w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="dots">Dots</option>
                  <option value="sparkle">Sparkle</option>
                  <option value="grid">Grid</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.28em] text-ink-soft">
                  Background
                  <input
                    type="color"
                    value={boardState.background.bgColor}
                    onChange={(event) =>
                      applyBackground({ bgColor: event.target.value })
                    }
                    className="h-9 w-full cursor-pointer rounded border border-border-subtle bg-transparent p-1"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.28em] text-ink-soft">
                  Pattern
                  <input
                    type="color"
                    value={boardState.background.patternColor}
                    onChange={(event) =>
                      applyBackground({ patternColor: event.target.value })
                    }
                    className="h-9 w-full cursor-pointer rounded border border-border-subtle bg-transparent p-1"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-ink-soft">
                Size
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={4}
                    max={96}
                    step={4}
                    value={boardState.background.size}
                    onChange={(event) =>
                      applyBackground({ size: Number(event.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="text-xs font-medium text-ink">
                    {boardState.background.size}px
                  </span>
                </div>
              </label>
            </div>
          )}
        </div>
      )}

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3">
        <button
          type="button"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-md transition hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          onClick={addTextElement}
        >
          <Type size={18} />
        </button>

        <button
          type="button"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-md transition hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          onClick={openImagePicker}
        >
          <ImageIcon size={18} />
        </button>

        <button
          type="button"
          className={clsx(
            "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-300",
            activeTool === "background" && "bg-indigo-500 text-white"
          )}
          onClick={() =>
            setActiveTool((prev) => (prev === "background" ? null : "background"))
          }
        >
          <Palette size={18} />
        </button>
      </div>
    </div>
  );
};

export default CanvasBoard;
