"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import Image from "next/image";
import {
  Type,
  Image as ImageIcon,
  Smile,
  Calendar,
  Sparkles,
  Wand2,
  Music2,
  Palette as PaletteIcon,
} from "lucide-react";
import CanvasItem from "./canvas-item";
import {
  BackgroundMode,
  BoardElement,
  BoardState,
  DateElement,
  EmojiElement,
  ImageElement,
  StickerElement,
  TextElement,
  ThemeFilter,
} from "./types";
import { getPatternImage } from "./patterns";

type ThemeId = "neutral" | "kawaii" | "retro";

type ThemeDefinition = {
  id: ThemeId;
  label: string;
  fontFamily: string;
  surface: string;
  text: string;
  subtle: string;
  primary: string;
};

const THEMES: Record<ThemeId, ThemeDefinition> = {
  neutral: {
    id: "neutral",
    label: "Neutral",
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    surface: "#ffffff",
    text: "#0f172a",
    subtle: "#d4d4d8",
    primary: "#6366f1",
  },
  kawaii: {
    id: "kawaii",
    label: "Kawaii",
    fontFamily: '"Baloo 2", "Comic Sans MS", "Trebuchet MS", cursive',
    surface: "#fff0f6",
    text: "#4a044e",
    subtle: "#f9a8d4",
    primary: "#f472b6",
  },
  retro: {
    id: "retro",
    label: "Retro",
    fontFamily: '"Futura", "Avenir", "Trebuchet MS", sans-serif',
    surface: "#fff7ed",
    text: "#3b2716",
    subtle: "#fed7aa",
    primary: "#f97316",
  },
};

const DEFAULT_BACKGROUND: BackgroundMode = {
  type: "solid",
  bgColor: "#f7f7f7",
};

const DEFAULT_FILTER: ThemeFilter = "none";

type ActiveTool = "background" | "stickers" | "emoji" | null;

type StickerAsset = { id: string; src: string; alt: string; pack: ThemeId };

const FILTER_STYLE_MAP: Record<ThemeFilter, string> = {
  none: "none",
  retro: "contrast(1.05) saturate(1.15) sepia(0.08)",
  pastel: "saturate(0.92) brightness(1.05)",
  glow: "brightness(1.15) contrast(0.95) saturate(1.1)",
};

const BACKGROUND_PRESETS = [
  "#f5f3ff",
  "#fdf2f8",
  "#ecfeff",
  "#fef3c7",
  "#fef9c3",
  "#e0f2fe",
  "#f1f5f9",
];

const FILTER_OPTIONS: { id: ThemeFilter; label: string }[] = [
  { id: "none", label: "Off" },
  { id: "retro", label: "Retro Grain" },
  { id: "pastel", label: "Pastel" },
  { id: "glow", label: "Glow" },
];

const FRAME_OPTIONS: { id: ImageElement["frame"]; label: string }[] = [
  { id: "none", label: "None" },
  { id: "polaroid", label: "Polaroid" },
  { id: "rounded", label: "Soft" },
  { id: "taped", label: "Tape" },
];

const TEXTURE_OPTIONS: { id: ImageElement["texture"]; label: string }[] = [
  { id: "none", label: "Clean" },
  { id: "noise", label: "Noise" },
  { id: "grain", label: "Grain" },
  { id: "paper", label: "Paper" },
];

const STICKER_PACKS: { id: string; label: string; items: StickerAsset[] }[] = [
  {
    id: "kawaii",
    label: "Kawaii",
    items: [
      {
        id: "kawaii-star",
        src: "/Images/stickers/kawaii-star.svg",
        alt: "Sparkle star",
        pack: "kawaii",
      },
      {
        id: "kawaii-heart",
        src: "/Images/stickers/kawaii-heart.svg",
        alt: "Candy heart",
        pack: "kawaii",
      },
    ],
  },
  {
    id: "retro",
    label: "Retro",
    items: [
      {
        id: "retro-smile",
        src: "/Images/stickers/retro-smile.svg",
        alt: "Retro smile",
        pack: "retro",
      },
      {
        id: "retro-tape",
        src: "/Images/stickers/retro-tape.svg",
        alt: "Washi tape",
        pack: "retro",
      },
    ],
  },
];

const EMOJI_SET = ["🌸", "🌿", "📸", "✨", "💌", "🌈", "⭐️", "🪄", "🍓", "🎞️"];

const MAX_UPLOAD_SIZE = 2 * 1024 * 1024;

const randomFrom = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length) % items.length];

const isImageBackground = (
  value: unknown
): value is Extract<BackgroundMode, { type: "image" }> => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { type?: unknown; src?: unknown };
  return candidate.type === "image" && typeof candidate.src === "string";
};

const SHEET_BASE_CLASSES =
  "pointer-events-none absolute left-1/2 z-40 -translate-x-1/2 bottom-[128px] rounded-3xl border border-[var(--k-subtle)] bg-[var(--k-surface)] text-[var(--k-text)] shadow-xl transition duration-200 ease-out";
