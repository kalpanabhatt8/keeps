"use client";
// Font family options by theme (all themes use the full font list)
const fontsByTheme: Record<Theme, string[]> = {
  neutral: [
    "var(--font-gochi)",
    "var(--font-mali)",
    "var(--font-elsie)",
    "var(--font-indieflower)",
    "var(--font-kaushan)",
    "var(--font-manrope)",
    "var(--font-lato)",
    "var(--font-poppins)",
    "var(--font-space-grotesk)",
    "var(--font-bricolage)",
    "var(--font-patrick-hand)",
    "var(--font-caveat)",
    "var(--font-plaster)",
    "var(--font-hachimarupop)",
    "var(--font-cutefont)",
    "var(--font-bangers)",
    "var(--font-gloria)",
    "var(--font-comicneue)",
    "var(--font-mochiy)",
    "var(--font-kosugimaru)",
    "var(--font-baloo2)",
    "var(--font-yusei)",
    "var(--font-pressstart)",
    "var(--font-minecraftia)",
    "var(--font-caress)",
    "var(--font-vensfolk)",
  ],
  kawaii: [
    "var(--font-gochi)",
    "var(--font-mali)",
    "var(--font-elsie)",
    "var(--font-indieflower)",
    "var(--font-kaushan)",
    "var(--font-manrope)",
    "var(--font-lato)",
    "var(--font-poppins)",
    "var(--font-space-grotesk)",
    "var(--font-bricolage)",
    "var(--font-patrick-hand)",
    "var(--font-caveat)",
    "var(--font-plaster)",
    "var(--font-hachimarupop)",
    "var(--font-cutefont)",
    "var(--font-bangers)",
    "var(--font-gloria)",
    "var(--font-comicneue)",
    "var(--font-mochiy)",
    "var(--font-kosugimaru)",
    "var(--font-baloo2)",
    "var(--font-yusei)",
    "var(--font-pressstart)",
    "var(--font-minecraftia)",
    "var(--font-caress)",
    "var(--font-vensfolk)",
  ],
  retro: [
    "var(--font-gochi)",
    "var(--font-mali)",
    "var(--font-elsie)",
    "var(--font-indieflower)",
    "var(--font-kaushan)",
    "var(--font-manrope)",
    "var(--font-lato)",
    "var(--font-poppins)",
    "var(--font-space-grotesk)",
    "var(--font-bricolage)",
    "var(--font-patrick-hand)",
    "var(--font-caveat)",
    "var(--font-plaster)",
    "var(--font-hachimarupop)",
    "var(--font-cutefont)",
    "var(--font-bangers)",
    "var(--font-gloria)",
    "var(--font-comicneue)",
    "var(--font-mochiy)",
    "var(--font-kosugimaru)",
    "var(--font-baloo2)",
    "var(--font-yusei)",
    "var(--font-pressstart)",
    "var(--font-minecraftia)",
    "var(--font-caress)",
    "var(--font-vensfolk)",
  ],
  anime: [
    "var(--font-gochi)",
    "var(--font-mali)",
    "var(--font-elsie)",
    "var(--font-indieflower)",
    "var(--font-kaushan)",
    "var(--font-manrope)",
    "var(--font-lato)",
    "var(--font-poppins)",
    "var(--font-space-grotesk)",
    "var(--font-bricolage)",
    "var(--font-patrick-hand)",
    "var(--font-caveat)",
    "var(--font-plaster)",
    "var(--font-hachimarupop)",
    "var(--font-cutefont)",
    "var(--font-bangers)",
    "var(--font-gloria)",
    "var(--font-comicneue)",
    "var(--font-mochiy)",
    "var(--font-kosugimaru)",
    "var(--font-baloo2)",
    "var(--font-yusei)",
    "var(--font-pressstart)",
    "var(--font-minecraftia)",
    "var(--font-caress)",
    "var(--font-vensfolk)",
  ],
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

// StickyNote element type
type StickyNoteElement = {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  bold: boolean;
  x: number;
  y: number;
  rotation: number;
};

// New: Image element type
type ImageElement = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  frame?: string; // e.g., "polaroid"
  texture?: string; // overlay style string
  opacity?: number;
  zIndex: number;
  flip?: boolean;
  filter?: string;
  dateStamp?: string;
  timeStamp?: string;
};

// Sticker element type
type StickerElement = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
};

// Audio element type
type AudioElement = {
  id: string;
  src: string;
  title?: string;
  artist?: string;
  x: number;
  y: number;
  zIndex: number;
  playing: boolean;
};
// Theme → icon mapping for the Sticker tool
const stickerIconByTheme: Record<Theme, React.ComponentType<{ size?: number }>> = {
  neutral: LucideSmile,
  kawaii: LucideHeart,
  retro: LucideDisc,
  anime: LucideGhost,
};

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
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
  LucideText,
  FileText as LucideFileText,
  StickyNote as LucideStickyNote,
  Book as LucideBook,
} from "lucide-react";
import clsx from "clsx";
const Popup = dynamic(() => import("reactjs-popup"), { ssr: false });
// import { LucideType } from "";

type Theme = "neutral" | "kawaii" | "retro" | "anime";

