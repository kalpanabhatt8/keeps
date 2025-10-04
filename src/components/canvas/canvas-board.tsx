"use client";
// All available fonts (merged from all theme fonts)
const allFonts = [
  "Inter", "Arial", "Helvetica", "sans-serif",
  "Comic Sans MS", "Baloo", "Quicksand", "cursive",
  "VT323", "Press Start 2P", "Courier New", "monospace",
  "Noto Sans JP", "M PLUS Rounded 1c", "Kosugi Maru", "sans-serif"
];
// Font family options by theme
const fontsByTheme: Record<Theme, string[]> = {
  neutral: allFonts,
  kawaii: ["Comic Sans MS", "Baloo", "Quicksand", "cursive"],
  retro: ["VT323", "Press Start 2P", "Courier New", "monospace"],
  anime: ["Noto Sans JP", "M PLUS Rounded 1c", "Kosugi Maru", "sans-serif"],
};

type TextElement = {
  id: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  align: "left" | "center" | "right";
  curve: boolean;
  x: number;
  y: number;
  rotation: number;
  isEditing?: boolean;
};

import React, { useEffect } from "react";
import {
  LucideType,
  LucideImage,
  LucideStars,
  LucideSmile,
  LucideMusic,
  LucidePalette,
  LucideHeart,
  LucideCandy,
  LucideFlower,
  LucideSun,
  LucideMusic4,
  LucideCake,
  LucideRainbow,
  LucideMonitor,
  LucideCamera,
  LucideDisc,
  LucideClock,
  LucideBrush,
  LucideSword,
  LucideSparkles,
  LucideCloud,
  LucideGhost,
  LucideMusic2,
  LucideMoon,
  LucidePen,
  LucideGamepad,
  LucideVault,
  RotateCw,
  Trash2,
} from "lucide-react";
import clsx from "clsx";
import Popup from "reactjs-popup";
// import { LucideType } from "";

type Theme = "neutral" | "kawaii" | "retro" | "anime";

// Shared tokens for theme-aware styling (buttons, hover, panels)
const buttonClass = (theme: Theme) =>
  `p-3 rounded-full flex items-center justify-center transition ${
    theme === "neutral"
      ? "bg-white text-black"
      : theme === "kawaii"
      ? "bg-pink-200 text-pink-800"
      : theme === "retro"
      ? "bg-yellow-200 text-brown-800"
      : "bg-purple-200 text-purple-800"
  }`;

const hoverFX = (theme: Theme) => {
  const common = "relative transition-all duration-300 will-change-transform";
  switch (theme) {
    case "neutral":
      return `${common} hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] after:content-[''] after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-black/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity`;
    case "kawaii":
      return `${common} hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(255,105,180,0.35)] after:content-[''] after:absolute after:-inset-1 after:rounded-full after:bg-[radial-gradient(ellipse_at_center,rgba(255,182,193,0.45),transparent_60%)] after:opacity-0 hover:after:opacity-100 after:blur-sm after:transition-opacity`;
    case "retro":
      return `${common} hover:-translate-y-[3px] hover:translate-x-[3px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.25)]`;
    case "anime":
      return `${common} hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(99,102,241,0.45)] before:content-[''] before:absolute before:inset-[-2px] before:rounded-full before:opacity-0 before:ring-2 before:ring-current hover:before:opacity-100 before:transition-all`;
    default:
      return common;
  }
};

const panelThemeClass = (theme: Theme) =>
  theme === "neutral"
    ? "bg-white text-black"
    : theme === "kawaii"
    ? "bg-pink-100 text-pink-800"
    : theme === "retro"
    ? "bg-yellow-100 text-yellow-800"
    : "bg-purple-100 text-purple-800";

// Theme → icon mapping specifically for the Background tool
const backgroundIconByTheme: Record<Theme, React.ComponentType<{ size?: number }>> = {
  neutral: LucidePalette,
  kawaii: LucideSun,
  retro: LucideBrush,
  anime: LucideMoon,
};

// Theme → icon mapping for the "Add Text" button
const textIconByTheme: Record<Theme, React.ComponentType<{ size?: number }>> = {
  neutral: LucideType,
  kawaii: LucideCandy,
  retro: LucideMonitor,
  anime: LucideSparkles,
};

type CanvasBoardProps = {
  storageKey: string;
  initialBackground?: string;
};

