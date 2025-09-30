"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import type { DraggableData, ResizableDelta } from "react-rnd";
import type { DraggableEvent } from "react-draggable";
// Inline ResizeDirection type since react-rnd does not export it
import clsx from "clsx";
import Image from "next/image";
import type { BoardElement, ImageElement, TextElement } from "./types";

type CanvasItemProps = {
  element: BoardElement;
  selected: boolean;
  shiftPressed: boolean;
  onSelect: (id: string) => void;
  onBringToFront: (id: string) => void;
  onChange: (id: string, updates: Partial<BoardElement>) => void;
  onDelete: (id: string) => void;
  onReplaceImage?: (id: string, file: File) => void;
};

const handleStyle = (visible: boolean): React.CSSProperties => ({
  width: "14px",
  height: "14px",
  borderRadius: "9999px",
  border: "1px solid rgba(15, 23, 42, 0.25)",
  background: "rgba(255,255,255,0.95)",
  boxShadow: "0 2px 6px rgba(15,23,42,0.18)",
  opacity: visible ? 1 : 0,
  transition: "opacity 0.12s ease",
});

function CanvasItem({
  element,
  selected,
  shiftPressed,
  onSelect,
  onBringToFront,
  onChange,
  onDelete,
  onReplaceImage,
}: CanvasItemProps) {
  const isText = element.kind === "text";
  const isImage = element.kind === "image";

  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(
    isText ? (element as TextElement).text : ""
  );

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isText && !isEditing) {
      setDraftText((element as TextElement).text);
    }
  }, [element, isEditing, isText]);

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.select();
    }
  }, [isEditing]);

  const enableResizing = useMemo(() => {
    if (isText) return false;
    if (isEditing) return false;
    return {
      top: false,
      right: false,
      bottom: false,
      left: false,
      topLeft: false,
      topRight: false,
      bottomLeft: true,
      bottomRight: false,
    };
  }, [isText, isEditing]);

  const handleStyles = useMemo(() => {
    const visible = selected && !isEditing;
    const base = handleStyle(visible);
    return isText
      ? {}
      : {
          bottomLeft: base,
        };
  }, [isText, isEditing, selected]);

  const handleDragStop = useCallback(
    (_event: DraggableEvent, data: DraggableData) => {
      onChange(element.id, { x: data.x, y: data.y });
    },
    [element.id, onChange]
  );

  const handleResizeStop = useCallback(
    (
      _event: MouseEvent | TouchEvent,
      _dir: ResizeDirection,
      ref: HTMLElement,
      _delta: ResizableDelta,
      position: { x: number; y: number }
    ) => {
      onChange(element.id, {
        w: parseFloat(ref.style.width),
        h: parseFloat(ref.style.height),
        x: position.x,
        y: position.y,
      });
    },
    [element.id, onChange]
  );

  const handleDelete = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onDelete(element.id);
    },
    [element.id, onDelete]
  );

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      if (isText) {
        onBringToFront(element.id);
        setIsEditing(true);
      }
    },
    [element.id, isText, onBringToFront]
  );

  const handleTextBlur = useCallback(() => {
    if (!isText) return;
    onChange(element.id, { text: draftText });
    setIsEditing(false);
  }, [draftText, element.id, isText, onChange]);

  const handleTextKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleTextBlur();
      } else if (event.key === "Escape") {
        event.preventDefault();
        setDraftText((element as TextElement).text);
        setIsEditing(false);
      }
    },
    [element, handleTextBlur]
  );

  const openReplacePicker = useCallback(() => {
    if (replaceInputRef.current) {
      replaceInputRef.current.value = "";
      replaceInputRef.current.click();
    }
  }, []);

  const handleReplaceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && onReplaceImage) {
        onReplaceImage(element.id, file);
      }
      event.target.value = "";
    },
    [element.id, onReplaceImage]
  );

  const lockAspectRatio = isImage && !shiftPressed && !isEditing;

  return (
    <Rnd
      className="canvas-item"
      bounds="parent"
      size={{ width: element.w, height: element.h }}
      position={{ x: element.x, y: element.y }}
      disableDragging={isEditing}
      enableResizing={enableResizing}
      resizeHandleStyles={handleStyles}
      lockAspectRatio={lockAspectRatio}
      onDragStart={() => {
        onBringToFront(element.id);
        onSelect(element.id);
      }}
      onDragStop={handleDragStop}
      onResizeStart={() => {
        onBringToFront(element.id);
        onSelect(element.id);
      }}
      onResizeStop={handleResizeStop}
      style={{ zIndex: element.z }}
      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onSelect(element.id);
      }}
    >
      <div
        className={clsx(
          "relative h-[fit-content] w-[fit-content] border transition",
          selected
            ? "border-indigo-400 "
            : "border-transparent"
        )}
        style={{
          transform: `rotate(${element.rotation ?? 0}deg)`,
          transformOrigin: "center",
        }}
        onDoubleClick={handleDoubleClick}
      >
        {isText && (
          <>
            <div
              className={clsx(
                "flex h-full w-full cursor-text select-text break-words px-3 py-2 text-sm leading-snug text-ink",
                isEditing && "opacity-0"
              )}
              style={{
                justifyContent:
                  (element as TextElement).align === "center"
                    ? "center"
                    : (element as TextElement).align === "right"
                    ? "flex-end"
                    : "flex-start",
                textAlign: (element as TextElement).align,
                color: (element as TextElement).color,
                fontSize: (element as TextElement).fontSize,
                fontFamily: (element as TextElement).fontFamily,
                fontWeight: (element as TextElement).weight,
              }}
            >
              {(element as TextElement).text || "Double-click to edit"}
            </div>

            {isEditing && (
              <textarea
                ref={textAreaRef}
                value={draftText}
                onChange={(event) => setDraftText(event.target.value)}
                onBlur={handleTextBlur}
                onKeyDown={handleTextKeyDown}
                className="absolute inset-0 h-full w-full resize-none rounded-xl border border-indigo-400 bg-white/95 px-3 py-2 text-sm leading-snug text-ink outline-none shadow-lg"
              />
            )}
          </>
        )}

        {isImage && (
          <div className="pointer-events-none relative h-full w-full select-none">
            <Image
              src={(element as ImageElement).src}
              alt="Canvas asset"
              fill
              className="pointer-events-none select-none object-contain"
              draggable={false}
              unoptimized
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleDelete}
          className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-ink shadow-md transition hover:scale-105"
          aria-label="Delete element"
        >
          ×
        </button>

        {isImage && selected && !isEditing && (
          <div
            className="pointer-events-auto absolute -top-11 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink shadow-lg"
            data-canvas-ignore-keys
          >
            <button
              type="button"
              onClick={openReplacePicker}
              className="rounded-full px-2 py-1 transition hover:text-indigo-500"
            >
              Replace
            </button>
            <span className="h-3 w-px bg-border-subtle" aria-hidden />
            <button
              type="button"
              onClick={() => onDelete(element.id)}
              className="rounded-full px-2 py-1 transition hover:text-rose-500"
            >
              Delete
            </button>
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleReplaceChange}
            />
          </div>
        )}
      </div>
    </Rnd>
  );
}

export default React.memo(CanvasItem);

type ResizeDirection =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";