// Shared tokens for theme-aware styling (buttons, hover, panels)
const buttonClass = (theme: Theme) =>
  `p-3 rounded-full flex items-center justify-center transition ${theme === "neutral"
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
const backgroundIconByTheme: Record<
  Theme,
  React.ComponentType<{ size?: number }>
> = {
  neutral: LucidePalette, // 🎨
  kawaii: LucideFlower, // 🌸
  retro: LucideText, // 🖥️
  anime: LucideSparkles, // ✨
};

// Theme → icon mapping for the "Add Text" button
const textIconByTheme: Record<Theme, React.ComponentType<{ size?: number }>> = {
  neutral: LucideType,
  kawaii: LucideCandy,
  retro: LucideMonitor,
  anime: LucidePen,
};

// Theme → icon mapping for the Sticky Note button
const stickyNoteIconByTheme: Record<Theme, React.ComponentType<{ size?: number }>> = {
  neutral: LucideStickyNote,
  kawaii: LucideHeart,
  retro: LucideFileText,
  anime: LucideBook,
};

// Theme → icon mapping for the Audio tool
const audioIconByTheme: Record<Theme, React.ComponentType<{ size?: number }>> = {
  neutral: LucideMusic,
  kawaii: LucideMusic4,
  retro: LucideDisc,
  anime: LucideMusic2,
};

// Theme → icon mapping for the Music tool (mic/recording)
import {
  LucideMic,
  LucideMic2,
  LucideMicVocal,
  LucideMicOff,
} from "lucide-react";
const musicIconByTheme: Record<Theme, React.ComponentType<{ size?: number }>> = {
  neutral: LucideMic,
  kawaii: LucideMic2,
  retro: LucideMicVocal,
  anime: LucideMicOff,
};

type CanvasBoardProps = {
  storageKey: string;
  initialBackground?: string;
};

// Only unique, non-background, non-text icons for each theme:
// Ensure LucideImage is always the first tool in each array and no duplicates.
const iconSets = {
  neutral: [
    LucideImage, // image/photo
    LucideStars, // stars
    LucideSmile, // smile/emoji
    LucideMusic, // music/note
    LucidePen, // pen/drawing
  ],
  kawaii: [
    LucideImage, // image/photo
    LucideHeart, // heart
    LucideSun, // sun
    LucideMusic4, // music/note (different from neutral)
    LucideCake, // cake
    LucideRainbow, // rainbow
  ],
  retro: [
    LucideImage, // image/photo
    LucideCamera, // camera
    LucideDisc, // disc/vinyl
    LucideGamepad, // gamepad
    LucideClock, // clock
    LucideBrush, // brush
  ],
  anime: [
    LucideImage, // image/photo
    LucideSword, // sword
    LucideCloud, // cloud
    LucideGhost, // ghost
    LucideMusic2, // music/note
    LucideMoon, // moon
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
      contentStyle={{
        padding: "0.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
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
              theme === t
                ? "bg-[var(--k-primary)] text-ink"
                : "hover:bg-primary hover:text-white"
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
  setBackground: React.Dispatch<
    React.SetStateAction<{
      color?: string;
      pattern?: string;
      image?: string;
      texture?: string;
    }>
  >;
  background: {
    color?: string;
    pattern?: string;
    image?: string;
    texture?: string;
  };
  theme: Theme;
};

// Accepts onAddImage prop to add image elements instead of setting background image
const BackgroundPopup: React.FC<
  BackgroundPopupProps & { onAddImage?: (src: string) => void }
> = ({ setBackground, background, theme, onAddImage }) => {
  const [open, setOpen] = React.useState(false);

  const presetColors = [
    "#ffffff",
    "#f87171",
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#a78bfa",
  ];
  // Patterns using external URLs from transparenttextures.com
  const patterns = [
    {
      name: "Stripes",
      style:
        "url('https://www.transparenttextures.com/patterns/diagmonds-light.png')",
    },
    {
      name: "Dots",
      style: "url('https://www.transparenttextures.com/patterns/dots.png')",
    },
    {
      name: "Paper",
      style:
        "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
    },
  ];
  const textures = [
    {
      name: "Paper",
      style: "url('https://www.transparenttextures.com/patterns/paper.png')",
    },
    {
      name: "Noise",
      style:
        "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
    },
  ];

  const onColorChange = (color: string) => {
    setBackground((prev) => ({ ...prev, color }));
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (onAddImage) {
        onAddImage(url);
      } else {
        setBackground((prev) => ({ ...prev, image: url }));
      }
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
      contentStyle={{
        padding: "1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        maxWidth: "280px",
      }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <div
        className={clsx(
          "flex flex-col gap-4 p-2 rounded-lg",
          panelThemeClass(theme)
        )}
      >
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
                  background.color === color ? "border-black" : ""
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
                background.pattern === undefined
                  ? "border-black"
                  : "hover:border-gray-400"
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
                  background.pattern === style
                    ? "border-black"
                    : "hover:border-gray-400"
                )}
                title={name}
                style={{
                  backgroundImage: style,
                  backgroundSize: "20px 20px",
                  backgroundRepeat: "repeat",
                  backgroundPosition: "0 0",
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
              onClick={() =>
                setBackground((prev) => ({ ...prev, image: undefined }))
              }
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
                background.texture === undefined
                  ? "border-black"
                  : "hover:border-gray-400"
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
                  background.texture === style
                    ? "border-black"
                    : "hover:border-gray-400"
                )}
                title={name}
                style={{
                  backgroundImage: style,
                  backgroundSize: "auto",
                  backgroundRepeat: "repeat",
                }}
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

type AudioPopupProps = {
  theme: Theme;
  onAddAudio: (src: string, title?: string, artist?: string) => void;
};

const AudioPopup: React.FC<AudioPopupProps> = ({ theme, onAddAudio }) => {
  const [open, setOpen] = React.useState(false);
  // Use the music icon for toolbar trigger and modal
  const MusicIcon = musicIconByTheme[theme];
  // Recording state and refs for MediaRecorder
  const [isRecording, setIsRecording] = React.useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          onAddAudio(url, "Recording");
          stream.getTracks().forEach((t) => t.stop());
        };
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  return (
    <Popup
      trigger={
        <button
          aria-label="Add music"
          className={clsx(buttonClass(theme), hoverFX(theme))}
          type="button"
        >
          <MusicIcon size={18} />
        </button>
      }
      position="top center"
      closeOnDocumentClick
      arrow={false}
      contentStyle={{
        padding: "1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        maxWidth: "320px",
      }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <div
        className={clsx(
          "flex flex-col items-center justify-center gap-3 p-4 rounded-lg",
          panelThemeClass(theme)
        )}
      >
        <button
          type="button"
          onClick={handleMicClick}
          className={clsx(
            "rounded-full w-16 h-16 flex items-center justify-center",
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : theme === "neutral"
              ? "bg-gray-200 hover:bg-gray-300 text-black"
              : theme === "kawaii"
              ? "bg-pink-200 hover:bg-pink-300 text-pink-800"
              : theme === "retro"
              ? "bg-yellow-200 hover:bg-yellow-300 text-yellow-800"
              : "bg-purple-200 hover:bg-purple-300 text-purple-800"
          )}
          title={isRecording ? "Stop recording" : "Record audio"}
        >
          {isRecording ? "⏹" : <MusicIcon size={28} />}
        </button>
        <span className="text-sm opacity-80">Record your thoughts</span>
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
  // Sticky notes state
  const [stickyNotes, setStickyNotes] = React.useState<StickyNoteElement[]>([]);
  const [selectedStickyId, setSelectedStickyId] = React.useState<string | null>(
    null
  );
  // Add a new sticky note at default position
  const addStickyNote = () => {
    const newId = `sticky-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const offset = stickyNotes.length * 30;
    const newEl: StickyNoteElement = {
      id: newId,
      text: "Write something...",
      color: "#fff475", // Google Keep yellow
      fontSize: 18,
      bold: false,
      x: 180 + offset,
      y: 100 + offset,
      rotation: Math.round((Math.random() - 0.5) * 10), // -5 to +5 deg
    };
    setStickyNotes((prev) => [...prev, newEl]);
    setSelectedStickyId(newId);
    setSelectedTextId(null);
    setSelectedImageId(null);
  };

  // Handler for dragging sticky notes
  const handleStickyDragStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setSelectedStickyId(id);
    setSelectedTextId(null);
    setSelectedImageId(null);
    
    const el = stickyNotes.find((el) => el.id === id);
    if (!el) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = el.x;
    const origY = el.y;
    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setStickyNotes((prev) =>
        prev.map((elem) =>
          elem.id === id ? { ...elem, x: origX + dx, y: origY + dy } : elem
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

  // Handler to update sticky note by id
  const updateStickyNoteById = (
    id: string,
    updates: Partial<StickyNoteElement>
  ) => {
    setStickyNotes((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // Handler to delete sticky note by id
  const deleteStickyNoteById = (id: string) => {
    setStickyNotes((prev) => prev.filter((el) => el.id !== id));
    if (selectedStickyId === id) setSelectedStickyId(null);
  };
  // Image elements state
  const [imageElements, setImageElements] = React.useState<ImageElement[]>([]);
  // New: Add image element
  const addImageElement = (src: string) => {
    const newId = `img-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    // Default size: 160x160, default x/y center-ish, offset if multiple
    const offset = imageElements.length * 30;
    const now = new Date();
    // Format date as "Aug 8, 2025"
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    // Format time as "3:45 PM"
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const newEl: ImageElement = {
      id: newId,
      src,
      x: 220 + offset,
      y: 120 + offset,
      width: 160,
      height: 160,
      rotation: 0,
      zIndex: 10 + imageElements.length,
      opacity: 1,
      frame: undefined,
      texture: undefined,
      flip: false,
      dateStamp: dateStr,
      timeStamp: timeStr,
    };
    setImageElements((prev) => [...prev, newEl]);
    setSelectedImageId(newId);
  };
  // Image element selection
  const [selectedImageId, setSelectedImageId] = React.useState<string | null>(
    null
  );
  // Handler for dragging image elements
  const handleImageDragStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setSelectedImageId(id);
    const el = imageElements.find((el) => el.id === id);
    if (!el) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = el.x;
    const origY = el.y;
    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setImageElements((prev) =>
        prev.map((elem) =>
          elem.id === id ? { ...elem, x: origX + dx, y: origY + dy } : elem
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

  // Handler to resize image element (bottom-left handle)
  const handleImageResizeStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setSelectedImageId(id);
    const el = imageElements.find((el) => el.id === id);
    if (!el) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origWidth = el.width;
    const origHeight = el.height;
    const origX = el.x;
    const origY = el.y;
    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      let newWidth = origWidth - dx;
      let newHeight = origHeight + dy;
      let newX = origX + dx;
      if (newWidth < 32) {
        newX -= 32 - newWidth;
        newWidth = 32;
      }
      if (el.frame === "polaroid") {
        // Enforce 1:1 aspect ratio for polaroid frame
        newHeight = newWidth;
      } else {
        if (newHeight < 32) newHeight = 32;
      }
      setImageElements((prev) =>
        prev.map((elem) =>
          elem.id === id
            ? { ...elem, width: newWidth, height: newHeight, x: newX }
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

  // Handler to rotate image element (bottom-right handle)
  const handleImageRotateStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setSelectedImageId(id);
    const el = imageElements.find((el) => el.id === id);
    if (!el) return;
    const parent = (e.target as HTMLElement).parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startX = e.clientX;
    const startY = e.clientY;
    const dx = startX - centerX;
    const dy = startY - centerY;
    const initialAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    const startRotation = el.rotation;
    const onMove = (moveEvent: MouseEvent) => {
      const mx = moveEvent.clientX;
      const my = moveEvent.clientY;
      const mdx = mx - centerX;
      const mdy = my - centerY;
      const angle = Math.atan2(mdy, mdx) * (180 / Math.PI);
      let delta = angle - initialAngle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      const newRotation = startRotation + delta;
      setImageElements((prev) =>
        prev.map((elem) =>
          elem.id === id ? { ...elem, rotation: newRotation } : elem
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

  // Handler to update image element by id
  const updateImageElementById = (
    id: string,
    updates: Partial<ImageElement>
  ) => {
    setImageElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // Handler to delete image element by id
  const deleteImageElementById = (id: string) => {
    setImageElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedImageId === id) setSelectedImageId(null);
  };

  // Handler to bring forward/backward (zIndex)
  const changeImageZIndex = (id: string, dir: "up" | "down") => {
    setImageElements((prev) => {
      const idx = prev.findIndex((el) => el.id === id);
      if (idx === -1) return prev;
      let arr = [...prev];
      if (dir === "up" && idx < arr.length - 1) {
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      } else if (dir === "down" && idx > 0) {
        [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
      }
      // Reassign zIndex
      arr = arr.map((el, z) => ({ ...el, zIndex: 10 + z }));
      return arr;
    });
  };

  // --- Sticker elements state and handlers ---
  const [stickerElements, setStickerElements] = React.useState<StickerElement[]>([]);
  const [selectedStickerId, setSelectedStickerId] = React.useState<string | null>(null);

  // Add sticker element (from file or src)
  const addStickerElement = (src: string) => {
    const newId = `sticker-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const offset = stickerElements.length * 30;
    const newEl: StickerElement = {
      id: newId,
      src,
      x: 250 + offset,
      y: 130 + offset,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: 20 + stickerElements.length,
    };
    setStickerElements((prev) => [...prev, newEl]);
    setSelectedStickerId(newId);
    setSelectedTextId(null);
    setSelectedImageId(null);
    setSelectedStickyId(null);
  };

  // Handler for dragging stickers
  const handleStickerDragStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setSelectedStickerId(id);
    setSelectedTextId(null);
    setSelectedImageId(null);
    setSelectedStickyId(null);
    const el = stickerElements.find((el) => el.id === id);
    if (!el) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = el.x;
    const origY = el.y;
    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setStickerElements((prev) =>
        prev.map((elem) =>
          elem.id === id ? { ...elem, x: origX + dx, y: origY + dy } : elem
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

  // Handler to resize sticker (bottom-left handle)
  const handleStickerResizeStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setSelectedStickerId(id);
    setSelectedTextId(null);
    setSelectedImageId(null);
    setSelectedStickyId(null);
    const el = stickerElements.find((el) => el.id === id);
    if (!el) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origWidth = el.width;
    const origHeight = el.height;
    const origX = el.x;
    const origY = el.y;
    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      let newWidth = origWidth - dx;
      let newHeight = origHeight + dy;
      let newX = origX + dx;
      if (newWidth < 32) {
        newX -= 32 - newWidth;
        newWidth = 32;
      }
      if (newHeight < 32) newHeight = 32;
      setStickerElements((prev) =>
        prev.map((elem) =>
          elem.id === id
            ? { ...elem, width: newWidth, height: newHeight, x: newX }
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

  // Handler to rotate sticker (bottom-right handle)
  const handleStickerRotateStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setSelectedStickerId(id);
    setSelectedTextId(null);
    setSelectedImageId(null);
    setSelectedStickyId(null);
    const el = stickerElements.find((el) => el.id === id);
    if (!el) return;
    const parent = (e.target as HTMLElement).parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startX = e.clientX;
    const startY = e.clientY;
    const dx = startX - centerX;
    const dy = startY - centerY;
    const initialAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    const startRotation = el.rotation;
    const onMove = (moveEvent: MouseEvent) => {
      const mx = moveEvent.clientX;
      const my = moveEvent.clientY;
      const mdx = mx - centerX;
      const mdy = my - centerY;
      const angle = Math.atan2(mdy, mdx) * (180 / Math.PI);
      let delta = angle - initialAngle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      const newRotation = startRotation + delta;
      setStickerElements((prev) =>
        prev.map((elem) =>
          elem.id === id ? { ...elem, rotation: newRotation } : elem
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

  // Handler to update sticker element by id
  const updateStickerElementById = (
    id: string,
    updates: Partial<StickerElement>
  ) => {
    setStickerElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // Handler to delete sticker by id
  const deleteStickerElementById = (id: string) => {
    setStickerElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };
  // --- Audio elements state and handlers ---
  const [audioElements, setAudioElements] = React.useState<AudioElement[]>([]);
  const [selectedAudioId, setSelectedAudioId] = React.useState<string | null>(null);

  // Add a new audio element
  const addAudioElement = (src: string, title?: string, artist?: string) => {
    const newId = `audio-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const offset = audioElements.length * 30;
    const newEl: AudioElement = {
      id: newId,
      src,
      title,
      artist,
      x: 300 + offset,
      y: 200 + offset,
      zIndex: 100 + audioElements.length,
      playing: false,
    };
    setAudioElements((prev) => [...prev, newEl]);
    setSelectedAudioId(newId);
    setSelectedTextId(null);
    setSelectedImageId(null);
    setSelectedStickyId(null);
    setSelectedStickerId(null);
  };

  // Handler for dragging audio elements
  const handleAudioDragStart = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setSelectedAudioId(id);
    setSelectedTextId(null);
    setSelectedImageId(null);
    setSelectedStickyId(null);
    setSelectedStickerId(null);
    const el = audioElements.find((el) => el.id === id);
    if (!el) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = el.x;
    const origY = el.y;
    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setAudioElements((prev) =>
        prev.map((elem) =>
          elem.id === id ? { ...elem, x: origX + dx, y: origY + dy } : elem
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

  // Toggle play/pause for audio element
  const toggleAudioPlay = (id: string) => {
    setAudioElements((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          // Toggle playing state
          const newPlaying = !el.playing;
          // Play/pause the audio tag
          const audioTag = document.getElementById(`audio-${id}`) as HTMLAudioElement | null;
          if (audioTag) {
            if (newPlaying) {
              audioTag.play();
            } else {
              audioTag.pause();
            }
          }
          return { ...el, playing: newPlaying };
        } else {
          // Pause others
          const audioTag = document.getElementById(`audio-${el.id}`) as HTMLAudioElement | null;
          if (audioTag) audioTag.pause();
          return { ...el, playing: false };
        }
      })
    );
  };

  // Handler to delete audio element by id
  const deleteAudioElementById = (id: string) => {
    setAudioElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedAudioId === id) setSelectedAudioId(null);
  };

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
          elem.id === id ? { ...elem, x: origX + dx, y: origY + dy } : elem
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
        el.id === selectedTextId ? { ...el, rotation: el.rotation + delta } : el
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
  // Handler to clear the entire canvas (all text elements, sticky notes, and background)
  const clearCanvas = () => {
    setTextElements([]);
    setStickyNotes([]);
    setBackground({});
  };
  const [selectedTextId, setSelectedTextId] = React.useState<string | null>(
    null
  );

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
      prev.map((el) => (el.id === selectedTextId ? { ...el, ...updates } : el))
    );
  };
  // Handler to update a text element by id
  const updateTextElementById = (id: string, updates: Partial<TextElement>) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const CurrentIcons = iconSets[theme];
  // Exclude both background and text icons for this theme
  const filteredIcons = CurrentIcons.filter(
    (Icon) =>
      Icon !== backgroundIconByTheme[theme] && Icon !== textIconByTheme[theme]
  );

  // Find the selected text element
  const selectedText = textElements.find((el) => el.id === selectedTextId);
  // Find the selected image element
  const selectedImage = imageElements.find((el) => el.id === selectedImageId);

  // Toolbar buttons
  // Build toolbar buttons, inserting Music tool before Delete/Trash
  const toolbarButtons = [
    // ...other tool buttons...
    // We'll assemble them in the render below.
  ];

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-4 border-neutral-300 p-8 text-center text-neutral-500"
      onClick={() => {
        setSelectedTextId(null);
        setSelectedImageId(null);
        setSelectedStickyId(null);
        setSelectedStickerId(null);
        setSelectedAudioId(null);
      }}
    >
      {/* Toolbar group removed */}
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
      <p className="text-sm">
        The interactive canvas is temporarily disabled while we rebuild it.
      </p>
      {/* Render image elements (draggable, resizable, rotatable) */}
      <div
        className="relative mt-8 flex flex-col items-center"
        style={{ width: "100%", height: 400 }}
      >
        {/* Render audio elements */}
        {audioElements
          .slice()
          .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
          .map((el) => {
            const isSelected = el.id === selectedAudioId;
            return (
              <div
                key={el.id}
                className={clsx(
                  "absolute select-none transition group",
                  isSelected ? "outline-2 outline-green-500 z-50" : "z-25"
                )}
                style={{
                  left: el.x,
                  top: el.y,
                  minWidth: 180,
                  minHeight: 64,
                  maxWidth: 280,
                  background: "#f0fdf4",
                  borderRadius: 12,
                  boxShadow: "0 2px 10px rgba(0,128,64,0.10)",
                  border: isSelected ? "2px solid #22c55e" : "1.5px solid #a7f3d0",
                  zIndex: el.zIndex ?? 25,
                  cursor: "move",
                  userSelect: "none",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                }}
                onMouseDown={(e) => handleAudioDragStart(e, el.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAudioId(el.id);
                  setSelectedTextId(null);
                  setSelectedImageId(null);
                  setSelectedStickyId(null);
                  setSelectedStickerId(null);
                }}
              >
                {/* Play/pause button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudioPlay(el.id);
                  }}
                  title={el.playing ? "Pause" : "Play"}
                  className={clsx(
                    "m-3 rounded-full w-10 h-10 flex items-center justify-center text-white",
                    el.playing ? "bg-green-600" : "bg-green-400 hover:bg-green-500"
                  )}
                  style={{ flexShrink: 0, fontSize: 20 }}
                  type="button"
                >
                  {el.playing ? "⏸" : "▶️"}
                </button>
                {/* Title/artist info */}
                <div className="flex-1 py-2 pr-2 min-w-0">
                  <div className="font-semibold text-green-900 truncate" style={{ fontSize: 15 }}>
                    {el.title || "Audio"}
                  </div>
                  {el.artist && (
                    <div className="text-green-700 text-xs truncate">{el.artist}</div>
                  )}
                </div>
                {/* Delete button */}
                <button
                  className="rounded-full w-8 h-8 flex items-center justify-center text-green-700 hover:bg-green-100 m-2"
                  title="Delete audio"
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    deleteAudioElementById(el.id);
                  }}
                >
                  ✖
                </button>
                {/* Hidden audio tag */}
                <audio
                  id={`audio-${el.id}`}
                  src={el.src}
                  style={{ display: "none" }}
                  onEnded={() => {
                    setAudioElements((prev) =>
                      prev.map((a) =>
                        a.id === el.id ? { ...a, playing: false } : a
                      )
                    );
                  }}
                />
              </div>
            );
          })}
        {/* Render sticky notes */}
        {stickyNotes.map((el) => {
          const isSelected = el.id === selectedStickyId;
          return (
            <div
              key={el.id}
              className={clsx(
                "absolute select-none transition group",
                isSelected ? "outline-2 outline-yellow-500 z-40" : "z-10"
              )}
              style={{
                left: el.x,
                top: el.y,
                width: 200,
                minHeight: 110,
                transform: `rotate(${el.rotation}deg)`,
                cursor: "move",
                zIndex: isSelected ? 40 : 10,
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                borderRadius: 14,
                background: el.color,
                padding: 0,
                userSelect: "none",
                transition: "box-shadow 0.2s, border 0.2s",
              }}
              onMouseDown={(e) => handleStickyDragStart(e, el.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStickyId(el.id);
                setSelectedTextId(null);
                setSelectedImageId(null);
              }}
            >
              {/* Floating toolbar */}
              {isSelected && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-12 z-50 flex gap-2 items-center bg-white shadow-lg rounded p-2 border border-gray-200"
                  style={{
                    minWidth: 220,
                    whiteSpace: "nowrap",
                    fontFamily: "Inter, Arial, sans-serif",
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {/* Color picker */}
                  <input
                    type="color"
                    value={el.color}
                    onChange={(e) =>
                      updateStickyNoteById(el.id, { color: e.target.value })
                    }
                    style={{
                      width: 28,
                      height: 28,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                    title="Change color"
                  />
                  {/* Font size */}
                  <label className="flex items-center gap-1 text-xs">
                    Size
                    <input
                      type="number"
                      min={12}
                      max={48}
                      value={el.fontSize}
                      onChange={(e) =>
                        updateStickyNoteById(el.id, {
                          fontSize: Number(e.target.value),
                        })
                      }
                      className="w-10 px-1 py-0.5 border rounded"
                    />
                  </label>
                  {/* Bold */}
                  <button
                    className={clsx(
                      "px-2 py-1 rounded font-bold text-xs",
                      el.bold ? "bg-blue-200" : "bg-gray-100"
                    )}
                    onClick={() =>
                      updateStickyNoteById(el.id, { bold: !el.bold })
                    }
                    title="Bold"
                    type="button"
                  >
                    B
                  </button>
                  {/* Rotate */}
                  <button
                    className="px-2 py-1 rounded text-xs bg-gray-100"
                    onClick={() =>
                      updateStickyNoteById(el.id, {
                        rotation: el.rotation + 10,
                      })
                    }
                    title="Rotate +10°"
                    type="button"
                  >
                    <RotateCw size={14} />
                  </button>
                  {/* Insert bullet pointer */}
                  <button
                    className="px-2 py-1 rounded text-xs bg-gray-100"
                    onClick={() => {
                      // Insert bullet at caret or at start if not focused
                      // For simplicity, just prepend "• " to the text
                      if (!el.text.startsWith("• ")) {
                        updateStickyNoteById(el.id, { text: "• " + el.text });
                      } else {
                        updateStickyNoteById(el.id, { text: "• " + el.text });
                      }
                    }}
                    title="Insert bullet"
                    type="button"
                  >
                    •
                  </button>
                  {/* Delete */}
                  <button
                    className="px-2 py-1 rounded text-xs bg-red-100 hover:bg-red-300 text-red-700"
                    title="Delete"
                    type="button"
                    onClick={() => deleteStickyNoteById(el.id)}
                  >
                    ✖
                  </button>
                </div>
              )}
              {/* Sticky note textarea */}
              <textarea
                value={el.text}
                onChange={(e) =>
                  updateStickyNoteById(el.id, { text: e.target.value })
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStickyId(el.id);
                  setSelectedTextId(null);
                  setSelectedImageId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // Continue bullets if previous line is a bullet
                    e.preventDefault();
                    const textarea = e.currentTarget;
                    const value = textarea.value;
                    const start = textarea.selectionStart ?? 0;
                    const end = textarea.selectionEnd ?? 0;
                    // Find start of current line
                    const before = value.slice(0, start);
                    const after = value.slice(end);
                    // Find the start of the current line
                    const lastLineBreak = before.lastIndexOf("\n");
                    const currentLine =
                      lastLineBreak === -1
                        ? before
                        : before.slice(lastLineBreak + 1);
                    let bullet = "";
                    if (/^\s*• /.test(currentLine)) {
                      bullet = "• ";
                    }
                    // Insert newline and bullet if needed
                    const insert = "\n" + bullet;
                    const newValue = before + insert + after;
                    updateStickyNoteById(el.id, { text: newValue });
                    // Set caret after bullet
                    setTimeout(() => {
                      textarea.selectionStart = textarea.selectionEnd =
                        start + insert.length;
                    }, 0);
                  }
                }}
                className="w-full h-full block bg-transparent resize-none outline-none border-none p-4 rounded"
                style={{
                  fontSize: el.fontSize,
                  fontWeight: el.bold ? "bold" : "normal",
                  color: "#333",
                  minHeight: 70,
                  borderRadius: 14,
                  background: "none",
                  boxShadow: "none",
                  fontFamily: "Inter, Arial, sans-serif",
                  lineHeight: 1.4,
                }}
                spellCheck={false}
              />
            </div>
          );
        })}
        {imageElements
          .slice()
          .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
          .map((el) => {
            const isSelected = el.id === selectedImageId;
            // Texture overlay: use pseudo-element or absolutely positioned div
            return (
              <div
                key={el.id}
                className={clsx(
                  "absolute select-none transition group",
                  isSelected ? "outline-2 outline-blue-500 z-30" : "z-20"
                )}
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  transform: `rotate(${el.rotation}deg)${el.flip ? " scaleX(-1)" : ""
                    }`,
                  cursor: "move",
                  userSelect: "none",
                  zIndex: el.zIndex ?? 10,
                }}
                onMouseDown={(e) => handleImageDragStart(e, el.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageId(el.id);
                  setSelectedTextId(null);
                }}
              >
                {/* Frame wrapper if specified */}
                {el.frame === "polaroid" ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#fff",
                      border: "2px solid #eee",
                      borderRadius: 8,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                      padding: "8px 8px 32px 8px",
                      position: "relative",
                      boxSizing: "border-box",
                      overflow: "visible",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "calc(100% - 16px)",
                        display: "block",
                      }}
                    >
                      <img
                        src={el.src}
                        alt=""
                        draggable={false}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 4,
                          opacity: el.opacity ?? 1,
                          pointerEvents: "none",
                          filter: `${el.texture ? "brightness(0.97) contrast(1.08)" : ""
                            } ${el.filter ?? ""}`,
                          transition: "box-shadow 0.2s",
                          boxShadow: el.texture
                            ? "0 4px 16px rgba(0,0,0,0.12)"
                            : undefined,
                          transform: el.flip ? "scaleX(-1)" : undefined,
                        }}
                      />
                      {/* Texture overlay (now only over img area) */}
                      {el.texture && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            backgroundImage: el.texture,
                            backgroundBlendMode: "multiply",
                            opacity: el.opacity ?? 1,
                            borderRadius: 4,
                          }}
                        />
                      )}
                    </div>
                    {/* Date + time for polaroid frame */}
                    {(el.dateStamp || el.timeStamp) && (
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          bottom: 6,
                          transform: "translateX(-50%)",
                          background: "transparent",
                          fontSize: "0.85em",
                          color: "#777",
                          textAlign: "center",
                          fontFamily: "inherit",
                          userSelect: "none",
                          opacity: 0.85,
                          pointerEvents: "none",
                        }}
                        aria-disabled="true"
                      >
                        {el.dateStamp}
                        {el.dateStamp && el.timeStamp ? ", " : ""}
                        {el.timeStamp}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <img
                      src={el.src}
                      alt=""
                      draggable={false}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 4,
                        opacity: el.opacity ?? 1,
                        pointerEvents: "none",
                        filter: `${el.texture ? "brightness(0.97) contrast(1.08)" : ""
                          } ${el.filter ?? ""}`,
                        transition: "box-shadow 0.2s",
                        boxShadow: el.texture
                          ? "0 4px 16px rgba(0,0,0,0.12)"
                          : undefined,
                        transform: el.flip ? "scaleX(-1)" : undefined,
                      }}
                    />
                    {/* Texture overlay */}
                    {el.texture && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          backgroundImage: el.texture,
                          backgroundBlendMode: "multiply",
                          opacity: el.opacity ?? 1,
                          borderRadius: 4,
                        }}
                      />
                    )}
                    {/* Only date for non-polaroid images */}
                    {el.dateStamp && (
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          bottom: 4,
                          transform: "translateX(-50%)",
                          background: "transparent",
                          fontSize: "0.85em",
                          color: "#777",
                          textAlign: "center",
                          fontFamily: "inherit",
                          userSelect: "none",
                          opacity: 0.85,
                          pointerEvents: "none",
                        }}
                        aria-disabled="true"
                      >
                        {el.dateStamp}
                      </div>
                    )}
                  </div>
                )}
                {/* Resize handle (bottom-left) */}
                {isSelected && (
                  <div
                    className="absolute z-40 flex items-center justify-center"
                    style={{
                      left: -12,
                      bottom: -12,
                      width: 18,
                      height: 18,
                      cursor: "nwse-resize",
                      pointerEvents: "auto",
                    }}
                    onMouseDown={(e) => handleImageResizeStart(e, el.id)}
                    title="Drag to resize"
                  >
                    <div
                      className="rounded-full border border-blue-400 bg-white hover:bg-blue-200 shadow"
                      style={{
                        width: 14,
                        height: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                      }}
                    >
                      ↔️
                    </div>
                  </div>
                )}
                {/* Rotate handle (bottom-right) */}
                {isSelected && (
                  <div
                    className="absolute z-40 flex items-center justify-center"
                    style={{
                      right: -12,
                      bottom: -12,
                      width: 18,
                      height: 18,
                      cursor: "grab",
                      pointerEvents: "auto",
                    }}
                    onMouseDown={(e) => handleImageRotateStart(e, el.id)}
                    title="Drag to rotate"
                  >
                    <div
                      className="rounded-full border border-blue-400 bg-white hover:bg-blue-200 shadow"
                      style={{
                        width: 14,
                        height: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                      }}
                    >
                      <RotateCw size={10} className="text-blue-500" />
                    </div>
                  </div>
                )}
                {/* Popup toolbar for selected image */}
                {isSelected && (
                  <ImagePopupToolbar
                    element={el}
                    updateElement={(updates) =>
                      updateImageElementById(el.id, updates)
                    }
                    deleteElement={() => deleteImageElementById(el.id)}
                    bringForward={() => changeImageZIndex(el.id, "up")}
                    sendBackward={() => changeImageZIndex(el.id, "down")}
                    replaceSrc={(src: string) =>
                      updateImageElementById(el.id, { src })
                    }
                  />
                )}
              </div>
            );
          })}
        {/* Render text elements as draggable/rotatable */}
        {textElements.map((el) => {
          const isSelected = el.id === selectedTextId;
          return (
            <div
              key={el.id}
              className={clsx(
                "absolute select-none transition group",
                isSelected ? "outline-1 outline-blue-500" : ""
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
                cursor: el.isEditing ? "text" : "move",
                userSelect: el.isEditing ? "text" : "none",
                zIndex: isSelected ? 3 : 2,
                minWidth: 60,
                minHeight: 32,
              }}
              onMouseDown={
                el.isEditing ? undefined : (e) => handleDragStart(e, el.id)
              }
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTextId(el.id);
                setSelectedImageId(null);
                setSelectedStickyId(null);
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
                    whiteSpace: "pre-line",
                  }}
                  className="focus:outline-none"
                  onBlur={(e) => {
                    // Save content as plain text with newlines
                    let html = e.currentTarget.innerHTML;
                    html = html
                      .replace(/<div><br><\/div>/g, "\n")
                      .replace(/<div>/g, "\n")
                      .replace(/<\/div>/g, "")
                      .replace(/<br\s*\/?>/gi, "\n");
                    const text = html.replace(/<\/?[^>]+(>|$)/g, "");
                    updateTextElementById(el.id, { text, isEditing: false });
                  }}
                  onInput={(e) => {
                    let html = (e.currentTarget as HTMLDivElement).innerHTML;
                    html = html
                      .replace(/<div><br><\/div>/g, "\n")
                      .replace(/<div>/g, "\n")
                      .replace(/<\/div>/g, "")
                      .replace(/<br\s*\/?>/gi, "\n");
                    const text = html.replace(/<\/?[^>]+(>|$)/g, "");
                    updateTextElementById(el.id, { text });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      // Insert line break
                      document.execCommand("insertLineBreak");
                      // If current text is a bullet list, continue bullet
                      const sel = window.getSelection();
                      if (!sel || !sel.anchorNode) return;
                      // Find the text content up to the caret
                      let node = sel.anchorNode;
                      let offset = sel.anchorOffset;
                      // Find current line text
                      let container = node;
                      while (
                        container &&
                        container.nodeType !== Node.ELEMENT_NODE &&
                        container.parentNode
                      ) {
                        container = container.parentNode;
                      }
                      // Get the line before the caret
                      let textUpToCaret = "";
                      if (
                        node.nodeType === Node.TEXT_NODE &&
                        typeof node.textContent === "string"
                      ) {
                        textUpToCaret = node.textContent.slice(0, offset);
                      }
                      // If the previous line starts with bullet
                      // Instead, get the line before the caret by walking up
                      let prevLine = "";
                      if (sel.anchorNode && sel.anchorNode.parentElement) {
                        // Try to get previous sibling or parent
                        let el = sel.anchorNode.parentElement;
                        // Try to find the previous line's text
                        if (el.previousSibling && el.previousSibling.textContent) {
                          prevLine = el.previousSibling.textContent;
                        } else if (el.textContent) {
                          prevLine = el.textContent;
                        }
                      }
                      // Fallback: get the text before caret and last line
                      let text = (e.currentTarget as HTMLDivElement).innerText;
                      let lines = text.split("\n");
                      let caretLineIdx = 0;
                      let caretPos = 0;
                      // Try to get caret's line index
                      if (sel && sel.anchorNode) {
                        // Find caret offset in text
                        let range = sel.getRangeAt(0);
                        let preCaretRange = range.cloneRange();
                        preCaretRange.selectNodeContents(e.currentTarget);
                        preCaretRange.setEnd(range.endContainer, range.endOffset);
                        let preCaretText = preCaretRange.toString();
                        caretPos = preCaretText.length;
                        // Find which line
                        let sum = 0;
                        for (let i = 0; i < lines.length; ++i) {
                          sum += lines[i].length + 1; // +1 for \n
                          if (caretPos < sum) {
                            caretLineIdx = i;
                            break;
                          }
                        }
                        prevLine =
                          caretLineIdx > 0 ? lines[caretLineIdx - 1] : lines[0];
                      }
                      // If previous line or current line starts with bullet, insert bullet
                      let bullet = "";
                      if (
                        (prevLine && /^\s*• /.test(prevLine)) ||
                        (lines[caretLineIdx] && /^\s*• /.test(lines[caretLineIdx]))
                      ) {
                        bullet = "• ";
                        // Insert bullet at caret
                        setTimeout(() => {
                          document.execCommand("insertText", false, bullet);
                        }, 0);
                      }
                    }
                  }}
                  ref={(node) => {
                    if (node && node.innerText !== el.text) {
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
                el.text
                  .split("\n")
                  .map((line, idx) => <div key={idx}>{line}</div>)
              )}
              {/* Popup toolbar for selected text */}
              {selectedText && selectedText.id === el.id && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-16 z-10 flex gap-2 items-center bg-white shadow-lg rounded p-2 border border-gray-200"
                  style={{
                    minWidth: 260,
                    whiteSpace: "nowrap",
                    fontFamily: "Inter, Arial, sans-serif",
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
                        <option
                          value={font}
                          key={font}
                          style={{ fontFamily: "Inter, Arial, sans-serif" }}
                        >
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
                    onClick={() =>
                      updateSelectedText({ bold: !selectedText.bold })
                    }
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
                    onClick={() =>
                      updateSelectedText({ italic: !selectedText.italic })
                    }
                    title="Italic"
                    type="button"
                  >
                    I
                  </button>
                  {/* Alignment */}
                  <div
                    className="flex gap-0.5 items-center"
                    style={{ fontFamily: "Inter, Arial, sans-serif" }}
                  >
                    <button
                      className={clsx(
                        "px-2 py-1 rounded text-xs",
                        selectedText.align === "left"
                          ? "bg-blue-200"
                          : "bg-gray-100"
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
                        selectedText.align === "center"
                          ? "bg-blue-200"
                          : "bg-gray-100"
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
                        selectedText.align === "right"
                          ? "bg-blue-200"
                          : "bg-gray-100"
                      )}
                      style={{ fontFamily: "Inter, Arial, sans-serif" }}
                      onClick={() => updateSelectedText({ align: "right" })}
                      title="Align right"
                      type="button"
                    >
                      <span style={{ fontFamily: "monospace" }}>R</span>
                    </button>
                  </div>
                  {/* Insert bullet pointer */}
                  <button
                    className="px-2 py-1 rounded text-xs bg-gray-100"
                    onClick={() => {
                      // Insert bullet at caret or at start if not focused
                      // For simplicity, just prepend "• " to the text
                      if (!selectedText.text.startsWith("• ")) {
                        updateSelectedText({ text: "• " + selectedText.text });
                      } else {
                        updateSelectedText({ text: "• " + selectedText.text });
                      }
                    }}
                    title="Insert bullet"
                    type="button"
                  >
                    •
                  </button>
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
                  updateRotation={(rotation: number) =>
                    updateTextElementById(el.id, { rotation })
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    <div className="absolute bottom-8 flex gap-3 items-center">
      <BackgroundPopup
        theme={theme}
        setBackground={setBackground}
        background={background}
        onAddImage={addImageElement}
      />
      {/* Always render Add Text button */}
      <button
        className={clsx(buttonClass(theme), hoverFX(theme))}
        onClick={addTextElement}
        title="Add text"
        type="button"
      >
        {React.createElement(textIconByTheme[theme], { size: 18 })}
      </button>
      {/* Sticky Note button */}
      <button
        className={clsx(buttonClass(theme), hoverFX(theme))}
        onClick={addStickyNote}
        title="Add sticky note"
        type="button"
      >
        {React.createElement(stickyNoteIconByTheme[theme], { size: 18 })}
      </button>
      {/* Sticker Sheet Button (custom popup) */}
      <StickerSheetButton
        Icon={stickerIconByTheme[theme]}
        theme={theme}
        addStickerElement={addStickerElement}
      />
      {/* Other toolbar icons */}
      {filteredIcons.map((Icon, index) => {
        // Special case for image tool (LucideImage)
        if (Icon === LucideImage) {
          return (
            <ImageToolButton
              Icon={Icon}
              theme={theme}
              addImageElement={addImageElement}
              key={index}
            />
          );
        }
        // Default rendering for other icons
        // return (
        //   <button
        //     key={index}
        //     className={clsx(buttonClass(theme), hoverFX(theme))}
        //   >
        //     <Icon size={18} />
        //   </button>
        // );
      })}
      {/* MusicSearchPopup (Spotify/YouTube search, upload, record) */}
      <MusicSearchPopup theme={theme} addAudioElement={addAudioElement} />
      {/* AudioPopup */}
      <AudioPopup theme={theme} onAddAudio={addAudioElement} />
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
      {/* Render sticker elements (draggable, resizable, rotatable, deletable) */}
      {stickerElements
        .slice()
        .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
        .map((el) => {
          const isSelected = el.id === selectedStickerId;
          return (
            <div
              key={el.id}
              className={clsx(
                "absolute select-none transition group",
                isSelected ? "outline-2 outline-pink-500 z-35" : "z-15"
              )}
              style={{
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                transform: `rotate(${el.rotation}deg)`,
                cursor: "move",
                userSelect: "none",
                zIndex: el.zIndex ?? 20,
              }}
              onMouseDown={(e) => handleStickerDragStart(e, el.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStickerId(el.id);
                setSelectedTextId(null);
                setSelectedImageId(null);
                setSelectedStickyId(null);
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                <img
                  src={el.src}
                  alt=""
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: 12,
                    opacity: 1,
                    pointerEvents: "none",
                    boxShadow: "0 2px 8px rgba(80,0,80,0.10)",
                  }}
                />
              </div>
              {/* Resize handle (bottom-left) */}
              {isSelected && (
                <div
                  className="absolute z-40 flex items-center justify-center"
                  style={{
                    left: -10,
                    bottom: -10,
                    width: 18,
                    height: 18,
                    cursor: "nwse-resize",
                    pointerEvents: "auto",
                  }}
                  onMouseDown={(e) => handleStickerResizeStart(e, el.id)}
                  title="Drag to resize"
                >
                  <div
                    className="rounded-full border border-pink-400 bg-white hover:bg-pink-200 shadow"
                    style={{
                      width: 14,
                      height: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                    }}
                  >
                    ↔️
                  </div>
                </div>
              )}
              {/* Rotate handle (bottom-right) */}
              {isSelected && (
                <div
                  className="absolute z-40 flex items-center justify-center"
                  style={{
                    right: -10,
                    bottom: -10,
                    width: 18,
                    height: 18,
                    cursor: "grab",
                    pointerEvents: "auto",
                  }}
                  onMouseDown={(e) => handleStickerRotateStart(e, el.id)}
                  title="Drag to rotate"
                >
                  <div
                    className="rounded-full border border-pink-400 bg-white hover:bg-pink-200 shadow"
                    style={{
                      width: 14,
                      height: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                    }}
                  >
                    <RotateCw size={10} className="text-pink-500" />
                  </div>
                </div>
              )}
              {/* Delete button */}
              {isSelected && (
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    deleteStickerElementById(el.id);
                  }}
                  className="absolute -top-3 -right-3 z-20 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-700 shadow"
                  title="Delete sticker"
                  tabIndex={0}
                  style={{ fontSize: 16, lineHeight: 1 }}
                >
                  ✖
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default CanvasBoard;

// Popup toolbar for selected image element
const textures = [
  {
    name: "Paper",
    style: "url('https://www.transparenttextures.com/patterns/paper.png')",
  },
  {
    name: "Noise",
    style:
      "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')",
  },
];

const frames = [
  { name: "None", value: undefined },
  { name: "Polaroid", value: "polaroid" },
];

const ImagePopupToolbar: React.FC<{
  element: ImageElement;
  updateElement: (updates: Partial<ImageElement>) => void;
  deleteElement: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  replaceSrc: (src: string) => void;
}> = ({
  element,
  updateElement,
  deleteElement,
  bringForward,
  sendBackward,
  replaceSrc,
}) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const triggerFileInput = () => fileInputRef.current?.click();
    const onReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        replaceSrc(url);
      }
    };
    return (
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-20 z-50 flex gap-2 items-center bg-white shadow-lg rounded p-2 border border-gray-200"
        style={{
          minWidth: 250,
          whiteSpace: "nowrap",
          fontFamily: "Inter, Arial, sans-serif",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Texture */}
        <div className="flex gap-1 items-center">
          <span className="text-xs">Texture</span>
          <button
            className={clsx(
              "px-2 py-1 rounded text-xs",
              !element.texture ? "bg-blue-200" : "bg-gray-100"
            )}
            onClick={() => updateElement({ texture: undefined })}
            title="No texture"
          >
            None
          </button>
          {textures.map(({ name, style }) => (
            <button
              key={name}
              onClick={() => updateElement({ texture: style })}
              className={clsx(
                "px-2 py-1 rounded text-xs",
                element.texture === style ? "bg-blue-200" : "bg-gray-100"
              )}
              style={{
                backgroundImage: style,
                backgroundSize: "auto",
                backgroundRepeat: "repeat",
              }}
              title={name}
            >
              {name}
            </button>
          ))}
          {/* Opacity */}
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={element.opacity ?? 1}
            onChange={(e) => updateElement({ opacity: Number(e.target.value) })}
            style={{ width: 48 }}
            title="Texture opacity"
          />
        </div>
        {/* Filter controls */}
        <div className="flex gap-1 items-center">
          <span className="text-xs">Filter</span>
          <button
            className="px-2 py-1 rounded text-xs bg-gray-100"
            onClick={() => updateElement({ filter: "none" })}
          >
            None
          </button>
          <button
            className="px-2 py-1 rounded text-xs bg-gray-100"
            onClick={() => updateElement({ filter: "grayscale(100%)" })}
          >
            B/W
          </button>
          <button
            className="px-2 py-1 rounded text-xs bg-gray-100"
            onClick={() => updateElement({ filter: "sepia(60%)" })}
          >
            Vintage
          </button>
          <button
            className="px-2 py-1 rounded text-xs bg-gray-100"
            onClick={() =>
              updateElement({ filter: "contrast(1.5) saturate(1.2)" })
            }
          >
            Pop
          </button>
        </div>
        {/* Frame */}
        <div className="flex gap-1 items-center">
          <span className="text-xs">Frame</span>
          {frames.map(({ name, value }) => (
            <button
              key={name}
              className={clsx(
                "px-2 py-1 rounded text-xs",
                element.frame === value ? "bg-blue-200" : "bg-gray-100"
              )}
              onClick={() => updateElement({ frame: value })}
            >
              {name}
            </button>
          ))}
        </div>
        {/* Replace */}
        <button
          className="px-2 py-1 rounded text-xs bg-yellow-100 hover:bg-yellow-200"
          title="Replace image"
          type="button"
          onClick={triggerFileInput}
        >
          Replace
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={onReplace}
          ref={fileInputRef}
          className="hidden"
        />
        {/* Delete */}
        <button
          className="px-2 py-1 rounded text-xs bg-red-100 hover:bg-red-300 text-red-700"
          title="Delete"
          type="button"
          onClick={deleteElement}
        >
          🗑️
        </button>
        {/* Layer control */}
        {/* <button
        className="px-2 py-1 rounded text-xs bg-gray-100"
        title="Bring forward"
        onClick={bringForward}
      >
        ▲
      </button>
      <button
        className="px-2 py-1 rounded text-xs bg-gray-100"
        title="Send backward"
        onClick={sendBackward}
      >
        ▼
      </button> */}
      </div>
    );
  };

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

  // Position: bottom-right, just outside the text element
  return (
    <div
      ref={handleRef}
      className="absolute z-20 flex items-center justify-center"
      style={{
        right: -16, // moved from left to right
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

// Dedicated ImageToolButton component for the toolbar
type ImageToolButtonProps = {
  Icon: React.ComponentType<{ size?: number }>;
  theme: Theme;
  addImageElement: (src: string) => void;
};

const ImageToolButton: React.FC<ImageToolButtonProps> = ({
  Icon,
  theme,
  addImageElement,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerFileInput = () => {
    inputRef.current?.click();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addImageElement(url);
    }
  };
  return (
    <>
      <button
        className={clsx(buttonClass(theme), hoverFX(theme))}
        title="Add image"
        type="button"
        onClick={triggerFileInput}
      >
        <Icon size={18} />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
};

// Dedicated StickerToolButton component for the toolbar
type StickerToolButtonProps = {
  Icon: React.ComponentType<{ size?: number }>;
  theme: Theme;
  addStickerElement: (src: string) => void;
};

const StickerToolButton: React.FC<StickerToolButtonProps> = ({
  Icon,
  theme,
  addStickerElement,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerFileInput = () => {
    inputRef.current?.click();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addStickerElement(url);
    }
  };
  return (
    <>
      <button
        className={clsx(buttonClass(theme), hoverFX(theme))}
        title="Add sticker"
        type="button"
        onClick={triggerFileInput}
      >
        <Icon size={18} />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
};
// StickerToolButton component
// type StickerToolButtonProps = {
//   Icon: React.ComponentType<{ size?: number }>;
//   theme: Theme;
//   addStickerElement: (src: string) => void;
// };

// const StickerToolButton: React.FC<StickerToolButtonProps> = ({
//   Icon,
//   theme,
//   addStickerElement,
// }) => {
//   const [open, setOpen] = React.useState(false);
//   const fileInputRef = React.useRef<HTMLInputElement>(null);

//   // Preset sticker image URLs
//   const presetStickers = [
//     "https://placekitten.com/80/80",
//     "https://placebear.com/80/80",
//     "https://picsum.photos/80",
//     "https://placekitten.com/81/80",
//     "https://placebear.com/81/80",
//     "https://picsum.photos/81",
//     "https://placekitten.com/80/81",
//     "https://placebear.com/80/81",
//     "https://picsum.photos/82",
//   ];

//   // When a preset sticker is clicked
//   const handleStickerClick = (src: string) => {
//     addStickerElement(src);
//     setOpen(false);
//   };

//   // On upload button click
//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   // On file selection
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       addStickerElement(url);
//       setOpen(false);
//       // Optionally: clear input value so same file can be uploaded again
//       e.target.value = "";
//     }
//   };

//   return (
//     <Popup
//       trigger={
//         <button
//           aria-label="Add sticker"
//           className={clsx(buttonClass(theme), hoverFX(theme))}
//           type="button"
//         >
//           <Icon size={18} />
//         </button>
//       }
//       position="top center"
//       closeOnDocumentClick
//       arrow={false}
//       contentStyle={{
//         padding: "1rem",
//         borderRadius: "0.5rem",
//         boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//         maxWidth: "260px",
//       }}
//       open={open}
//       onOpen={() => setOpen(true)}
//       onClose={() => setOpen(false)}
//     >
//       <div
//         className={clsx(
//           "flex flex-col gap-4 p-2 rounded-lg",
//           panelThemeClass(theme)
//         )}
//         style={{ minWidth: 200 }}
//       >
//         <div>
//           <p className="text-sm font-semibold mb-2">Stickers</p>
//           <div className="grid grid-cols-3 gap-2">
//             {presetStickers.map((src, i) => (
//               <button
//                 key={src}
//                 onClick={() => handleStickerClick(src)}
//                 className="rounded border border-transparent hover:border-pink-400 focus:border-pink-500 transition"
//                 style={{
//                   padding: 0,
//                   background: "none",
//                   cursor: "pointer",
//                 }}
//                 type="button"
//                 tabIndex={0}
//               >
//                 <img
//                   src={src}
//                   alt={`Sticker ${i + 1}`}
//                   style={{
//                     width: 56,
//                     height: 56,
//                     objectFit: "contain",
//                     borderRadius: 10,
//                     boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//                     background: "#fff",
//                   }}
//                   draggable={false}
//                 />
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="flex flex-col items-center">
//           <button
//             type="button"
//             onClick={triggerFileInput}
//             className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 transition"
//           >
//             Upload Sticker
//           </button>
//           <input
//             type="file"
//             accept="image/*"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             className="hidden"
//           />
//         </div>
//       </div>
//     </Popup>
//   );
// };
// StickerSheetButton: Custom Sticker popup for bottom toolbar
type StickerSheetButtonProps = {
  Icon: React.ComponentType<{ size?: number }>;
  theme: Theme;
  addStickerElement: (src: string) => void;
};

const StickerSheetButton: React.FC<StickerSheetButtonProps> = ({
  Icon,
  theme,
  addStickerElement,
}) => {
  const [open, setOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Placeholder stickers (SVG data URLs)
  const stickers: { name: string; url: string }[] = [
    {
      name: "Star",
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'><polygon points='36,8 44,28 66,28 48,42 54,64 36,52 18,64 24,42 6,28 28,28' fill='#FFD600' stroke='#FBC02D' stroke-width='3'/></svg>`
        ),
    },
    {
      name: "Heart",
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'><path d='M36 62s-20-13.6-20-28c0-7.2 5.8-13 13-13 4.2 0 8.2 2.2 10.4 5.6C41.8 23.2 45.8 21 50 21c7.2 0 13 5.8 13 13 0 14.4-20 28-20 28z' fill='#F06292' stroke='#AD1457' stroke-width='3'/></svg>`
        ),
    },
    {
      name: "Smile",
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'><circle cx='36' cy='36' r='32' fill='#FFF176' stroke='#FBC02D' stroke-width='3'/><circle cx='26' cy='32' r='4' fill='#333'/><circle cx='46' cy='32' r='4' fill='#333'/><path d='M24 44c4 4 16 4 20 0' stroke='#333' stroke-width='3' fill='none' stroke-linecap='round'/></svg>`
        ),
    },
    {
      name: "Flower",
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'><circle cx='36' cy='36' r='10' fill='#F06292'/><g><ellipse cx='36' cy='16' rx='8' ry='16' fill='#BA68C8' transform='rotate(0 36 36)'/><ellipse cx='36' cy='16' rx='8' ry='16' fill='#BA68C8' transform='rotate(60 36 36)'/><ellipse cx='36' cy='16' rx='8' ry='16' fill='#BA68C8' transform='rotate(120 36 36)'/><ellipse cx='36' cy='16' rx='8' ry='16' fill='#BA68C8' transform='rotate(180 36 36)'/><ellipse cx='36' cy='16' rx='8' ry='16' fill='#BA68C8' transform='rotate(240 36 36)'/><ellipse cx='36' cy='16' rx='8' ry='16' fill='#BA68C8' transform='rotate(300 36 36)'/></g></svg>`
        ),
    },
    {
      name: "Music Note",
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'><ellipse cx='26' cy='60' rx='10' ry='8' fill='#90CAF9'/><rect x='34' y='12' width='8' height='36' fill='#1976D2'/><ellipse cx='38' cy='56' rx='10' ry='8' fill='#90CAF9'/></svg>`
        ),
    },
    {
      name: "Candy",
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'><ellipse cx='36' cy='36' rx='16' ry='10' fill='#FFB74D' stroke='#F57C00' stroke-width='3'/><rect x='12' y='30' width='8' height='12' fill='#FFF59D' stroke='#FBC02D' stroke-width='2'/><rect x='52' y='30' width='8' height='12' fill='#FFF59D' stroke='#FBC02D' stroke-width='2'/></svg>`
        ),
    },
  ];

  // Theme icon for header
  const ThemeIcon = stickerIconByTheme[theme];

  // Slide-up effect styles
  const popupStyle: React.CSSProperties = {
    borderRadius: "1rem 1rem 0 0",
    boxShadow: "0 -4px 24px rgba(0,0,0,0.10)",
    padding: "1.25rem 1.25rem 1rem 1.25rem",
    minWidth: 340,
    maxWidth: 420,
    minHeight: 220,
    border: "none",
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: 0,
    transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s cubic-bezier(0.4,0,0.2,1)",
    zIndex: 100,
  };

  // Open popup handler
  const openPopup = () => setOpen(true);
  const closePopup = () => setOpen(false);

  // Handle sticker upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addStickerElement(url);
      closePopup();
    }
  };

  return (
    <Popup
      trigger={
        <button
          className={clsx(buttonClass(theme), hoverFX(theme))}
          aria-label="Stickers"
          type="button"
        >
          <Icon size={18} />
        </button>
      }
      position="top center"
      closeOnDocumentClick
      arrow={false}
      contentStyle={{
        ...popupStyle,
        background: undefined,
        // Let panelThemeClass control background
      }}
      open={open}
      onOpen={openPopup}
      onClose={closePopup}
      modal
    >
   
        <div
          className={clsx(
            "flex flex-col gap-2",
            panelThemeClass(theme),
            "rounded-t-2xl"
          )}
          style={{
            minHeight: 220,
            minWidth: 340, 
            maxWidth: 420,
            padding: "0",
            position: "relative",
            transition: "background 0.2s",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-black/10">
            <div className="flex items-center gap-2">
              <ThemeIcon size={22} />
              <span className="font-semibold text-lg">Stickers</span>
            </div>
         <button
              className="rounded-full p-2 text-gray-500 hover:bg-gray-200 transition"
              aria-label="Close"
              type="button"
              onClick={closePopup}
            >
              <span style={{ fontSize: 18 }}>✖</span>
            </button>
          </div>
          {/* Sticker grid */}
          <div className="px-5 py-4">
            <div className="grid grid-cols-3 gap-4">
              {stickers.map((sticker, idx) => (
                <button
                  key={sticker.name}
                  type="button"
                  className={clsx(
                    "rounded-xl bg-white shadow hover:shadow-lg transition border border-transparent hover:border-blue-400 flex items-center justify-center p-2"
                  )}
                  style={{
                    width: 72,
                    height: 72,
                  }}
                  title={sticker.name}
                  onClick={() => {
                    addStickerElement(sticker.url);
                    close();
                  }}
                >
                  <img
                    src={sticker.url}
                    alt={sticker.name}
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "contain",
                      pointerEvents: "none",
                      display: "block",
                    }}
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Upload sticker */}
          <div className="px-5 pb-4 flex items-center">
            <button
              className={clsx(
                "rounded bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600 transition"
              )}
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Sticker
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </div>
    
    </Popup>
  );
};
type MusicSearchPopupProps = {
  theme: Theme;
  addAudioElement: (src: string, title?: string, artist?: string) => void;
};

const MusicSearchPopup: React.FC<MusicSearchPopupProps> = ({ theme, addAudioElement }) => {
  const [open, setOpen] = React.useState(false);
  const [source, setSource] = React.useState<"youtube" | "spotify">("youtube");
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<
    Array<{
      id: string;
      title: string;
      artist?: string;
      duration: string;
      thumbnail?: string;
      src: string;
    }>
  >([]);
  const [previewId, setPreviewId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Small built-in audio (mock preview) - short beep WAV
  const MOCK_AUDIO_SRC =
    "data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQwAAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA"; // ultra-short placeholder tone

  const openPopup = () => setOpen(true);
  const closePopup = () => {
    setOpen(false);
    setPreviewId(null);
  };

  const doSearch = () => {
    setLoading(true);
    setError(null);
    // Simulate async search with mock data
    window.setTimeout(() => {
      // Create 5 mock tracks using the current query + source
      const base = query.trim() || (source === "spotify" ? "Lo-fi Focus" : "Chill Beats");
      const mock = Array.from({ length: 5 }).map((_, i) => ({
        id: `${source}-${Date.now()}-${i}`,
        title: `${base} #${i + 1}`,
        artist: source === "spotify" ? "Mock Artist" : "Mock Channel",
        duration: ["2:03", "3:12", "1:47", "2:56", "4:05"][i % 5],
        thumbnail:
          "data:image/svg+xml;utf8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80'><rect width='120' height='80' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%236b7280'>${source.toUpperCase()}</text></svg>`
          ),
        src: MOCK_AUDIO_SRC,
      }));
      setResults(mock);
      setLoading(false);
    }, 600);
  };

  const handlePreview = (id: string, src: string) => {
    try {
      // stop others
      const prevTags = document.querySelectorAll("audio[data-music-preview='1']");
      prevTags.forEach((a) => (a as HTMLAudioElement).pause());
      setPreviewId((cur) => (cur === id ? null : id));
      // play this one if toggled on
      window.setTimeout(() => {
        const tag = document.getElementById(`music-preview-${id}`) as HTMLAudioElement | null;
        if (tag) {
          if (previewId === id) {
            tag.pause();
          } else {
            tag.currentTime = 0;
            tag.play().catch(() => void 0);
          }
        }
      }, 0);
    } catch {
      // ignore
    }
  };

  const handleAddToCanvas = (item: { src: string; title: string; artist?: string }) => {
    addAudioElement(item.src, item.title, item.artist);
  };

  const triggerFilePicker = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addAudioElement(url, file.name);
    // Reset input value so same file can be picked again
    e.target.value = "";
    setOpen(false);
  };

  // --- Recording via MediaRecorder (mock-friendly; will no-op if unavailable) ---
  const [recording, setRecording] = React.useState(false);
  const [recURL, setRecURL] = React.useState<string | null>(null);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const rec = new MediaRecorder(stream);
      recorderRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecURL(url);
      };
      rec.start();
      setRecording(true);
    } catch (err) {
      setError("Microphone permission denied");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    setRecording(false);
  };

  const addRecording = () => {
    if (!recURL) return;
    addAudioElement(recURL, "Recording");
    setRecURL(null);
    setOpen(false);
  };

  // Button/icon trigger (theme-aware styles; using a simple note glyph for universal compatibility)
  const TriggerButton = (
    <button
      className={clsx(buttonClass(theme), hoverFX(theme))}
      aria-label="Music"
      title="Music"
      type="button"
    >
      {/* Using a simple glyph to avoid introducing new icon imports */}
      <span aria-hidden="true" style={{ fontSize: 16 }}>♪</span>
    </button>
  );

  return (
    <Popup
      trigger={TriggerButton}
      position="top center"
      closeOnDocumentClick
      arrow={false}
      contentStyle={{ padding: 0, border: "none", background: "transparent" }}
      open={open}
      onOpen={openPopup}
      onClose={closePopup}
      modal
    >
      <div
        className={clsx("flex flex-col rounded-t-2xl", panelThemeClass(theme))}
        style={{
          minWidth: 480,
          maxWidth: 640,
          borderRadius: "1rem 1rem 0 0",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.10)",
        }}
      >
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-black/10">
          {/* Left: Source + Search */}
          <div className="flex items-center gap-2 flex-1">
            <div className="inline-flex rounded overflow-hidden border border-black/10">
              <button
                type="button"
                className={clsx(
                  "px-3 py-1.5 text-sm",
                  source === "youtube" ? "bg-white/80" : "bg-transparent"
                )}
                onClick={() => setSource("youtube")}
                aria-pressed={source === "youtube"}
              >
                YouTube
              </button>
              <button
                type="button"
                className={clsx(
                  "px-3 py-1.5 text-sm",
                  source === "spotify" ? "bg-white/80" : "bg-transparent"
                )}
                onClick={() => setSource("spotify")}
                aria-pressed={source === "spotify"}
              >
                Spotify
              </button>
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={source === "spotify" ? "Search tracks or artists" : "Search videos"}
              className="flex-1 px-3 py-2 text-sm rounded border border-black/10 bg-white/80 outline-none"
              aria-label="Search"
              onKeyDown={(e) => {
                if (e.key === "Enter") doSearch();
              }}
            />
            <button
              type="button"
              onClick={doSearch}
              className="px-3 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
              aria-label="Search"
            >
              Search
            </button>
          </div>

          {/* Right: Upload + Record */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={triggerFilePicker}
              className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
              aria-label="Upload audio"
            >
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={onFileChange}
            />

            {!recording ? (
              <button
                type="button"
                onClick={startRecording}
                className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
                aria-label="Start recording"
              >
                Record
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="px-3 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                aria-label="Stop recording"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {error && (
            <div className="mb-3 text-sm text-red-600" role="alert">{error}</div>
          )}

          {recording && (
            <div className="mb-4 text-sm">Recording... speak now. Click Stop to finish.</div>
          )}
          {recURL && (
            <div className="mb-4 flex items-center gap-2">
              <audio controls src={recURL} className="h-8" />
              <button
                type="button"
                onClick={addRecording}
                className="px-3 py-1.5 text-sm rounded bg-green-500 text-white hover:bg-green-600"
              >
                Add to Canvas
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 rounded bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-sm text-gray-500">Start by searching for music or upload/record your own.</div>
          ) : (
            <ul className="divide-y divide-black/10">
              {results.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-16 h-10 rounded object-cover bg-gray-200"
                    draggable={false}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.title}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {item.artist} • {item.duration}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePreview(item.id, item.src)}
                      className="px-2 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
                      aria-label="Preview"
                      title="Preview"
                    >
                      {previewId === item.id ? "Pause" : "Preview"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCanvas(item)}
                      className="px-2 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                      aria-label="Add to Canvas"
                      title="Add to Canvas"
                    >
                      Add
                    </button>
                  </div>
                  {/* Hidden preview audio tag */}
                  <audio
                    id={`music-preview-${item.id}`}
                    data-music-preview="1"
                    src={item.src}
                    style={{ display: "none" }}
                    onEnded={() => setPreviewId(null)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 pb-4">
          <button
            type="button"
            onClick={closePopup}
            className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </Popup>
  );
};