const SHEET_OPEN_CLASSES = "pointer-events-auto opacity-100 translate-y-0";
const SHEET_CLOSED_CLASSES = "opacity-0 translate-y-4";

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
      updates.pattern === "sparkle" ||
      updates.pattern === "grid" ||
      updates.pattern === "lined"
        ? updates.pattern
        : "dots";
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

  if (isImageBackground(updates)) {
    const fit = updates.fit === "contain" ? "contain" : "cover";
    return {
      type: "image",
      src: updates.src,
      fit,
    };
  }

  return fallback;
};

const normalizeElement = (raw: unknown, fallbackZ: number): BoardElement | null => {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as Record<string, unknown>;

  const getNumber = (value: unknown): number | undefined =>
    typeof value === "number" && Number.isFinite(value) ? value : undefined;
  const getString = (value: unknown): string | undefined =>
    typeof value === "string" ? value : undefined;

  const kind =
    getString(payload.kind) ??
    getString(payload.type);

  const base = {
    id: getString(payload.id) ?? generateId(),
    x: getNumber(payload.x) ?? 60,
    y: getNumber(payload.y) ?? 60,
    w: getNumber(payload.w) ?? getNumber(payload.width) ?? 200,
    h: getNumber(payload.h) ?? getNumber(payload.height) ?? 140,
    rotation: getNumber(payload.rotation) ?? 0,
    z: getNumber(payload.z) ?? fallbackZ,
  };

  if (kind === "text") {
    const align = getString(payload.align);
    return {
      ...base,
      kind: "text",
      text: getString(payload.text) ?? "Double-click to edit",
      fontSize: getNumber(payload.fontSize) ?? 20,
      color: getString(payload.color) ?? "#1f2937",
      align: align === "center" || align === "right" ? align : "left",
      fontFamily: getString(payload.fontFamily),
      weight: getNumber(payload.weight),
      italic: Boolean(payload.italic),
    } as TextElement;
  }

  if (kind === "image" && getString(payload.src)) {
    const frame = getString(payload.frame);
    const texture = getString(payload.texture);
    const filter = getString(payload.filter);
    const textureIntensity = getNumber(payload.textureIntensity);
    return {
      ...base,
      kind: "image",
      src: getString(payload.src)!,
      naturalW: getNumber(payload.naturalW),
      naturalH: getNumber(payload.naturalH),
      frame: frame === "polaroid" || frame === "rounded" || frame === "taped" ? frame : "none",
      texture:
        texture === "noise" || texture === "grain" || texture === "paper"
          ? texture
          : "none",
      filter: filter === "retro" || filter === "pastel" || filter === "glow" ? filter : "none",
      textureIntensity:
        textureIntensity !== undefined && textureIntensity >= 0 && textureIntensity <= 1
          ? textureIntensity
          : 0.4,
    } as ImageElement;
  }

  if (kind === "sticker" && getString(payload.src)) {
    return {
      ...base,
      kind: "sticker",
      src: getString(payload.src)!,
      pack: getString(payload.pack) ?? "default",
    } as StickerElement;
  }

  if (kind === "emoji" && getString(payload.emoji)) {
    return {
      ...base,
      kind: "emoji",
      emoji: getString(payload.emoji)!,
      fontSize: getNumber(payload.fontSize) ?? 72,
    } as EmojiElement;
  }

  if (kind === "date" && getString(payload.label)) {
    const align = getString(payload.align);
    return {
      ...base,
      kind: "date",
      label: getString(payload.label)!,
      fontSize: getNumber(payload.fontSize) ?? 18,
      color: getString(payload.color) ?? "#334155",
      align: align === "center" || align === "right" ? align : "left",
      fontFamily: getString(payload.fontFamily),
      weight: getNumber(payload.weight) ?? 600,
      italic: Boolean(payload.italic),
    } as DateElement;
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
    return { background: fallback, elements: [], selectedId: null, filter: DEFAULT_FILTER };
  }

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return { background: fallback, elements: [], selectedId: null, filter: DEFAULT_FILTER };
    }

    const parsed = JSON.parse(raw);
    const background = normalizeBackground(parsed.background, fallback);

    const elements: BoardElement[] = Array.isArray(parsed.elements)
      ? parsed.elements
          .map((item: unknown, index: number) => normalizeElement(item, index + 1))
          .filter((item: BoardElement | null): item is BoardElement => Boolean(item))
      : [];

    const selectedId =
      typeof parsed.selectedId === "string" ? parsed.selectedId : null;

    const filter: ThemeFilter =
      parsed.filter === "retro" || parsed.filter === "pastel" || parsed.filter === "glow"
        ? parsed.filter
        : DEFAULT_FILTER;

    return { background, elements, selectedId, filter };
  } catch {
    return { background: fallback, elements: [], selectedId: null, filter: DEFAULT_FILTER };
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
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [shiftPressed, setShiftPressed] = useState(false);
  const [popupDismissMode, setPopupDismissMode] = useState<"auto" | "manual">("auto");
  const [themeId, setThemeId] = useState<ThemeId>("neutral");
  const [isThemeSwitcherOpen, setIsThemeSwitcherOpen] = useState(false);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const backgroundInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlsRef = useRef<Record<string, string>>({});
  const backgroundUrlRef = useRef<string | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const selectedIdRef = useRef<string | null>(boardState.selectedId ?? null);
  const backgroundPanelRef = useRef<HTMLDivElement | null>(null);
  const stickerPanelRef = useRef<HTMLDivElement | null>(null);
  const emojiPanelRef = useRef<HTMLDivElement | null>(null);
  const themeSwitcherRef = useRef<HTMLDivElement | null>(null);
  const themeButtonRef = useRef<HTMLButtonElement | null>(null);

  const currentTheme = THEMES[themeId];

  const themeCssVars = useMemo(
    () => ({
      "--k-surface": currentTheme.surface,
      "--k-text": currentTheme.text,
      "--k-subtle": currentTheme.subtle,
      "--k-primary": currentTheme.primary,
      "--k-font": currentTheme.fontFamily,
    }),
    [currentTheme]
  );

  const fontOptions = useMemo(
    () =>
      [currentTheme, ...Object.values(THEMES).filter((theme) => theme.id !== themeId)].map(
      (theme) => ({ id: theme.id, label: theme.label, family: theme.fontFamily })
    ),
    [currentTheme, themeId]
  );

  const availableStickerAssets = useMemo(() => {
    if (themeId === "neutral") {
      return STICKER_PACKS.flatMap((pack) => pack.items);
    }
    const pack = STICKER_PACKS.find((item) => item.id === themeId);
    return pack ? pack.items : [];
  }, [themeId]);

  const toggleTool = useCallback((tool: ActiveTool) => {
    setActiveTool((prev) => (prev === tool ? null : tool));
    setIsThemeSwitcherOpen(false);
  }, []);

  useEffect(() => {
    selectedIdRef.current = boardState.selectedId ?? null;
  }, [boardState.selectedId]);

  useEffect(() => {
    if (popupDismissMode !== "auto" || !activeTool) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        backgroundPanelRef.current?.contains(target) ||
        stickerPanelRef.current?.contains(target) ||
        emojiPanelRef.current?.contains(target)
      ) {
        return;
      }

      const element = target instanceof HTMLElement ? target : null;
      if (element?.closest("[data-canvas-toolbar]")) {
        return;
      }

      setActiveTool(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [activeTool, popupDismissMode]);

  useEffect(() => {
    if (!isThemeSwitcherOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        themeSwitcherRef.current?.contains(target) ||
        themeButtonRef.current?.contains(target)
      ) {
        return;
      }
      setIsThemeSwitcherOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isThemeSwitcherOpen]);

  useEffect(
    () => () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
      Object.values(objectUrlsRef.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
      if (backgroundUrlRef.current) {
        URL.revokeObjectURL(backgroundUrlRef.current);
        backgroundUrlRef.current = null;
      }
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
      setActiveTool(null);
      setIsThemeSwitcherOpen(false);
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
              frame: "none",
              texture: "none",
              filter: "none",
              textureIntensity: 0.4,
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

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > MAX_UPLOAD_SIZE) {
          window.alert("Please choose an image under 2MB.");
        } else {
          addImageFromFile(file);
        }
      }
      event.target.value = "";
      setActiveTool(null);
    },
    [addImageFromFile]
  );

  const openImagePicker = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleBackgroundImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      if (file.size > MAX_UPLOAD_SIZE) {
        window.alert("Please choose an image under 2MB.");
        return;
      }
      const url = URL.createObjectURL(file);
      if (backgroundUrlRef.current) {
        URL.revokeObjectURL(backgroundUrlRef.current);
      }
      backgroundUrlRef.current = url;
      updateBoardState((prev) => ({
        ...prev,
        background: {
          type: "image",
          src: url,
          fit: prev.background.type === "image" ? prev.background.fit : "cover",
        },
      }));
      event.target.value = "";
    },
    [updateBoardState]
  );

  const openBackgroundPicker = useCallback(() => {
    backgroundInputRef.current?.click();
  }, []);

  const setBackgroundFit = useCallback(
    (fit: "cover" | "contain") => {
      updateBoardState((prev) => ({
        ...prev,
        background:
          prev.background.type === "image"
            ? { ...prev.background, fit }
            : prev.background,
      }));
    },
    [updateBoardState]
  );

  const clearBackgroundImage = useCallback(() => {
    if (backgroundUrlRef.current) {
      URL.revokeObjectURL(backgroundUrlRef.current);
      backgroundUrlRef.current = null;
    }
    updateBoardState((prev) => ({
      ...prev,
      background: { type: "solid", bgColor: DEFAULT_BACKGROUND.bgColor },
    }));
  }, [updateBoardState]);

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
        if (prev.background.type === "image" && nextBackground.type !== "image" && backgroundUrlRef.current) {
          URL.revokeObjectURL(backgroundUrlRef.current);
          backgroundUrlRef.current = null;
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
        filter: FILTER_STYLE_MAP[boardState.filter],
      };
    }
    if (boardState.background.type === "image") {
      return {
        backgroundColor: "#f9fafb",
        backgroundImage: `url(${boardState.background.src})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: boardState.background.fit === "contain" ? "contain" : "cover",
        filter: FILTER_STYLE_MAP[boardState.filter],
      };
    }
    return {
      backgroundColor: boardState.background.bgColor,
      filter: FILTER_STYLE_MAP[boardState.filter],
    };
  }, [boardState.background, boardState.filter]);

  const backgroundTab =
    boardState.background.type === "pattern" ? "pattern" : "solid";

  const selectedElement = useMemo(
    () =>
      boardState.selectedId
        ? boardState.elements.find((item) => item.id === boardState.selectedId) ?? null
        : null,
    [boardState.elements, boardState.selectedId]
  );

  const [inspectorElement, setInspectorElement] = useState<BoardElement | null>(
    () => selectedElement ?? null
  );

  useEffect(() => {
    if (selectedElement) {
      setInspectorElement(selectedElement);
      return;
    }
    const timeout = window.setTimeout(() => setInspectorElement(null), 180);
    return () => window.clearTimeout(timeout);
  }, [selectedElement]);

  const updateSelectedText = useCallback(
    (updates: Partial<TextElement> | Partial<DateElement>) => {
      if (!selectedElement) return;
      if (selectedElement.kind === "text" || selectedElement.kind === "date") {
        updateElement(selectedElement.id, updates as Partial<BoardElement>);
      }
    },
    [selectedElement, updateElement]
  );

  const updateSelectedImage = useCallback(
    (updates: Partial<ImageElement>) => {
      if (!selectedElement || selectedElement.kind !== "image") return;
      updateElement(selectedElement.id, updates);
    },
    [selectedElement, updateElement]
  );

  const inspectorTarget = inspectorElement ?? selectedElement ?? null;
  const isTextSelected =
    inspectorTarget?.kind === "text" || inspectorTarget?.kind === "date";
  const isImageSelected = inspectorTarget?.kind === "image";
  const textElement = isTextSelected
    ? (inspectorTarget as TextElement | DateElement)
    : null;
  const imageElement = isImageSelected
    ? (inspectorTarget as ImageElement)
    : null;
  const defaultFontFamily = currentTheme.fontFamily;
  const inspectorOpen = Boolean(selectedElement) && activeTool === null;
  const inspectorShouldRender = inspectorElement !== null;
  const isBackgroundOpen = activeTool === "background";
  const isStickersOpen = activeTool === "stickers";
  const isEmojiOpen = activeTool === "emoji";

  const addSticker = useCallback(
    (asset: StickerAsset) => {
      updateBoardState((prev) => {
        const maxZ = prev.elements.reduce((acc, item) => Math.max(acc, item.z), 0);
        const size = 180;
        const spawn = getSpawnPosition(size, size);
        const element: StickerElement = {
          id: generateId(),
          kind: "sticker",
          x: spawn.x,
          y: spawn.y,
          w: size,
          h: size,
          rotation: 0,
          z: maxZ + 1,
          src: asset.src,
          pack: asset.pack,
        };
        return {
          ...prev,
          elements: [...prev.elements, element],
          selectedId: element.id,
        };
      });
      setActiveTool(null);
    },
    [getSpawnPosition, updateBoardState]
  );

  const addEmoji = useCallback(
    (emoji: string) => {
      updateBoardState((prev) => {
        const maxZ = prev.elements.reduce((acc, item) => Math.max(acc, item.z), 0);
        const size = 120;
        const spawn = getSpawnPosition(size, size);
        const element: EmojiElement = {
          id: generateId(),
          kind: "emoji",
          x: spawn.x,
          y: spawn.y,
          w: size,
          h: size,
          rotation: 0,
          z: maxZ + 1,
          emoji,
          fontSize: 84,
        };
        return {
          ...prev,
          elements: [...prev.elements, element],
          selectedId: element.id,
        };
      });
      setActiveTool(null);
    },
    [getSpawnPosition, updateBoardState]
  );

  const addDateStamp = useCallback(() => {
    const formatter = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const label = formatter.format(new Date());
    updateBoardState((prev) => {
      const maxZ = prev.elements.reduce((acc, item) => Math.max(acc, item.z), 0);
      const size = { w: 200, h: 80 };
      const spawn = getSpawnPosition(size.w, size.h);
      const element: DateElement = {
        id: generateId(),
        kind: "date",
        x: spawn.x,
        y: spawn.y,
        w: size.w,
        h: size.h,
        rotation: 0,
        z: maxZ + 1,
        label,
        fontSize: 18,
        color: "#0f172a",
        align: "left",
        weight: 600,
      };
      return {
        ...prev,
        elements: [...prev.elements, element],
        selectedId: element.id,
      };
    });
  }, [getSpawnPosition, updateBoardState]);

  const addMusicWidget = useCallback(() => {
    const size = { w: 340, h: 180 };
    const spawn = getSpawnPosition(size.w, size.h);
    updateBoardState((prev) => {
      const maxZ = prev.elements.reduce((acc, item) => Math.max(acc, item.z), 0);
      const element: ImageElement = {
        id: generateId(),
        kind: "image",
        x: spawn.x,
        y: spawn.y,
        w: size.w,
        h: size.h,
        rotation: 0,
        z: maxZ + 1,
        src: "/Images/widgets/spotify-demo.png",
        frame: "rounded",
        texture: "none",
        filter: "none",
        textureIntensity: 0,
      };
      return {
        ...prev,
        elements: [...prev.elements, element],
        selectedId: element.id,
      };
    });
  }, [getSpawnPosition, updateBoardState]);

  const setBoardFilter = useCallback(
    (filter: ThemeFilter) => {
      updateBoardState((prev) => ({ ...prev, filter }));
    },
    [updateBoardState]
  );

  const triggerSurprise = useCallback(() => {
    const bgColor = randomFrom(BACKGROUND_PRESETS);
    const stickerPack = randomFrom(STICKER_PACKS);
    const stickerAsset = randomFrom(stickerPack.items);
    if (backgroundUrlRef.current) {
      URL.revokeObjectURL(backgroundUrlRef.current);
      backgroundUrlRef.current = null;
    }
    updateBoardState((prev) => ({
      ...prev,
      background: { type: "solid", bgColor },
      filter: randomFrom(FILTER_OPTIONS).id,
    }));
    addSticker(stickerAsset);
  }, [addSticker, updateBoardState]);

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
      className="relative h-screen w-screen overflow-hidden text-[var(--k-text)]"
      style={{ ...boardSurfaceStyle, ...themeCssVars, fontFamily: "var(--k-font)" }}
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
      <input
        ref={backgroundInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleBackgroundImageUpload}
      />

      <div className="absolute right-6 top-6 z-40 flex flex-col items-end gap-2 text-[var(--k-text)]">
        <button
          ref={themeButtonRef}
          type="button"
          className="flex items-center gap-2 rounded-full border border-[var(--k-subtle)] bg-[var(--k-surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] shadow-md transition hover:border-[var(--k-primary)] hover:text-[var(--k-primary)]"
          onClick={() => {
            setIsThemeSwitcherOpen((prev) => !prev);
            setActiveTool(null);
          }}
          aria-expanded={isThemeSwitcherOpen}
        >
          <PaletteIcon size={16} />
          {currentTheme.label}
        </button>
        <div
          ref={themeSwitcherRef}
          className={clsx(
            "w-40 rounded-2xl border border-[var(--k-subtle)] bg-[var(--k-surface)] p-3 shadow-lg transition duration-200 ease-out",
            isThemeSwitcherOpen
              ? "opacity-100 translate-y-0"
              : "pointer-events-none opacity-0 -translate-y-2"
          )}
        >
          <div className="flex flex-col gap-2 text-sm">
            {Object.values(THEMES).map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={clsx(
                  "flex items-center justify-between rounded-lg border px-3 py-2 transition",
                  theme.id === themeId
                    ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                    : "border-[var(--k-subtle)] text-[var(--k-text)] hover:border-[var(--k-primary)] hover:text-[var(--k-primary)]"
                )}
                onClick={() => {
                  setThemeId(theme.id);
                  setIsThemeSwitcherOpen(false);
                  setActiveTool(null);
                }}
              >
                <span>{theme.label}</span>
                <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--k-subtle)]">
                  {theme.id === themeId ? "Active" : "Switch"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {inspectorShouldRender && (
        <div
          data-canvas-ignore-keys
          className={clsx(
            SHEET_BASE_CLASSES,
            "w-[min(560px,calc(100vw-32px))] p-5 space-y-4",
            inspectorOpen ? SHEET_OPEN_CLASSES : SHEET_CLOSED_CLASSES
          )}
          aria-hidden={!inspectorOpen}
        >
          {isTextSelected && textElement && (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
                Text Style
              </div>
              <div className="flex flex-wrap gap-2">
                {fontOptions.map((option) => {
                  const isActive =
                    (textElement.fontFamily ?? defaultFontFamily) === option.family;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={clsx(
                        "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition bg-[var(--k-surface)]",
                        isActive
                          ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                          : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
                      )}
                      onClick={() => updateSelectedText({ fontFamily: option.family })}
                      disabled={!inspectorOpen}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
                  Size
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={12}
                      max={80}
                      step={1}
                      value={Math.round(textElement.fontSize)}
                      onChange={(event) =>
                        updateSelectedText({ fontSize: Number(event.target.value) })
                      }
                      className="flex-1"
                      style={{ accentColor: "var(--k-primary)" }}
                      disabled={!inspectorOpen}
                    />
                    <span className="text-xs font-medium text-[var(--k-text)]">
                      {Math.round(textElement.fontSize)}px
                    </span>
                  </div>
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
                  Color
                  <input
                    type="color"
                    value={textElement.color}
                    onChange={(event) =>
                      updateSelectedText({ color: event.target.value })
                    }
                    className="h-9 w-full cursor-pointer rounded border border-[var(--k-subtle)] bg-[var(--k-surface)] p-1"
                    disabled={!inspectorOpen}
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={clsx(
                    "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition bg-[var(--k-surface)]",
                    (textElement.weight ?? 500) >= 600
                      ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                      : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
                  )}
                  onClick={() =>
                    updateSelectedText({
                      weight: (textElement.weight ?? 500) >= 600 ? 500 : 700,
                    })
                  }
                  disabled={!inspectorOpen}
                >
                  Bold
                </button>
                <button
                  type="button"
                  className={clsx(
                    "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition bg-[var(--k-surface)]",
                    textElement.italic
                      ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                      : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
                  )}
                  onClick={() =>
                    updateSelectedText({ italic: !textElement.italic })
                  }
                  disabled={!inspectorOpen}
                >
                  Italic
                </button>
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    className={clsx(
                      "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition bg-[var(--k-surface)]",
                      textElement.align === align
                        ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                        : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
                    )}
                    onClick={() => updateSelectedText({ align })}
                    disabled={!inspectorOpen}
                  >
                    {align.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isImageSelected && imageElement && (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
                Photo Style
              </div>
              <div className="flex flex-wrap gap-2">
                {FRAME_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={clsx(
                      "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition bg-[var(--k-surface)]",
                      (imageElement.frame ?? "none") === option.id
                        ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                        : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
                    )}
                    onClick={() => updateSelectedImage({ frame: option.id })}
                    disabled={!inspectorOpen}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {TEXTURE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={clsx(
                      "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition bg-[var(--k-surface)]",
                      (imageElement.texture ?? "none") === option.id
                        ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                        : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
                    )}
                    onClick={() => updateSelectedImage({ texture: option.id })}
                    disabled={!inspectorOpen}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {imageElement.texture !== "none" && (
                <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
                  Texture Intensity
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={Math.round((imageElement.textureIntensity ?? 0.4) * 100)}
                      onChange={(event) =>
                        updateSelectedImage({
                          textureIntensity: Number(event.target.value) / 100,
                        })
                      }
                      className="flex-1"
                      style={{ accentColor: "var(--k-primary)" }}
                      disabled={!inspectorOpen}
                    />
                    <span className="text-xs font-medium text-[var(--k-text)]">
                      {Math.round((imageElement.textureIntensity ?? 0.4) * 100)}%
                    </span>
                  </div>
                </label>
              )}
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={clsx(
                      "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition bg-[var(--k-surface)]",
                      (imageElement.filter ?? "none") === option.id
                        ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                        : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
                    )}
                    onClick={() => updateSelectedImage({ filter: option.id })}
                    disabled={!inspectorOpen}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
        />
      ))}

      <div
        ref={backgroundPanelRef}
        data-canvas-ignore-keys
        className={clsx(
          SHEET_BASE_CLASSES,
          "w-[min(420px,calc(100vw-32px))] p-5 space-y-4",
          isBackgroundOpen ? SHEET_OPEN_CLASSES : SHEET_CLOSED_CLASSES
        )}
        aria-hidden={!isBackgroundOpen}
      >
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
          <span>Background</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-[var(--k-subtle)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--k-subtle)] transition hover:border-[var(--k-primary)] hover:text-[var(--k-primary)]"
              onClick={openBackgroundPicker}
            >
              Upload
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--k-subtle)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--k-subtle)] transition hover:border-[var(--k-primary)] hover:text-[var(--k-primary)]"
              onClick={() => setActiveTool(null)}
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            className={clsx(
              "rounded-full border px-3 py-2 text-sm font-medium transition bg-[var(--k-surface)]",
              backgroundTab === "solid"
                ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
            )}
            onClick={() => applyBackground({ type: "solid" })}
          >
            Solid
          </button>
          <button
            type="button"
            className={clsx(
              "rounded-full border px-3 py-2 text-sm font-medium transition bg-[var(--k-surface)]",
              backgroundTab === "pattern"
                ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
            )}
            onClick={() =>
              applyBackground({
                type: "pattern",
                pattern: "dots",
                bgColor: boardState.background.bgColor,
                patternColor:
                  boardState.background.type === "pattern"
                    ? boardState.background.patternColor
                    : INITIAL_PATTERN.patternColor,
                size:
                  boardState.background.type === "pattern"
                    ? boardState.background.size
                    : INITIAL_PATTERN.size,
              })
            }
          >
            Pattern
          </button>
          <button
            type="button"
            className={clsx(
              "rounded-full border px-3 py-2 text-sm font-medium transition bg-[var(--k-surface)]",
              boardState.background.type === "image"
                ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
            )}
            onClick={openBackgroundPicker}
          >
            Photo
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {BACKGROUND_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={"Set background " + color}
              className={clsx(
                "h-8 w-8 rounded-full border transition",
                boardState.background.type === "solid" &&
                  boardState.background.bgColor === color
                  ? "border-[var(--k-primary)] shadow-[0_2px_8px_rgba(99,102,241,0.35)]"
                  : "border-[var(--k-subtle)] hover:border-[var(--k-primary)]"
              )}
              style={{ backgroundColor: color }}
              onClick={() => applyBackground({ type: "solid", bgColor: color })}
            />
          ))}
        </div>

        {boardState.background.type === "solid" && (
          <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
            Custom Color
            <input
              type="color"
              value={boardState.background.bgColor}
              onChange={(event) =>
                applyBackground({
                  type: "solid",
                  bgColor: event.target.value,
                })
              }
              className="h-9 w-16 cursor-pointer rounded border border-[var(--k-subtle)] bg-[var(--k-surface)] p-1"
            />
          </label>
        )}

        {boardState.background.type === "pattern" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
                Pattern
              </span>
              <select
                value={boardState.background.pattern}
                onChange={(event) =>
                  applyBackground({
                    type: "pattern",
                    pattern: event.target.value as "dots" | "sparkle" | "grid" | "lined",
                  })
                }
                className="w-full rounded-lg border border-[var(--k-subtle)] bg-[var(--k-surface)] px-3 py-2 text-sm text-[var(--k-text)] outline-none focus:border-[var(--k-primary)]"
              >
                <option value="dots">Dots</option>
                <option value="sparkle">Sparkle</option>
                <option value="grid">Grid</option>
                <option value="lined">Lined</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
                Background
                <input
                  type="color"
                  value={boardState.background.bgColor}
                  onChange={(event) =>
                    applyBackground({ bgColor: event.target.value })
                  }
                  className="h-9 w-full cursor-pointer rounded border border-[var(--k-subtle)] bg-[var(--k-surface)] p-1"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
                Pattern
                <input
                  type="color"
                  value={boardState.background.patternColor}
                  onChange={(event) =>
                    applyBackground({ patternColor: event.target.value })
                  }
                  className="h-9 w-full cursor-pointer rounded border border-[var(--k-subtle)] bg-[var(--k-surface)] p-1"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
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
                  style={{ accentColor: "var(--k-primary)" }}
                />
                <span className="text-xs font-medium text-[var(--k-text)]">
                  {boardState.background.size}px
                </span>
              </div>
            </label>
          </div>
        )}

        {boardState.background.type === "image" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={clsx(
                  "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition bg-[var(--k-surface)]",
                  boardState.background.fit === "cover"
                    ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                    : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
                )}
                onClick={() => setBackgroundFit("cover")}
              >
                Cover
              </button>
              <button
                type="button"
                className={clsx(
                  "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition bg-[var(--k-surface)]",
                  boardState.background.fit === "contain"
                    ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                    : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
                )}
                onClick={() => setBackgroundFit("contain")}
              >
                Contain
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-[var(--k-subtle)] bg-[var(--k-surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--k-text)] transition hover:border-[var(--k-primary)] hover:text-[var(--k-primary)]"
                onClick={openBackgroundPicker}
              >
                Replace Photo
              </button>
              <button
                type="button"
                className="rounded-full border border-[var(--k-subtle)] bg-[var(--k-surface)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 transition hover:border-rose-300"
                onClick={clearBackgroundImage}
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
            Filters
          </span>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={clsx(
                  "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition bg-[var(--k-surface)]",
                  boardState.filter === option.id
                    ? "border-[var(--k-primary)] text-[var(--k-primary)]"
                    : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
                )}
                onClick={() => setBoardFilter(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={stickerPanelRef}
        data-canvas-ignore-keys
        className={clsx(
          SHEET_BASE_CLASSES,
          "w-[min(420px,calc(100vw-32px))] p-5 space-y-4",
          isStickersOpen ? SHEET_OPEN_CLASSES : SHEET_CLOSED_CLASSES
        )}
        aria-hidden={!isStickersOpen}
      >
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
          <span>Stickers</span>
          <button
            type="button"
            className="rounded-full border border-[var(--k-subtle)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--k-subtle)] transition hover:border-[var(--k-primary)] hover:text-[var(--k-primary)]"
            onClick={() => setActiveTool(null)}
          >
            Close
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {availableStickerAssets.map((item) => (
            <button
              key={item.id}
              type="button"
              className="group flex h-20 w-20 items-center justify-center rounded-xl border border-[var(--k-subtle)] bg-[var(--k-surface)] transition hover:border-[var(--k-primary)] hover:bg-[var(--k-surface)]/90"
              onClick={() => addSticker(item)}
              aria-label={"Add " + item.alt}
              disabled={!isStickersOpen}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={56}
                height={56}
                className="h-14 w-14 object-contain drop-shadow-sm transition group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={emojiPanelRef}
        data-canvas-ignore-keys
        className={clsx(
          SHEET_BASE_CLASSES,
          "w-[min(320px,calc(100vw-32px))] p-5 space-y-4",
          isEmojiOpen ? SHEET_OPEN_CLASSES : SHEET_CLOSED_CLASSES
        )}
        aria-hidden={!isEmojiOpen}
      >
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-[var(--k-subtle)]">
          <span>Emoji</span>
          <button
            type="button"
            className="rounded-full border border-[var(--k-subtle)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--k-subtle)] transition hover:border-[var(--k-primary)] hover:text-[var(--k-primary)]"
            onClick={() => setActiveTool(null)}
          >
            Close
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {EMOJI_SET.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--k-subtle)] bg-[var(--k-surface)] text-lg transition hover:border-[var(--k-primary)] hover:bg-[var(--k-surface)]/90"
              onClick={() => addEmoji(emoji)}
              disabled={!isEmojiOpen}
            >
              <span className="text-xl">{emoji}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3"
        data-canvas-toolbar
      >
        <button
          type="button"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--k-subtle)] bg-[var(--k-surface)] text-[var(--k-text)] shadow-md transition hover:border-[var(--k-primary)] hover:text-[var(--k-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--k-primary)]/30"
          onClick={addTextElement}
        >
          <Type size={18} />
        </button>

        <button
          type="button"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--k-subtle)] bg-[var(--k-surface)] text-[var(--k-text)] shadow-md transition hover:border-[var(--k-primary)] hover:text-[var(--k-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--k-primary)]/30"
          onClick={openImagePicker}
        >
          <ImageIcon size={18} />
        </button>

        <button
          type="button"
          className={clsx(
            "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--k-subtle)] bg-[var(--k-surface)] text-[var(--k-text)] shadow-md transition focus:outline-none focus:ring-2 focus:ring-[var(--k-primary)]/30",
            isStickersOpen && "border-[var(--k-primary)] text-[var(--k-primary)]"
          )}
          onClick={() => toggleTool("stickers")}
        >
          <Sparkles size={18} />
        </button>

        <button
          type="button"
          className={clsx(
            "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--k-subtle)] bg-[var(--k-surface)] text-[var(--k-text)] shadow-md transition focus:outline-none focus:ring-2 focus:ring-[var(--k-primary)]/30",
            isEmojiOpen && "border-[var(--k-primary)] text-[var(--k-primary)]"
          )}
          onClick={() => toggleTool("emoji")}
        >
          <Smile size={18} />
        </button>

        <button
          type="button"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--k-subtle)] bg-[var(--k-surface)] text-[var(--k-text)] shadow-md transition hover:border-[var(--k-primary)] hover:text-[var(--k-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--k-primary)]/30"
          onClick={addMusicWidget}
        >
          <Music2 size={18} />
        </button>

        <button
          type="button"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--k-subtle)] bg-[var(--k-surface)] text-[var(--k-text)] shadow-md transition hover:border-[var(--k-primary)] hover:text-[var(--k-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--k-primary)]/30"
          onClick={addDateStamp}
        >
          <Calendar size={18} />
        </button>

        <button
          type="button"
          className={clsx(
            "pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--k-subtle)] bg-[var(--k-surface)] text-[var(--k-text)] shadow-md transition focus:outline-none focus:ring-2 focus:ring-[var(--k-primary)]/30",
            isBackgroundOpen && "border-[var(--k-primary)] text-[var(--k-primary)]"
          )}
          onClick={() => toggleTool("background")}
        >
          <PaletteIcon size={18} />
        </button>

        <button
          type="button"
          className="pointer-events-auto flex h-12 items-center justify-center rounded-full border border-[var(--k-primary)] bg-[var(--k-primary)] px-5 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--k-surface)] shadow-md transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--k-primary)]/30"
          onClick={triggerSurprise}
        >
          <Wand2 size={18} className="mr-2" />
          Surprise
        </button>

        <button
          type="button"
          className={clsx(
            "pointer-events-auto flex h-12 items-center justify-center rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.18em] transition bg-[var(--k-surface)]",
            popupDismissMode === "auto"
              ? "border-[var(--k-primary)] text-[var(--k-primary)]"
              : "border-[var(--k-subtle)] text-[var(--k-subtle)] hover:text-[var(--k-text)]"
          )}
          aria-pressed={popupDismissMode === "auto"}
          onClick={() =>
            setPopupDismissMode((prev) => (prev === "auto" ? "manual" : "auto"))
          }
        >
          {`Auto Close: ${popupDismissMode === "auto" ? "On" : "Off"}`}
        </button>
      </div>
    </div>
  );
};

export default CanvasBoard;