const iconSets = {
  neutral: [
    LucideType,
    LucideImage,
    LucideStars,
    LucideSmile,
    LucideMusic,
    LucidePalette,
    LucidePen,
  ],
  kawaii: [
    LucideHeart,
    LucideCandy,
    LucideFlower,
    LucideSun,
    LucideMusic4,
    LucideCake,
    LucideRainbow,
  ],
  retro: [
    LucideMonitor,
    LucideCamera,
    LucideDisc,
    LucideGamepad,
    LucideVault,
    LucideClock,
    LucideBrush,
  ],
  anime: [
    LucideSword,
    LucideSparkles,
    LucideCloud,
    LucideGhost,
    LucideMusic2,
    LucideMoon,
    LucidePen,
  ],
};

type ThemeSelectorProps = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, setTheme }) => {
  const [open, setOpen] = React.useState(false);

  const themes: Theme[] = ["neutral", "kawaii", "retro", "anime"];

  const themeIcons = {
    neutral: LucidePalette,
    kawaii: LucideHeart,
    retro: LucideMonitor,
    anime: LucideSparkles,
  };

  const CurrentIcon = themeIcons[theme];

  return (
    <Popup
      trigger={
        <button
          aria-label="Select theme"
          className="flex items-center justify-center rounded-full p-3 shadow bg-white"
        >
          <CurrentIcon size={18} />
        </button>
      }
      position="bottom right"
      closeOnDocumentClick
      arrow={false}
      contentStyle={{ padding: "0.5rem", borderRadius: "0.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <div
        className={clsx(
          "flex flex-col gap-2 p-2 rounded-lg",
          theme === "neutral" && "bg-white text-black",
          theme === "kawaii" && "bg-pink-100 text-pink-800",
          theme === "retro" && "bg-yellow-100 text-yellow-800",
          theme === "anime" && "bg-purple-100 text-purple-800"
        )}
      >
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTheme(t);
              setOpen(false);
            }}
            className={clsx(
              "px-4 py-2 rounded text-left text-sm font-medium transition text-ink",
              theme === t ? "bg-[var(--k-primary)] text-ink" : "hover:bg-primary hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </Popup>
  );
};

type BackgroundPopupProps = {
  setBackground: React.Dispatch<React.SetStateAction<{
    color?: string;
    pattern?: string;
    image?: string;
    texture?: string;
  }>>;
  background: {
    color?: string;
    pattern?: string;
    image?: string;
    texture?: string;
  };
  theme: Theme;
};

const BackgroundPopup: React.FC<BackgroundPopupProps> = ({ setBackground, background, theme }) => {
  const [open, setOpen] = React.useState(false);

  const presetColors = ["#ffffff", "#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];
  // Patterns using external URLs from transparenttextures.com
  const patterns = [
    { name: "Stripes", style: "url('https://www.transparenttextures.com/patterns/diagmonds-light.png')" },
    { name: "Dots", style: "url('https://www.transparenttextures.com/patterns/dots.png')" },
    { name: "Paper", style: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')" },
  ];
  const textures = [
    { name: "Paper", style: "url('https://www.transparenttextures.com/patterns/paper.png')" },
    { name: "Noise", style: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')" },
  ];

  const onColorChange = (color: string) => {
    setBackground((prev) => ({ ...prev, color }));
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBackground((prev) => ({ ...prev, image: url }));
    }
  };

  const onPatternChange = (pattern?: string) => {
    setBackground((prev) => ({ ...prev, pattern }));
  };

  const onTextureChange = (texture?: string) => {
    setBackground((prev) => ({ ...prev, texture }));
  };

  const resetBackground = () => {
    setBackground({});
    setOpen(false);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Popup
      trigger={
        <button
          aria-label="Select background"
          className={clsx(buttonClass(theme), hoverFX(theme))}
        >
          {React.createElement(backgroundIconByTheme[theme], { size: 18 })}
        </button>
      }
      position="top center"
      closeOnDocumentClick
      arrow={false}
      contentStyle={{ padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", maxWidth: "280px" }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <div className={clsx("flex flex-col gap-4 p-2 rounded-lg", panelThemeClass(theme))}>
        {/* Solid Color */}
        <div>
          <p className="text-sm font-semibold mb-1">Solid Color</p>
          <div className="flex gap-2 mb-2">
            {presetColors.map((color) => (
              <div
                key={color}
                onClick={() => onColorChange(color)}
                className={clsx(
                  "w-6 h-6 rounded-full cursor-pointer border-2 border-transparent",
                  background.color === color ? "border-black" : "",
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={background.color || "#ffffff"}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-20 h-8 p-0 border-none cursor-pointer"
          />
        </div>

        {/* Pattern */}
        <div>
          <p className="text-sm font-semibold mb-1">Pattern</p>
          <div className="flex gap-2">
            <button
              onClick={() => onPatternChange(undefined)}
              className={clsx(
                "w-12 h-12 rounded border-2 border-transparent flex items-center justify-center text-red-600 text-xl font-bold cursor-pointer",
                background.pattern === undefined ? "border-black" : "hover:border-gray-400",
              )}
              title="None"
            >
              ❌
            </button>
            {patterns.map(({ name, style }) => (
              <button
                key={name}
                onClick={() => onPatternChange(style)}
                className={clsx(
                  "w-12 h-12 rounded border-2 border-transparent",
                  background.pattern === style ? "border-black" : "hover:border-gray-400",
                )}
                title={name}
                style={{
                  backgroundImage: style,
                  backgroundSize: "20px 20px",
                  backgroundRepeat: "repeat",
                  backgroundPosition: "0 0"
                }}
              />
            ))}
          </div>
        </div>

        {/* Background Image */}
        <div>
          <p className="text-sm font-semibold mb-1">Background Image</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={triggerFileInput}
              className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 transition"
            >
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setBackground((prev) => ({ ...prev, image: undefined }))}
              className="rounded border border-red-500 text-red-500 px-3 py-1 hover:bg-red-100 transition"
              title="Remove Image"
            >
              ❌
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        {/* Texture */}
        <div>
          <p className="text-sm font-semibold mb-1">Texture</p>
          <div className="flex gap-2">
            <button
              onClick={() => onTextureChange(undefined)}
              className={clsx(
                "px-3 py-1 rounded border-2 border-transparent text-xs text-red-600 font-bold cursor-pointer",
                background.texture === undefined ? "border-black" : "hover:border-gray-400",
              )}
              title="None"
            >
              ❌
            </button>
            {textures.map(({ name, style }) => (
              <button
                key={name}
                onClick={() => onTextureChange(style)}
                className={clsx(
                  "px-3 py-1 rounded border-2 border-transparent text-xs",
                  background.texture === style ? "border-black" : "hover:border-gray-400",
                )}
                title={name}
                style={{ backgroundImage: style, backgroundSize: "auto", backgroundRepeat: "repeat" }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={resetBackground}
          className="mt-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 transition"
        >
          Reset Background
        </button>
      </div>
    </Popup>
  );
};

const CanvasBoard: React.FC<CanvasBoardProps> = ({ storageKey }) => {
  const [theme, setTheme] = React.useState<Theme>("neutral");
  const [background, setBackground] = React.useState<{
    color?: string;
    pattern?: string;
    image?: string;
    texture?: string;
  }>({});

  // Text elements state
  const [textElements, setTextElements] = React.useState<TextElement[]>([]);
  // Add a new text element at default position
  const addTextElement = () => {
    const defaultFont = fontsByTheme[theme][0];
    const newId = `text-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    // Default position: center-ish, but offset if multiple
    const offset = textElements.length * 30;
    const newEl: TextElement = {
      id: newId,
      text: "New Text",
      fontSize: 32,
      fontFamily: defaultFont,
      bold: false,
      italic: false,
      align: "center",
      curve: false,
      x: 200 + offset,
      y: 150 + offset,
      rotation: 0,
      isEditing: false,
    };
    setTextElements((prev) => [...prev, newEl]);
    setSelectedTextId(newId);
  };

  // Handler for dragging text elements
  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setSelectedTextId(id);
    const el = textElements.find((el) => el.id === id);
    if (!el) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = el.x;
    const origY = el.y;
    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setTextElements((prev) =>
        prev.map((elem) =>
          elem.id === id
            ? { ...elem, x: origX + dx, y: origY + dy }
            : elem
        )
      );
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Handler to rotate text element
  const rotateSelectedText = (delta: number) => {
    if (!selectedTextId) return;
    setTextElements((prev) =>
      prev.map((el) =>
        el.id === selectedTextId
          ? { ...el, rotation: el.rotation + delta }
          : el
      )
    );
  };

  // Handler to delete selected text element or by id
  const deleteSelectedText = () => {
    if (!selectedTextId) return;
    setTextElements((prev) => prev.filter((el) => el.id !== selectedTextId));
    setSelectedTextId(null);
  };
  // Handler to delete text element by id
  const deleteTextElementById = (id: string) => {
    setTextElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedTextId === id) setSelectedTextId(null);
  };
  // Handler to clear the entire canvas (all text elements and background)
  const clearCanvas = () => {
    setTextElements([]);
    setBackground({});
  };
  const [selectedTextId, setSelectedTextId] = React.useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore storage errors during reset */
    }
  }, [storageKey]);

  // Handler to update properties of the selected text element
  const updateSelectedText = (updates: Partial<TextElement>) => {
    setTextElements((prev) =>
      prev.map((el) =>
        el.id === selectedTextId ? { ...el, ...updates } : el
      )
    );
  };
  // Handler to update a text element by id
  const updateTextElementById = (id: string, updates: Partial<TextElement>) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const CurrentIcons = iconSets[theme];
  const filteredIcons = CurrentIcons.filter((Icon) => Icon !== backgroundIconByTheme[theme]);

  // Find the selected text element
  const selectedText = textElements.find((el) => el.id === selectedTextId);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-4 border-neutral-300 p-8 text-center text-neutral-500"
      onClick={() => setSelectedTextId(null)}
    >
      {/* Background layers */}
      {background.color && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: background.color }}
        />
      )}
      {background.image && (
        <div
          className="absolute z-0 select-none pointer-events-none"
          style={{
            backgroundImage: `url(${background.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundClip: "border-box",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            position: "absolute",
          }}
        />
      )}
      {background.pattern && (
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: background.pattern,
            backgroundRepeat: "repeat",
            backgroundSize: "20px 20px",
          }}
        />
      )}
      {background.texture && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: background.texture,
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            opacity: 0.9,
            mixBlendMode: "multiply",
          }}
        />
      )}
      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeSelector theme={theme} setTheme={setTheme} />
      </div>
      <p className="text-lg font-semibold">Canvas board reset</p>
      <p className="text-sm">The interactive canvas is temporarily disabled while we rebuild it.</p>
      {/* Render text elements as draggable/rotatable */}
      <div className="relative mt-8 flex flex-col items-center" style={{ width: "100%", height: 400 }}>
        {textElements.map((el) => {
          const isSelected = el.id === selectedTextId;
          return (
            <div
              key={el.id}
              className={clsx(
                "absolute select-none transition group",
                isSelected
                  ? "outline-1 outline-blue-500"
                  : ""
              )}
              style={{
                left: el.x,
                top: el.y,
                transform: `rotate(${el.rotation}deg)`,
                fontSize: el.fontSize,
                fontFamily: el.fontFamily,
                fontWeight: el.bold ? "bold" : "normal",
                fontStyle: el.italic ? "italic" : "normal",
                textAlign: el.align,
                display: "inline-block",
                // padding: "0.25em 1em",
                cursor: el.isEditing ? "text" : "move",
                userSelect: el.isEditing ? "text" : "none",
                zIndex: isSelected ? 3 : 2,
                // Removed curve textShadow styling
                minWidth: 60,
                minHeight: 32,
              }}
              onMouseDown={
                el.isEditing
                  ? undefined
                  : (e) => handleDragStart(e, el.id)
              }
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTextId(el.id);
              }}
              onDoubleClick={() => {
                updateTextElementById(el.id, { isEditing: true });
                setSelectedTextId(el.id);
              }}
            >
              {/* Close (✖) button for selected text element */}
              {isSelected && (
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    deleteTextElementById(el.id);
                  }}
                  className="absolute -top-3 -right-3 z-20 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-700 shadow"
                  title="Delete text"
                  tabIndex={0}
                  style={{ fontSize: 16, lineHeight: 1 }}
                >
                  ✖
                </button>
              )}
              {/* Render input if editing, else render text */}
              {el.isEditing ? (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  autoFocus
                  spellCheck={false}
                  style={{
                    minWidth: 60,
                    minHeight: 32,
                    fontSize: el.fontSize,
                    fontFamily: el.fontFamily,
                    fontWeight: el.bold ? "bold" : "normal",
                    fontStyle: el.italic ? "italic" : "normal",
                    textAlign: el.align,
                    outline: "none",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    boxShadow: "none",
                    resize: "none",
                    color: "inherit",
                    // lineHeight: 1.2,
                    whiteSpace: "pre-line",
                  }}
                  className="focus:outline-none"
                  onBlur={e => {
                    // Save content as plain text with newlines
                    let html = e.currentTarget.innerHTML;
                    // Replace <div> and <br> with \n, remove other tags
                    html = html
                      .replace(/<div><br><\/div>/g, "\n")
                      .replace(/<div>/g, "\n")
                      .replace(/<\/div>/g, "")
                      .replace(/<br\s*\/?>/gi, "\n");
                    // Remove any remaining HTML tags (just in case)
                    const text = html.replace(/<\/?[^>]+(>|$)/g, "");
                    updateTextElementById(el.id, { text, isEditing: false });
                  }}
                  onInput={e => {
                    let html = (e.currentTarget as HTMLDivElement).innerHTML;
                    html = html
                      .replace(/<div><br><\/div>/g, "\n")
                      .replace(/<div>/g, "\n")
                      .replace(/<\/div>/g, "")
                      .replace(/<br\s*\/?>/gi, "\n");
                    const text = html.replace(/<\/?[^>]+(>|$)/g, "");
                    updateTextElementById(el.id, { text });
                  }}
                  onClick={e => e.stopPropagation()}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      // Insert line break instead of exiting editing mode
                      e.preventDefault();
                      document.execCommand("insertLineBreak");
                    }
                  }}
                  ref={node => {
                    if (node && node.innerText !== el.text) {
                      // Set content with newlines as <div> or <br>
                      // Convert \n to <div> or <br>
                      const html = el.text
                        .split("\n")
                        .map((line, idx, arr) =>
                          idx < arr.length - 1
                            ? line === ""
                              ? "<br>"
                              : `${line}<br>`
                            : line
                        )
                        .join("");
                      node.innerHTML = html;
                    }
                  }}
                />
              ) : (
                // Render newlines as <div> blocks for display
                el.text.split("\n").map((line, idx) => <div key={idx}>{line}</div>)
              )}
              {/* Popup toolbar for selected text */}
              {selectedText && selectedText.id === el.id && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-16 z-10 flex gap-2 items-center bg-white shadow-lg rounded p-2 border border-gray-200"
                  style={{
                    minWidth: 260,
                    whiteSpace: "nowrap",
                    fontFamily: "Inter, Arial, sans-serif"
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {/* Font size */}
                  <label
                    className="flex items-center gap-1 text-xs"
                    style={{ fontFamily: "Inter, Arial, sans-serif" }}
                  >
                    Size
                    <input
                      type="number"
                      min={8}
                      max={128}
                      value={selectedText.fontSize}
                      onChange={(e) =>
                        updateSelectedText({ fontSize: Number(e.target.value) })
                      }
                      className="w-14 px-1 py-0.5 border rounded"
                      style={{ fontFamily: "Inter, Arial, sans-serif" }}
                    />
                  </label>
                  {/* Font family */}
                  <label
                    className="flex items-center gap-1 text-xs"
                    style={{ fontFamily: "Inter, Arial, sans-serif" }}
                  >
                    Font
                    <select
                      value={selectedText.fontFamily}
                      onChange={(e) =>
                        updateSelectedText({ fontFamily: e.target.value })
                      }
                      className="px-1 py-0.5 border rounded"
                      style={{ fontFamily: "Inter, Arial, sans-serif" }}
                    >
                      {fontsByTheme[theme].map((font) => (
                        <option value={font} key={font} style={{ fontFamily: "Inter, Arial, sans-serif" }}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </label>
                  {/* Bold */}
                  <button
                    className={clsx(
                      "px-2 py-1 rounded font-bold text-xs",
                      selectedText.bold ? "bg-blue-200" : "bg-gray-100"
                    )}
                    style={{ fontFamily: "Inter, Arial, sans-serif" }}
                    onClick={() => updateSelectedText({ bold: !selectedText.bold })}
                    title="Bold"
                    type="button"
                  >
                    B
                  </button>
                  {/* Italic */}
                  <button
                    className={clsx(
                      "px-2 py-1 rounded italic text-xs",
                      selectedText.italic ? "bg-blue-200" : "bg-gray-100"
                    )}
                    style={{ fontFamily: "Inter, Arial, sans-serif" }}
                    onClick={() => updateSelectedText({ italic: !selectedText.italic })}
                    title="Italic"
                    type="button"
                  >
                    I
                  </button>
                  {/* Alignment */}
                  <div className="flex gap-0.5 items-center" style={{ fontFamily: "Inter, Arial, sans-serif" }}>
                    <button
                      className={clsx(
                        "px-2 py-1 rounded text-xs",
                        selectedText.align === "left" ? "bg-blue-200" : "bg-gray-100"
                      )}
                      style={{ fontFamily: "Inter, Arial, sans-serif" }}
                      onClick={() => updateSelectedText({ align: "left" })}
                      title="Align left"
                      type="button"
                    >
                      <span style={{ fontFamily: "monospace" }}>L</span>
                    </button>
                    <button
                      className={clsx(
                        "px-2 py-1 rounded text-xs",
                        selectedText.align === "center" ? "bg-blue-200" : "bg-gray-100"
                      )}
                      style={{ fontFamily: "Inter, Arial, sans-serif" }}
                      onClick={() => updateSelectedText({ align: "center" })}
                      title="Align center"
                      type="button"
                    >
                      <span style={{ fontFamily: "monospace" }}>C</span>
                    </button>
                    <button
                      className={clsx(
                        "px-2 py-1 rounded text-xs",
                        selectedText.align === "right" ? "bg-blue-200" : "bg-gray-100"
                      )}
                      style={{ fontFamily: "Inter, Arial, sans-serif" }}
                      onClick={() => updateSelectedText({ align: "right" })}
                      title="Align right"
                      type="button"
                    >
                      <span style={{ fontFamily: "monospace" }}>R</span>
                    </button>
                  </div>
                  {/* Curve removed */}
                  {/* Rotate removed from popup */}
                  {/* Delete */}
                  <button
                    className="px-2 py-1 rounded text-xs bg-red-100 hover:bg-red-300 text-red-700"
                    style={{ fontFamily: "Inter, Arial, sans-serif" }}
                    title="Delete"
                    type="button"
                    onClick={deleteSelectedText}
                  >
                    🗑️
                  </button>
                </div>
              )}
              {/* Rotate handle at bottom-left of selected text element */}
              {isSelected && (
                <RotateHandle
                  element={el}
                  updateRotation={(rotation: number) => updateTextElementById(el.id, { rotation })}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-8 flex gap-3 items-center">
        <BackgroundPopup theme={theme} setBackground={setBackground} background={background} />
        {/* Always render Add Text button */}
        <button
          className={clsx(buttonClass(theme), hoverFX(theme))}
          onClick={addTextElement}
          title="Add text"
          type="button"
        >
          {React.createElement(textIconByTheme[theme], { size: 18 })}
        </button>
        {/* Other toolbar icons */}
        {filteredIcons.map((Icon, index) => (
          <button
            key={index}
            className={clsx(buttonClass(theme), hoverFX(theme))}
          >
            <Icon size={18} />
          </button>
        ))}
        {/* Clear canvas button */}
        <button
          className={clsx(buttonClass(theme), hoverFX(theme))}
          onClick={clearCanvas}
          title="Clear canvas"
          type="button"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CanvasBoard;

// Manual rotate handle for text elements
const RotateHandle: React.FC<{
  element: TextElement;
  updateRotation: (rotation: number) => void;
}> = ({ element, updateRotation }) => {
  // We'll use a ref to track the center and current rotation
  const handleRef = React.useRef<HTMLDivElement>(null);
  // To avoid unnecessary updates, keep initial values in refs
  const initialAngleRef = React.useRef<number>(0);
  const startRotationRef = React.useRef<number>(0);

  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // Get the center of the text element on the page
    const parent = handleRef.current?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Mouse position at start
    const startX = e.clientX;
    const startY = e.clientY;
    // Calculate initial angle from center to mouse
    const dx = startX - centerX;
    const dy = startY - centerY;
    initialAngleRef.current = Math.atan2(dy, dx) * (180 / Math.PI);
    startRotationRef.current = element.rotation;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const mx = moveEvent.clientX;
      const my = moveEvent.clientY;
      const mdx = mx - centerX;
      const mdy = my - centerY;
      const angle = Math.atan2(mdy, mdx) * (180 / Math.PI);
      // The difference from initial angle
      let delta = angle - initialAngleRef.current;
      // Snap to -180..180
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      const newRotation = startRotationRef.current + delta;
      updateRotation(newRotation);
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Position: bottom-left, just outside the text element
  return (
    <div
      ref={handleRef}
      className="absolute z-20 flex items-center justify-center"
      style={{
        left: -16, // half of 10px + 6px margin
        bottom: -10, // just outside
        width: 20,
        height: 20,
        pointerEvents: "auto",
      }}
    >
      <div
        onMouseDown={onMouseDown}
        className="rounded-full border border-blue-400 bg-white hover:bg-blue-200 shadow"
        style={{
          width: 12,
          height: 12,
          cursor: "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        }}
        title="Drag to rotate"
      >
        <RotateCw size={10} className="text-blue-500" />
      </div>
    </div>
  );
};
